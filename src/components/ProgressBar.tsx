import type { Component } from 'solid-js';
import { FmtProps, flattenFmt } from '../locales';

interface ProgressBarProps {
    value: () => number;
    label: () => FmtProps;
}

export const ProgressBar: Component<ProgressBarProps> = ({ value, label }) => {
    return (
        <div
            class='bg-milk-200 dark:bg-rice-800 h-2 w-full overflow-hidden rounded-full'
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value() * 100}
            aria-label={flattenFmt(label())}
        >
            <div
                class='dark:bg-themedark-700 h-2 w-min overflow-hidden rounded-full bg-theme-400 px-1 transition-all'
                style={{ width: `${value() * 100}%` }}
            />
        </div>
    );
};
