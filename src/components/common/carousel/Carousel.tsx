import { useCallback, useRef, useState } from 'preact/hooks';
import type { CarouselProps } from './types';
import { useCarouselAnimation } from './useCarouselAnimation';
import { getCarouselStyles } from './styles';

export default function Carousel({
    children,
    direction = 'horizontal',
    flow = 'normal',
    speed = 3000,
    isInfiniteLoop = true,
    className = ''
}: CarouselProps) {
    if (!children || (Array.isArray(children) && children.length === 0)) {
        throw new Error('Carousel must contain at least one child element');
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const { position, isReversing } = useCarouselAnimation({
        direction,
        flow,
        isInfiniteLoop,
        isPaused,
        containerRef,
        contentRef
    });

    const handleMouseEnter = useCallback(() => setIsPaused(true), []);
    const handleMouseLeave = useCallback(() => setIsPaused(false), []);

    const styles = getCarouselStyles({
        direction,
        flow,
        position,
        isPaused,
        className
    });

    return (
        <div 
            ref={containerRef}
            class={`carousel-container ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={styles.container}
        >
            <div 
                ref={contentRef}
                class="carousel-content"
                style={styles.content}
            >
                {children}
            </div>
        </div>
    );
}
