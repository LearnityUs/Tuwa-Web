import { A } from '@solidjs/router';
import { createEffect, type Component, type JSX } from 'solid-js';
import { FmtProps, flattenFmt } from '../locales';

interface ButtonProps {
    children: JSX.Element;
    disabled: () => boolean;
    element?: 'button' | 'a';
    href?: string;
    topRightSharp?: boolean;
    style: 'primary' | 'secondary' | 'danger';
    ariaLabel?: FmtProps;
    onClick?: (preventDefault: () => void) => void;
}

export const Button: Component<ButtonProps> = ({
    children,
    disabled,
    element = 'button',
    href,
    topRightSharp,
    style,
    ariaLabel,
    onClick
}) => {
    let elementData: HTMLButtonElement | HTMLAnchorElement | null = null;

    const styles = {
        primary: 'ring-theme-600/60 bg-theme-700 hover:bg-theme-600 active:bg-theme-700',
        secondary: 'ring-gray-700/60 bg-gray-800 hover:bg-gray-700 active:bg-gray-600',
        danger: 'ring-danger-600/60 bg-danger-700 hover:bg-danger-600 active:bg-danger-500'
    };

    const className =
        'flex w-fit cursor-pointer items-center gap-2 rounded-lg px-4 py-2 shadow-md transition-all ring-1 outline-offset-4 outline-transparent focus:outline-theme-400 focus:outline focus:outline-2 ' +
        (disabled()
            ? '!bg-gray-800/60 !text-gray-300 !shadow-none !outline-none !ring-0 !cursor-not-allowed '
            : '') +
        styles[style] +
        ' ' +
        (topRightSharp ? 'rounded-tr' : '');

    createEffect(() => {
        if (!elementData) return;

        if (elementData instanceof HTMLButtonElement) {
            elementData.disabled !== disabled() && (elementData.disabled = disabled());
        }

        if (elementData instanceof HTMLAnchorElement) {
            elementData.ariaDisabled !== disabled().toString() &&
                (elementData.ariaDisabled = disabled().toString());
        }
    });

    if (element === 'a') {
        return (
            <A
                ref={e => {
                    elementData = e;
                }}
                href={href ?? ''}
                class={className}
                aria-label={ariaLabel && flattenFmt(ariaLabel)}
                aria-disabled={disabled()}
                onClick={e => {
                    if (disabled()) e.preventDefault();
                    onClick && onClick(() => e.preventDefault());
                }}
            >
                {children}
            </A>
        );
    }

    return (
        <button
            ref={e => {
                elementData = e;
            }}
            class={className}
            aria-label={ariaLabel && flattenFmt(ariaLabel)}
            onClick={e => {
                if (disabled()) e.preventDefault();
                onClick && onClick(() => e.preventDefault());
            }}
            disabled={disabled()}
        >
            {children}
        </button>
    );
};
