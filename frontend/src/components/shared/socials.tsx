import type { ReactNode } from 'react';

export const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
    {
        label: 'Facebook',
        href: '#',
        icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
        label: 'X',
        href: '#',
        icon: <path d="M4 4l7.5 9.5L4 20h2l6.4-5.6L17 20h3l-7.9-10L19.5 4h-2l-5.9 5.2L7 4H4z" />,
    },
    {
        label: 'Instagram',
        href: '#',
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" />
            </>
        ),
    },
    {
        label: 'YouTube',
        href: '#',
        icon: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="4" />
                <path d="M10 9.5v5l4.5-2.5z" />
            </>
        ),
    },
];
