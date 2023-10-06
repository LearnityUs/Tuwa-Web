import { Trans } from '@mbarzda/solid-i18next';
import { createSignal, type Component, onMount, onCleanup } from 'solid-js';
import { Icon } from '../utils/icon';
import { icons } from 'lucide-solid';
import { TranslationItem } from '../locales';
import { Button } from './Button';

interface PageOption {
    key: string;
    href: string;
    icon: keyof typeof icons;
    showMobile: boolean;
}

const pageOptions: PageOption[] = [
    {
        key: 'pages.home.title',
        href: '/home',
        icon: 'Home',
        showMobile: true
    },
    {
        key: 'pages.identification.title',
        href: '/identification',
        icon: 'Fingerprint',
        showMobile: true
    },
    {
        key: 'pages.settings.title',
        href: '/settings',
        icon: 'Settings',
        showMobile: true
    },
    {
        key: 'pages.about.title',
        href: '/about',
        icon: 'Info',
        showMobile: true
    }
];

const stripUrl = (url: string) => {
    // Remove trailing slash
    if (url.endsWith('/')) url = url.slice(0, -1);
    return url;
};

interface NavOptionProps {
    key: string;
    href: string;
    icon: keyof typeof icons;
    active: () => boolean;
    onClick: () => void;
}

const NavOption: Component<NavOptionProps> = ({ key, href, icon, active, onClick }) => {
    return (
        <Button
            element='a'
            style='bordered'
            state={() => (active() ? 'selected' : 'default')}
            isIcon={true}
            href={href}
            onClick={() => {
                onClick();
            }}
        >
            <Icon class='h-4 w-4' name={() => icon} />
            <p class='text-xs'>
                <Trans key={key} />
            </p>
        </Button>
    );
};

const NavOptionSidebar: Component<{
    key: string;
    href: string;
    icon: keyof typeof icons;
    active: () => boolean;
}> = ({ key, href, icon, active }) => {
    return (
        <Button
            style='bordered'
            state={() => (active() ? 'selected' : 'default')}
            element='a'
            href={href}
            class='w-full'
        >
            <Icon class='h-5 w-5' name={() => icon} />
            <p>
                <Trans key={key} />
            </p>
        </Button>
    );
};

export const SideBar: Component = () => {
    const [page, setPage] = createSignal(stripUrl(window.location.pathname));

    // Listen for route changes
    onMount(() => {
        const listener = () => setPage(stripUrl(window.location.pathname));
        window.addEventListener('popstate', listener);
        onCleanup(() => window.removeEventListener('popstate', listener));
    });

    return (
        <nav class='pointer-events-auto sticky top-0 flex h-min flex-col gap-4 transition-all py-safe-or-5'>
            <Button style='bordered' element='a' href='/'>
                <h1 class='text-2xl font-bold'>
                    <TranslationItem fmtString='common.appName' />
                </h1>
            </Button>
            <div class='flex w-64 flex-col items-center gap-2'>
                {pageOptions.map(option => (
                    <NavOptionSidebar
                        key={option.key}
                        href={option.href}
                        icon={option.icon}
                        active={() => page() === option.href}
                    />
                ))}
            </div>
        </nav>
    );
};

export const BottomBar: Component = () => {
    const [page, setPage] = createSignal(stripUrl(window.location.pathname));

    // Listen for route changes
    onMount(() => {
        const listener = () => setPage(stripUrl(window.location.pathname));
        window.addEventListener('popstate', listener);
        onCleanup(() => window.removeEventListener('popstate', listener));
    });

    return (
        <div class='fixed bottom-0 z-10 flex w-full flex-row justify-evenly gap-6 bg-milk-200 pt-2 shadow-lg transition-colors pb-safe-or-2 px-safe-or-4 dark:bg-rice-800'>
            {pageOptions
                .filter(e => e.showMobile)
                .map(option => (
                    <NavOption
                        key={option.key}
                        href={option.href}
                        icon={option.icon}
                        active={() => page() === option.href}
                        onClick={() => setPage(option.href)}
                    />
                ))}
        </div>
    );
};
