export interface CarouselProps {
    children: preact.ComponentChildren;
    direction?: 'horizontal' | 'vertical';
    flow?: 'normal' | 'reverse';
    speed?: number; // milliseconds per movement
    isInfiniteLoop?: boolean;
    className?: string;
}
