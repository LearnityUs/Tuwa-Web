import type { Component, JSX } from 'solid-js';

interface GroupBoxProps {
    children: JSX.Element;
}

export const GroupBox: Component<GroupBoxProps> = ({ children }) => {
    return (
        <div class='flex flex-col gap-6 rounded-xl bg-gray-900 p-8 ring-2 ring-gray-800/60'>
            {children}
        </div>
    );
};
