import type { Component, JSX } from 'solid-js';
import { BottomBar, SideBar } from '../components/Navigation';

interface DefaultLayoutProps {
    children: JSX.Element;
}

export const DefaultLayout: Component<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
    return (
        <div class='flex min-h-full w-full flex-row text-white'>
            <SideBar />
            <div class='flex min-h-full w-full justify-center'>
                <div class='flex min-h-full w-full max-w-4xl flex-1 flex-col'>{props.children}</div>
            </div>
            <BottomBar />
        </div>
    );
};
