import { A } from '@solidjs/router';
import type { Component, JSX } from 'solid-js';

interface ButtonProps {
    children: JSX.Element;
    element?: 'button' | 'a';
    href?: string;
    topRightSharp?: boolean;
    style: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
}

export const Button: Component<ButtonProps> = ({
    children,
    element = 'button',
    href,
    topRightSharp,
    style,
    onClick
}) => {
    const styles = {
        primary: 'ring-theme-600/60 bg-theme-700 hover:bg-theme-600 active:bg-theme-700',
        secondary: 'ring-gray-700/60 bg-gray-800 hover:bg-gray-700 active:bg-gray-600',
        danger: 'ring-danger-600/60 bg-danger-700 hover:bg-danger-600 active:bg-danger-500'
    };

    const className =
        'flex w-fit cursor-pointer items-center gap-2 rounded-lg px-4 py-2 shadow-md ring-1 transition-colors ' +
        styles[style] +
        ' ' +
        (topRightSharp ? 'rounded-tr' : '');

    if (element === 'a') {
        return (
            <A href={href ?? ''} class={className}>
                {children}
            </A>
        );
    }

    return (
        <button class={className} onClick={onClick}>
            {children}
        </button>
    );
};
