import type { Component, JSX } from 'solid-js';

interface ButtonProps {
    children: JSX.Element;
    style: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
}

export const Button: Component<ButtonProps> = ({ children, style, onClick }) => {
    const styles = {
        primary: 'ring-theme-600/60 bg-theme-700 hover:bg-theme-600 active:bg-theme-700',
        secondary: 'ring-gray-700/60 bg-gray-800 hover:bg-gray-700 active:bg-gray-600',
        danger: 'ring-danger-600/60 bg-danger-700 hover:bg-danger-600 active:bg-danger-500'
    };

    return (
        <button
            class={
                'flex w-fit cursor-pointer flex-col rounded px-6 py-2 shadow-md ring-1 transition-colors ' +
                styles[style]
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
};
