import type { Component, JSX } from 'solid-js';
import { SideBar } from '../components/SideBar';

interface DefaultLayoutProps {
    children: JSX.Element;
}

export const DefaultLayout: Component<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
    return (
        <div class='flex h-full w-full flex-row text-white'>
            <SideBar />
            <div class='h-hull flex w-full justify-center'>
                <div class='flex h-full w-full max-w-5xl flex-col'>{props.children}</div>
            </div>
        </div>
    );
};
