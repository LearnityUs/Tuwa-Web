import type { Component, JSX } from 'solid-js';
import { useI18n } from '@solid-primitives/i18n';

interface PageLayoutProps {
    children: JSX.Element;
    title: string;
}

export const PageLayout: Component<PageLayoutProps> = ({ children, title }) => {
    const [t] = useI18n();

    return (
        <div class='flex h-full w-full flex-col gap-4 p-10'>
            <h1 class='text-5xl font-bold'>{t(title)}</h1>
            {children}
        </div>
    );
};
