import { type Component, type JSX, onMount, createSignal, onCleanup, createEffect } from 'solid-js';
import { Trans } from '@mbarzda/solid-i18next';
import { flattenFmt } from '../locales';

interface PageLayoutProps {
    children: JSX.Element;
    title: string;
    showTitle?: boolean;
}

export const PageLayout: Component<PageLayoutProps> = ({ children, title, showTitle = true }) => {
    const [appear, setAppear] = createSignal(false);

    onMount(() => {
        setTimeout(() => setAppear(true), 100);
        onCleanup(() => setAppear(false));
    });

    createEffect(() => {
        if (showTitle)
            document.title = flattenFmt({
                fmtString: 'common.pageFmt',
                fmtArgs: {
                    page: {
                        fmtString: title
                    }
                }
            });
    });

    return (
        <div
            class={
                'flex min-h-full w-full translate-y-20 opacity-0 transition-all p-safe-or-6 md:p-safe-or-10 ' +
                (appear() && '!translate-y-0 !opacity-100')
            }
        >
            <div class='flex min-h-full w-full flex-col gap-8 overflow-visible pb-[3.75rem] pt-6 md:pb-0 md:pl-[5.5rem] md:pt-0'>
                {showTitle && (
                    <h1 class='text-4xl font-bold md:text-5xl'>
                        <Trans key={title} />
                    </h1>
                )}
                {children}
            </div>
        </div>
    );
};
