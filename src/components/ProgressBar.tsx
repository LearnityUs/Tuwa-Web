import type { Component } from 'solid-js';
import { FmtProps, flattenFmt } from '../locales';

interface ProgressBarProps {
    value: () => number;
    label: () => FmtProps;
}

export const ProgressBar: Component<ProgressBarProps> = ({ value, label }) => {
    return (
        <div
            class='h-2 w-full overflow-hidden rounded-full bg-gray-800 ring-1 ring-gray-700/60'
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value() * 100}
            aria-label={flattenFmt(label())}
        >
            <div
                class='h-2 w-min overflow-hidden rounded-full bg-theme-700 px-1 transition-all'
                style={{ width: `${value() * 100}%` }}
            />
        </div>
    );
};
