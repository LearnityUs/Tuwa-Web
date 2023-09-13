import type { Component, JSX } from 'solid-js';

interface GroupBoxProps {
    children: JSX.Element;
}

export const GroupBox: Component<GroupBoxProps> = ({ children }) => {
    return (
        <div class='flex flex-col gap-4 rounded-lg bg-gray-900 p-8 shadow-lg ring-1 ring-gray-800'>
            {children}
        </div>
    );
};
