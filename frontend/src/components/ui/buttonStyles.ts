export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
    primary: 'bg-action text-white hover:bg-action-hover',
    secondary: 'border border-white/25 text-white hover:border-white hover:bg-white hover:text-[#111111]',
    ghost: 'text-slate-200 hover:text-white',
    danger: 'bg-alert text-white hover:brightness-125',
}

const SIZES: Record<Size, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-[15px]',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
    `inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${VARIANTS[variant]} ${SIZES[size]} ${extra}`
