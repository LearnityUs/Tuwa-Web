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
                'flex min-h-full w-full flex-1 translate-y-20 flex-col justify-end gap-8 overflow-visible pb-[calc(max(0.5rem,env(safe-area-inset-bottom))+5.75rem)] pl-[max(2.5rem,env(safe-area-inset-bottom))] pr-[max(2.5rem,env(safe-area-inset-right))] pt-10 opacity-0 transition-all md:justify-start md:pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pl-[calc(max(env(safe-area-inset-left),1.25rem)+6.75rem)] ' +
                (appear() && '!translate-y-0 !opacity-100')
            }
        >
            {showTitle && (
                <h1 class='text-5xl font-bold'>
                    <Trans key={title} />
                </h1>
            )}
            {children}
        </div>
    );
};
