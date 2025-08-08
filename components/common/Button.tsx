import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ isLoading = false, children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:cursor-not-allowed transition-all duration-200 ease-in-out active:scale-[0.98] active:brightness-95";

    const variantClasses = {
        primary: 'text-white bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 dark:disabled:bg-amber-800 dark:disabled:text-slate-400',
        secondary: 'text-slate-700 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800',
    };

    return (
        <button
        {...props}
        disabled={isLoading || props.disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
        {isLoading ? <LoadingSpinner /> : children}
        </button>
    );
};