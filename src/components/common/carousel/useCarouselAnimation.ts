import { useEffect, useRef, useState } from 'preact/hooks';

type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'very-fast';

interface UseCarouselAnimationProps {
    direction: 'horizontal' | 'vertical';
    flow: 'normal' | 'reverse';
    speed?: AnimationSpeed;
    isInfiniteLoop: boolean;
    isPaused: boolean;
    containerRef: preact.RefObject<HTMLDivElement>;
    contentRef: preact.RefObject<HTMLDivElement>;
}

interface CarouselState {
    position: number;
    isReversing: boolean;
}

export function useCarouselAnimation({
    direction,
    flow,
    speed = 'normal',
    isInfiniteLoop,
    isPaused,
    containerRef,
    contentRef
}: UseCarouselAnimationProps) {
    const rafRef = useRef<number>();
    const contentSizeRef = useRef<number>(0);
    const containerSizeRef = useRef<number>(0);
    const [state, setState] = useState<CarouselState>({
        position: 0,
        isReversing: false
    });

    // Inicialización y manejo de resize
    useEffect(() => {
        const updateDimensions = () => {
            const container = containerRef.current;
            const content = contentRef.current;
            if (!container || !content) return;

            const dimension = direction === 'horizontal' ? 'width' : 'height';
            const newContentSize = content.getBoundingClientRect()[dimension];
            const newContainerSize = container.getBoundingClientRect()[dimension];
            
            contentSizeRef.current = newContentSize;
            containerSizeRef.current = newContainerSize;
            setState(prev => ({
                ...prev,
                position: flow === 'reverse' ? -(newContentSize - newContainerSize) : 0
            }));
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current && contentRef.current) {
            resizeObserver.observe(containerRef.current);
            resizeObserver.observe(contentRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [direction, flow, containerRef, contentRef]);

    // Animación
    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        let lastTimestamp = 0;
        const FRAME_RATE = 60;
        const FRAME_TIME = 1000 / FRAME_RATE;
        
        // Obtener el valor de la variable CSS
        const computedStyle = getComputedStyle(document.documentElement);
        const speedValue = computedStyle.getPropertyValue(`--animation-speed-${speed}`).trim();
        const STEP = parseFloat(speedValue) || 1; // Fallback a 1 si no se puede parsear

        const animate = (timestamp: number) => {
            if (isPaused) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            if (timestamp - lastTimestamp < FRAME_TIME) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            lastTimestamp = timestamp;

            setState(prev => {
                const maxOffset = contentSizeRef.current - containerSizeRef.current;
                
                // Determinar la dirección base del movimiento
                const baseStep = flow === 'normal' ? STEP : -STEP;
                // Aplicar la reversión si es necesario
                const moveAmount = prev.isReversing ? -baseStep : baseStep;
                
                let newPosition = prev.position + moveAmount;
                let isReversing = prev.isReversing;

                // Manejar los límites según el modo
                if (flow === 'normal') {
                    if (newPosition >= maxOffset) {
                        if (isInfiniteLoop) {
                            newPosition = 0;
                        } else {
                            isReversing = true;
                            newPosition = maxOffset;
                        }
                    } else if (newPosition <= 0 && !isInfiniteLoop && isReversing) {
                        isReversing = false;
                        newPosition = 0;
                    }
                } else { // flow === 'reverse'
                    if (newPosition <= -maxOffset) {
                        if (isInfiniteLoop) {
                            newPosition = 0;
                        } else {
                            isReversing = true;
                            newPosition = -maxOffset;
                        }
                    } else if (newPosition >= 0 && !isInfiniteLoop && isReversing) {
                        isReversing = false;
                        newPosition = 0;
                    }
                }

                return {
                    ...prev,
                    position: newPosition,
                    isReversing
                };
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isPaused, isInfiniteLoop, flow]);

    return state;
}
