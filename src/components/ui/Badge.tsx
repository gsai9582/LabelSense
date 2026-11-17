import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'neutral' | 'pass' | 'review' | 'critical' | 'teal' | 'outline';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-medium uppercase tracking-wider transition-colors';

  const variants = {
    default:
      'bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    neutral:
      'bg-transparent text-slate-600 border border-slate-300 dark:border-slate-700 dark:text-slate-400',
    pass:
      'bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    review:
      'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    critical:
      'bg-red-50 text-red-800 border border-red-200/80 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/80',
    teal:
      'bg-teal-50 text-teal-800 border border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80',
    outline:
      'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
  };

  const dotColors = {
    default: 'bg-slate-400',
    neutral: 'bg-slate-400',
    pass: 'bg-emerald-500',
    review: 'bg-amber-500',
    critical: 'bg-red-500',
    teal: 'bg-teal-500',
    outline: 'bg-slate-400',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </div>
  );
};
