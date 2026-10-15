import React, { useCallback, useEffect, useId, useState } from 'react';
import { Check } from 'lucide-react';
import { useDismiss } from '@/hooks/useDismiss';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectMenuProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    /** Accessible name for the control. */
    label: string;
    /** Small caption shown above the options. */
    heading?: string;
    className?: string;
    triggerClassName?: string;
    panelClassName?: string;
    renderTrigger: (selected: SelectOption, open: boolean) => React.ReactNode;
}

/** Accessible custom select: button + listbox with full keyboard support. */
export const SelectMenu: React.FC<SelectMenuProps> = ({
    value,
    onChange,
    options,
    label,
    heading,
    className = '',
    triggerClassName = '',
    panelClassName = '',
    renderTrigger,
}) => {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);

    const close = useCallback(() => setOpen(false), []);
    const ref = useDismiss(open, close);

    const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
    const selected = options[selectedIndex];
    const optionId = (i: number) => `${id}-opt-${i}`;

    useEffect(() => {
        if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, active]);

    const openMenu = () => {
        setActive(selectedIndex);
        setOpen(true);
    };

    const choose = (i: number) => {
        onChange(options[i].value);
        setOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        const last = options.length - 1;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!open) openMenu();
                else setActive((a) => Math.min(a + 1, last));
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!open) openMenu();
                else setActive((a) => Math.max(a - 1, 0));
                break;
            case 'Home':
                if (open) {
                    e.preventDefault();
                    setActive(0);
                }
                break;
            case 'End':
                if (open) {
                    e.preventDefault();
                    setActive(last);
                }
                break;
            case 'Enter':
            case ' ':
                if (open) {
                    e.preventDefault();
                    choose(active);
                }
                break;
            case 'Tab':
                setOpen(false);
                break;
        }
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                role="combobox"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={id}
                aria-activedescendant={open ? optionId(active) : undefined}
                onClick={() => (open ? close() : openMenu())}
                onKeyDown={onKeyDown}
                className={triggerClassName}
            >
                {renderTrigger(selected, open)}
            </button>

            {open && (
                <div
                    className={`absolute left-0 top-full z-50 mt-3 min-w-[15rem] rounded-xl bg-panel-2 p-1.5 text-white shadow-[0_18px_44px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/10 animate-pop motion-reduce:animate-none ${panelClassName}`}
                >
                    {heading && (
                        <p className="px-3 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            {heading}
                        </p>
                    )}
                    <ul id={id} role="listbox" aria-label={label} className="">
                        {options.map((o, i) => {
                            const isSelected = o.value === value;
                            return (
                                <li
                                    key={o.value}
                                    id={optionId(i)}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setActive(i)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => choose(i)}
                                    className={`flex h-10 cursor-pointer items-center justify-between gap-6 rounded-lg px-3 text-sm transition-colors ${
                                        i === active ? 'bg-white/10' : ''
                                    } ${isSelected ? 'font-semibold text-white' : 'text-slate-200'}`}
                                >
                                    {o.label}
                                    {isSelected && <Check className="size-4" aria-hidden />}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};
