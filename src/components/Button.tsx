import { A } from '@solidjs/router';
import { createEffect, type Component, type JSX } from 'solid-js';
import { FmtProps, flattenFmt } from '../locales';

interface ButtonProps {
    children: JSX.Element;
    state?: () => 'default' | 'selected' | 'disabled';
    element?: 'button' | 'a';
    role?: JSX.HTMLAttributes<HTMLButtonElement>['role'];
    isIcon?: boolean;
    href?: string;
    style: 'primary' | 'bordered' | 'secondary' | 'danger';
    ariaLabel?: FmtProps;
    onClick?: (preventDefault: () => void) => void;
    class?: string;
    propData?: {
        [key: string]: unknown;
    };
}

export const Button: Component<ButtonProps> = ({
    children,
    state = () => 'default',
    element = 'button',
    role,
    isIcon = false,
    href,
    style,
    ariaLabel,
    onClick,
    propData = {},
    ...props
}) => {
    let elementData: HTMLButtonElement | HTMLAnchorElement | null = null;

    const styles = {
        primary: {
            default:
                'bg-theme-200 hover:bg-theme-300 active:bg-theme-300 shadow-md dark:bg-themedark-700 dark:hover:bg-themedark-600 dark:active:bg-themedark-600',
            selected: '!bg-theme-300 dark:!bg-theme-600',
            disabled: '!bg-theme-100 !shadow-none dark:!bg-theme-800'
        },
        secondary: {
            default:
                'bg-milk-300 hover:bg-milk-400 active:bg-milk-400 shadow-md dark:bg-rice-700 dark:hover:bg-rice-600 dark:active:bg-rice-600',
            selected: '!bg-milk-400 dark:!bg-rice-600',
            disabled: '!bg-milk-200 !shadow-none dark:!bg-rice-800'
        },
        bordered: {
            default:
                'bg-transparent hover:bg-milk-100 active:bg-milk-100 dark:hover:bg-rice-800 dark:active:bg-rice-800',
            selected: '!bg-milk-100 dark:!bg-rice-800',
            disabled: '!bg-transparent dark:!bg-transparent'
        },
        danger: {
            default:
                'bg-red-200 hover:bg-red-300 active:bg-red-300 shadow-md dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-600',
            selected: '!bg-red-300 dark:!bg-red-600',
            disabled: '!bg-red-100 !shadow-none dark:!bg-red-800'
        }
    };

    createEffect(() => {
        if (!elementData) return;

        if (elementData instanceof HTMLButtonElement) {
            // elementData.disabled !== state() && (elementData.disabled = disabled());
        }

        if (elementData instanceof HTMLAnchorElement) {
            // elementData.ariaDisabled !== disabled().toString() &&
            // (elementData.ariaDisabled = disabled().toString());
        }
    });

    const getClass = () => {
        return [
            'flex items-center gap-2 rounded-lg outline-offset-4 transition-all ',
            state() === 'disabled'
                ? 'cursor-not-allowed text-milk-800 dark:text-rice-200 ' + styles[style].disabled
                : 'cursor-pointer text-milk-950 outline-transparent focus:outline dark:text-rice-50 focus:outline-2 focus:outline-theme-600 dark:focus:outline-themedark-400 active:scale-95',
            state() === 'selected' ? styles[style].selected : styles[style].default,
            isIcon ? 'p-2' : 'px-4 py-2',
            props.class
        ].join(' ');
    };

    if (element === 'a') {
        return (
            <A
                ref={e => {
                    elementData = e;
                }}
                role={role}
                href={href ?? ''}
                class={getClass()}
                aria-label={ariaLabel && flattenFmt(ariaLabel)}
                aria-disabled={state() === 'disabled' ? 'true' : 'false'}
                onClick={e => {
                    if (state() === 'disabled') e.preventDefault();
                    onClick && onClick(() => e.preventDefault());
                }}
                {...propData}
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
            role={role}
            class={getClass()}
            aria-label={ariaLabel && flattenFmt(ariaLabel)}
            onClick={e => {
                if (state() === 'disabled') e.preventDefault();
                onClick && onClick(() => e.preventDefault());
            }}
            disabled={state() === 'disabled'}
            {...propData}
        >
            {children}
        </button>
    );
};
