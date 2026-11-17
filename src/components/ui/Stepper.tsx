import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  onStepClick,
  className,
}) => {
  return (
    <nav aria-label="Progress" className={twMerge(clsx('w-full', className))}>
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isClickable = !!onStepClick && isCompleted;

          return (
            <li
              key={step.id}
              className={clsx(
                'relative flex-1 flex items-center',
                idx < steps.length - 1 ? 'pr-4 sm:pr-8' : ''
              )}
            >
              <div
                onClick={() => isClickable && onStepClick(idx)}
                className={clsx(
                  'group flex items-center gap-3 select-none',
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step Circle */}
                <div
                  className={clsx(
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors duration-200',
                    isCompleted
                      ? 'bg-teal-600 text-white dark:bg-teal-500'
                      : isCurrent
                      ? 'border-2 border-teal-600 text-teal-700 bg-teal-50/50 dark:border-teal-400 dark:text-teal-300 dark:bg-teal-950/40'
                      : 'border border-slate-300 text-slate-400 bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500'
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </div>

                {/* Step Text */}
                <div className="hidden sm:block min-w-0">
                  <p
                    className={clsx(
                      'text-xs font-medium truncate',
                      isCurrent
                        ? 'text-slate-900 dark:text-slate-100 font-semibold'
                        : isCompleted
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-2xs text-slate-400 dark:text-slate-500 truncate">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting Bar */}
              {idx < steps.length - 1 && (
                <div
                  className={clsx(
                    'hidden sm:block flex-1 h-0.5 ml-4 transition-colors duration-200',
                    idx < currentStepIndex
                      ? 'bg-teal-600 dark:bg-teal-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
