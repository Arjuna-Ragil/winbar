import { useState, useEffect } from 'react';
import { GetCoverURL } from "../../../../wailsjs/go/handlers/Stream";

export const CoverImage = ({ id, className, t }: { id: string, className?: string, t: any }) => {
    const [url, setUrl] = useState<string>('');
    useEffect(() => {
        let mounted = true;
        GetCoverURL(id).then(res => {
            if (mounted) setUrl(res);
        }).catch(console.error);
        return () => { mounted = false; };
    }, [id]);

    if (!url) return <div className={`${t.bgMuted} animate-pulse ${className || ''}`}></div>;
    return <img src={url} alt="Cover" className={className} />;
};
