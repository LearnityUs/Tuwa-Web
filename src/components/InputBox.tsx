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
                'placeholder:text-milk-700 dark:placeholder:text-rice-300 w-full rounded-md px-4 py-2 outline outline-offset-4 outline-transparent transition-all ' +
                (disabled()
                    ? 'bg-milk-300 dark:bg-rice-800 dark:text-rice-200 text-milk-800 cursor-not-allowed'
                    : 'bg-milk-200 dark:bg-rice-700 text-milk-950 dark:text-rice-50 shadow focus:outline-2 focus:outline-theme-400')
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
