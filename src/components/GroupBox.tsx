import type { Component, JSX } from 'solid-js';

interface GroupBoxProps {
    children: JSX.Element;
    padding?: 'extraSmall' | 'small' | 'medium' | 'large';
}

export const GroupBox: Component<GroupBoxProps> = ({ children, padding = 'large' }) => {
    const paddingStyles = {
        extraSmall: 'py-3',
        small: 'py-4',
        medium: 'py-6',
        large: 'py-8'
    };

    return (
        <div
            class={
                'flex flex-col gap-6 rounded-xl bg-gray-900 px-8 ring-2 ring-gray-800/60 ' +
                paddingStyles[padding]
            }
        >
            {children}
        </div>
    );
};
