import { useState, useEffect, useLayoutEffect, useRef } from 'react';

export const MarqueeText = ({ text, className }: { text: string, className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    // Synchronously reset to non-scrolling state so it can be accurately measured on text change
    useLayoutEffect(() => {
        setShouldScroll(false);
    }, [text]);

    useEffect(() => {
        const checkScroll = () => {
            if (containerRef.current && textRef.current && !shouldScroll) {
                const textWidth = textRef.current.scrollWidth;
                const containerWidth = containerRef.current.clientWidth;
                
                // Only scroll if text is strictly larger and container is actually visible/has width
                if (textWidth > containerWidth && containerWidth > 0) {
                    setShouldScroll(true);
                }
            }
        };

        // Small timeout ensures the DOM has updated
        const timer = setTimeout(checkScroll, 50);

        // Also check on window resize
        const handleResize = () => {
            if (!shouldScroll) checkScroll();
        };
        window.addEventListener('resize', handleResize);

        if (document.fonts) {
            document.fonts.ready.then(checkScroll);
        }
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [text, shouldScroll]);

    return (
        <div ref={containerRef} className={`overflow-hidden whitespace-nowrap w-full ${className || ''}`}>
            <div className={`${shouldScroll ? 'animate-marquee flex w-max text-left' : 'block'}`}>
                <span ref={textRef} className={`${shouldScroll ? 'pr-8 shrink-0 block' : 'inline-block w-max max-w-none'}`}>
                    {text}
                </span>
                {shouldScroll && (
                    <span className="pr-8 shrink-0 block">
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
};
