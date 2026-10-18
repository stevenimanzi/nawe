import React from 'react'

interface Chip {
    key: string
    label: string
}

interface ChipRowProps {
    chips: Chip[]
    value: string
    onChange: (key: string) => void
    label: string
}

/** A scrollable row of single-choice pills. */
export const ChipRow: React.FC<ChipRowProps> = ({ chips, value, onChange, label }) => (
    <div role="group" aria-label={label} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => (
            <button
                key={c.key}
                type="button"
                aria-pressed={value === c.key}
                onClick={() => onChange(c.key)}
                className={`h-10 shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-5 text-sm font-medium transition-colors ${
                    value === c.key
                        ? 'border-white bg-white text-[#111111]'
                        : 'border-white/20 text-slate-200 hover:border-white/50 hover:text-white'
                }`}
            >
                {c.label}
            </button>
        ))}
    </div>
)

interface ToggleProps {
    label: string
    pressed: boolean
    onChange: (pressed: boolean) => void
}

export const ToggleChip: React.FC<ToggleProps> = ({ label, pressed, onChange }) => (
    <button
        type="button"
        aria-pressed={pressed}
        onClick={() => onChange(!pressed)}
        className={`h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${
            pressed ? 'border-white bg-white text-[#111111]' : 'border-white/20 text-slate-200 hover:border-white/50 hover:text-white'
        }`}
    >
        {label}
    </button>
)
