import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-md border border-slate-200 dark:border-slate-800">
      <table
        ref={ref}
        className={twMerge(clsx('w-full caption-bottom text-xs text-left text-slate-800 dark:text-slate-200', className))}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={twMerge(
      clsx('bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider text-2xs', className)
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={twMerge(clsx('divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900', className))}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={twMerge(
        clsx(
          'transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800',
          className
        )
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={twMerge(
      clsx('h-9 px-3 text-left align-middle font-semibold text-slate-600 dark:text-slate-300 [&:has([role=checkbox])]:pr-0', className)
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={twMerge(clsx('p-3 align-middle [&:has([role=checkbox])]:pr-0', className))}
    {...props}
  />
));
TableCell.displayName = 'TableCell';
