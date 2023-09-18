import type { Component } from 'solid-js';
import { Icon } from '../utils/icon';

interface TickBoxProps {
    value: () => boolean;
    disabled: () => boolean;
    onChange: (data: boolean, preventDefault: () => void) => void;
}

export const TickBox: Component<TickBoxProps> = ({ value, disabled, onChange }) => {
    return (
        <div
            class={
                'flex h-6 w-6 min-w-[1.5rem] cursor-pointer overflow-hidden rounded-md bg-gray-800 shadow-sm ring-1 ring-gray-700/60 ' +
                (disabled() &&
                    '!cursor-not-allowed !bg-gray-800/60 !text-gray-300 !shadow-none !outline-none !ring-0')
            }
            role='checkbox'
            aria-checked={value()}
            onClick={e => {
                if (disabled()) return;
                onChange(!value(), () => {
                    e.preventDefault();
                });
            }}
        >
            <div
                class={
                    'flex h-full w-full origin-center scale-50 items-center justify-center rounded-md bg-theme-600 p-1 opacity-0 transition-all ' +
                    (value() && '!scale-100 !opacity-100')
                }
            >
                <Icon name={() => 'Check'} class='text-white' />
            </div>
        </div>
    );
};
