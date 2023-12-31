import { type Component, type JSX, onMount, createSignal, onCleanup, createEffect } from 'solid-js';
import { FmtProps, TranslationItem, flattenFmt } from '../locales';

interface PageLayoutProps {
    children: JSX.Element;
    title: () => JSX.Element | null;
    titleKey?: FmtProps;
}

interface DefaultPageTitleProps {
    title: FmtProps;
}

export const DefaultPageTitle: Component<DefaultPageTitleProps> = ({ title }) => {
    return (
        <h1 class='text-3xl font-bold'>
            <TranslationItem {...title} />
        </h1>
    );
};
export const PageLayout: Component<PageLayoutProps> = ({ children, title, titleKey }) => {
    const [appear, setAppear] = createSignal(false);

    onMount(() => {
        setTimeout(() => setAppear(true), 100);
        onCleanup(() => setAppear(false));
        if (titleKey)
            document.title = flattenFmt({
                fmtString: 'common.pageFmt',
                fmtArgs: {
                    page: titleKey
                }
            });
    });

    createEffect(() => {
        if (titleKey)
            document.title = flattenFmt({
                fmtString: 'common.pageFmt',
                fmtArgs: {
                    page: titleKey
                }
            });
    });

    return (
        <div
            class={
                'flex min-h-full w-full transition-opacity ' +
                (appear() ? 'opacity-100' : 'md:opacity-0')
            }
        >
            <div class='flex min-h-full w-full flex-col overflow-hidden md:rounded-t-3xl'>
                {title() !== null && (
                    <div class='w-full bg-theme-300 pb-6 transition-all pt-safe-or-6 px-safe-or-4 dark:bg-themedark-800 md:px-8 md:py-8'>
                        <div
                            class={
                                'transition-transform ease-out-back ' +
                                (appear()
                                    ? 'transition-x-0 opacity-100'
                                    : 'translate-x-16 opacity-0')
                            }
                        >
                            {title()}
                        </div>
                    </div>
                )}
                <div class='flex flex-1 flex-col bg-theme-300 transition-colors dark:bg-themedark-800'>
                    <div class='flex flex-1 flex-col rounded-t-2xl bg-milk-100 pt-8 pb-safe-or-32 px-safe-or-4 dark:bg-rice-900 md:rounded-t-3xl md:px-8 md:py-8'>
                        <div
                            class={
                                'flex flex-1 flex-col gap-8 transition-transform ease-out-back ' +
                                (appear()
                                    ? 'transition-x-0 opacity-100'
                                    : 'translate-x-16 opacity-0')
                            }
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
