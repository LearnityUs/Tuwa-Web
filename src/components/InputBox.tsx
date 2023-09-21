import { createEffect, type Component } from 'solid-js';
import { flattenFmt, type FmtProps } from '../locales';

interface InputBoxProps {
    value: () => string;
    disabled: () => boolean;
    placeholder: FmtProps;
    inputMode: 'text' | 'numeric' | 'none' | 'url' | 'tel' | 'email' | 'search' | 'decimal';
    type: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url';
    onChange: (data: string, preventDefault: () => void) => void;
}

export const InputBox: Component<InputBoxProps> = ({
    value,
    disabled,
    placeholder,
    inputMode,
    type,
    onChange
}) => {
    let element: HTMLInputElement | null = null;

    createEffect(() => {
        if (element) {
            element.value !== value() && (element.value = value());
            element.disabled !== disabled() && (element.disabled = disabled());
        }
    });

    return (
        <input
            ref={e => {
                element = e;
            }}
            class={
                'w-full rounded-md bg-gray-800 px-4 py-2 text-white shadow-md outline-offset-4 outline-transparent ring-1 ring-gray-700/60 transition-all focus:outline focus:outline-2 focus:outline-theme-400' +
                (disabled() &&
                    '!cursor-not-allowed !bg-gray-900 !text-gray-300 !shadow-none !outline-none !ring-0')
            }
            inputMode={inputMode}
            type={type}
            value={value()}
            disabled={disabled()}
            placeholder={flattenFmt(placeholder)}
            onInput={e => {
                const value = e.currentTarget.value;
                onChange(value, () => {
                    e.preventDefault();
                });
            }}
        />
    );
};
