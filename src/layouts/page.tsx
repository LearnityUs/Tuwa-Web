import { type Component, type JSX, onMount, createSignal, onCleanup } from 'solid-js';
import { useI18n } from '@solid-primitives/i18n';

interface PageLayoutProps {
    children: JSX.Element;
    title: string;
}

export const PageLayout: Component<PageLayoutProps> = ({ children, title }) => {
    const [t] = useI18n();
    const [appear, setAppear] = createSignal(false);

    onMount(() => {
        setTimeout(() => setAppear(true), 100);
        onCleanup(() => setAppear(false));
    });

    return (
        <div
            class={
                'flex h-full w-full translate-y-20 flex-col justify-end gap-4 p-10 pb-32 opacity-0 transition-all lg:justify-start lg:pb-0 ' +
                (appear() && '!translate-y-0 !opacity-100')
            }
        >
            <h1 class='text-5xl font-bold'>{t(title)}</h1>
            {children}
        </div>
    );
};
