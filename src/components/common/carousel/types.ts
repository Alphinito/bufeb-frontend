import type { ComponentChildren } from 'preact';

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'very-fast';

export interface CarouselProps {
    children: ComponentChildren;
    direction?: 'horizontal' | 'vertical';
    flow?: 'normal' | 'reverse';
    speed?: AnimationSpeed;
    isInfiniteLoop?: boolean;
    className?: string;
}
