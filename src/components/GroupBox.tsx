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
                'bg-milk-50 dark:bg-rice-950 flex flex-col gap-6 rounded-2xl px-8 shadow-lg ' +
                paddingStyles[padding]
            }
        >
            {children}
        </div>
    );
};
