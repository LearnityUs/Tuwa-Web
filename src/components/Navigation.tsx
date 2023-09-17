import { Trans } from '@mbarzda/solid-i18next';
import { A } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';
import { Icon } from '../utils/icon';
import { icons } from 'lucide-solid';

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
        key: 'pages.identification.titleShort',
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
    isMobile?: boolean;
}

const NavOption: Component<NavOptionProps> = ({
    key,
    href,
    icon,
    active,
    onClick,
    isMobile = false
}) => {
    return (
        <A
            class='group flex cursor-pointer flex-col items-center gap-1'
            href={href}
            onClick={() => {
                onClick();
            }}
        >
            <div
                class={
                    'rounded-full px-3 py-1 text-gray-300 transition-colors group-hover:bg-theme-700/20 group-hover:text-white ' +
                    (active() && 'bg-theme-700 text-white group-hover:!bg-theme-700')
                }
            >
                <Icon class={isMobile ? 'h-4 w-4' : 'h-6 w-6'} name={icon} />
            </div>
            <p class='text-xs'>
                <Trans key={key} />
            </p>
        </A>
    );
};

export const SideBar: Component = () => {
    const [page, setPage] = createSignal(stripUrl(window.location.pathname));

    return (
        <div class='pointer-events-none fixed top-0 z-10 hidden h-full bg-gray-900/60 pb-5 pl-[max(env(safe-area-inset-left),1.25rem)] pr-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] backdrop-blur-md transition-all md:pointer-events-auto md:flex'>
            <div class='flex w-12 flex-col items-center gap-6'>
                {pageOptions.map(option => (
                    <NavOption
                        key={option.key}
                        href={option.href}
                        icon={option.icon}
                        active={() => page() === option.href}
                        onClick={() => setPage(option.href)}
                    />
                ))}
            </div>
        </div>
    );
};

export const BottomBar: Component = () => {
    const [page, setPage] = createSignal(stripUrl(window.location.pathname));

    return (
        <div class='fixed bottom-0 z-10 flex w-full flex-row justify-evenly gap-6 bg-gray-900/60 px-4 py-2 pb-[max(0.5rem,calc(env(safe-area-inset-bottom)))] backdrop-blur-md transition-all md:pointer-events-none md:hidden'>
            {pageOptions
                .filter(e => e.showMobile)
                .map(option => (
                    <NavOption
                        key={option.key}
                        href={option.href}
                        icon={option.icon}
                        active={() => page() === option.href}
                        onClick={() => setPage(option.href)}
                        isMobile={true}
                    />
                ))}
        </div>
    );
};
