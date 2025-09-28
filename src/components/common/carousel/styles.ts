import type { JSX } from 'preact';

type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'very-fast';

interface CarouselStylesProps {
    direction: 'horizontal' | 'vertical';
    flow: 'normal' | 'reverse';
    position: number;
    isPaused: boolean;
    speed?: AnimationSpeed;
}

export function getCarouselStyles(props: CarouselStylesProps): {
    container: JSX.CSSProperties;
    content: JSX.CSSProperties;
} {
    const transform = props.direction === 'horizontal' ? 'translateX' : 'translateY';
    
    return {
        container: {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
        },
        content: {
            display: 'flex',
            flexDirection: props.direction === 'horizontal' ? 'row' : 'column',
            gap: 'var(--animation-carousel-gap)',
            position: 'absolute',
            willChange: 'transform',
            transform: `${transform}(${props.flow === 'reverse' ? props.position : -props.position}px)`,
            transition: props.isPaused ? 
                'none' : 
                `transform var(--animation-carousel-duration) var(--animation-carousel-timing)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
            left: 0,
            top: 0
        }
    };
}
