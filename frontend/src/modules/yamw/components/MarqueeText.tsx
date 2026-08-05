import { useState, useEffect, useRef } from 'react';

export const MarqueeText = ({ text, className }: { text: string, className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (containerRef.current && textRef.current) {
                setShouldScroll(textRef.current.offsetWidth > containerRef.current.offsetWidth);
            }
        };

        checkScroll();
        if (document.fonts) {
            document.fonts.ready.then(checkScroll);
        }
    }, [text]);

    return (
        <div ref={containerRef} className={`overflow-hidden whitespace-nowrap w-full ${className || ''}`}>
            <div className={`${shouldScroll ? 'animate-[marquee_10s_linear_infinite] flex w-max text-left' : 'block truncate'}`}>
                <span ref={textRef} className={`${shouldScroll ? 'pr-8 shrink-0 block' : 'block truncate w-full'}`}>
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
