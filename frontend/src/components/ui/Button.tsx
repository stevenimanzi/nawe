import React from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { buttonClass, type Size, type Variant } from './buttonStyles'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    className = '',
    children,
    type = 'button',
    ...rest
}) => (
    <button type={type} disabled={disabled || loading} className={buttonClass(variant, size, className)} {...rest}>
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
    </button>
)

interface ButtonLinkProps extends LinkProps {
    variant?: Variant
    size?: Size
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ variant = 'primary', size = 'md', className = '', ...rest }) => (
    <Link className={buttonClass(variant, size, className)} {...rest} />
)
