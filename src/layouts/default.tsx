import type { Component, JSX } from 'solid-js';

interface DefaultLayoutProps {
    children: JSX.Element;
}

export const DefaultLayout: Component<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
    return <div class='w-full h-full flex text-white'>{props.children}</div>;
};
