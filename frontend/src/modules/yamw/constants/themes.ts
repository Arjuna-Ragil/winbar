export const themes: Record<string, any> = {
    emerald: {
        base: 'text-[var(--color-widget-text)] font-retro',
        muted: 'text-[var(--color-widget-text)] opacity-60 font-retro',
        accent: 'text-[var(--color-widget-active)] font-retro',
        dark: 'text-[var(--color-widget-hover)] font-retro',
        border: 'border-[var(--color-widget-active)] border',
        borderLight: 'border-[var(--color-widget)]',
        borderActive: 'border-[var(--color-widget-active)]',
        bgDark: 'bg-[var(--color-background)]',
        bgMuted: 'bg-[var(--color-widget)]',
        bgActive: 'bg-[var(--color-widget-active)]',
        bgHover: 'hover:bg-[var(--color-widget-hover)]',
        accentColor: 'accent-[var(--color-widget-active)]',
        shadow: 'shadow-[0_0_20px_var(--color-widget-active)]',
        selection: 'selection:bg-[var(--color-widget-active)] selection:bg-opacity-50',
        dot: 'bg-[var(--color-widget-active)]'
    }
};
