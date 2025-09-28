import { useEffect, useRef, useState } from 'preact/hooks';

interface UseCarouselAnimationProps {
    direction: 'horizontal' | 'vertical';
    flow: 'normal' | 'reverse';
    isInfiniteLoop: boolean;
    isPaused: boolean;
    containerRef: preact.RefObject<HTMLDivElement>;
    contentRef: preact.RefObject<HTMLDivElement>;
}

interface CarouselState {
    position: number;
    contentSize: number;
    containerSize: number;
    isReversing: boolean;
}

export function useCarouselAnimation({
    direction,
    flow,
    isInfiniteLoop,
    isPaused,
    containerRef,
    contentRef
}: UseCarouselAnimationProps) {
    const rafRef = useRef<number>();
    const [state, setState] = useState<CarouselState>({
        position: 0,
        contentSize: 0,
        containerSize: 0,
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
            
            setState(prev => ({
                ...prev,
                contentSize: newContentSize,
                containerSize: newContainerSize,
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
        const STEP = 1;

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
                const maxOffset = prev.contentSize - prev.containerSize;
                
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
    }, [direction, isPaused, isInfiniteLoop, flow]);

    return state;
}
