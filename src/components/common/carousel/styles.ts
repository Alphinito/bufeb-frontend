import type { JSX } from 'preact';

interface CarouselStylesProps {
    direction: 'horizontal' | 'vertical';
    flow: 'normal' | 'reverse';
    position: number;
    isPaused: boolean;
    className?: string;
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
            gap: '1rem',
            position: 'absolute',
            willChange: 'transform',
            transform: `${transform}(${props.flow === 'reverse' ? props.position : -props.position}px)`,
            transition: props.isPaused ? 'none' : 'transform 100ms linear',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
            left: 0,
            top: 0
        }
    };
}
