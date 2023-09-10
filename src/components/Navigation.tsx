import { useI18n } from '@solid-primitives/i18n';
import { A } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';

const pageOptions = [
    {
        key: 'pages.home.title',
        href: '/home',
        icon: 'M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z',
        showMobile: true
    },
    {
        key: 'pages.barcode.title',
        href: '/barcode',
        icon: 'M40-200v-560h80v560H40Zm120 0v-560h80v560h-80Zm120 0v-560h40v560h-40Zm120 0v-560h80v560h-80Zm120 0v-560h120v560H520Zm160 0v-560h40v560h-40Zm120 0v-560h120v560H800Z',
        showMobile: true
    },
    {
        key: 'pages.settings.title',
        href: '/settings',
        icon: 'M555-80H405q-15 0-26-10t-13-25l-12-93q-13-5-24.5-12T307-235l-87 36q-14 5-28 1t-22-17L96-344q-8-13-5-28t15-24l75-57q-1-7-1-13.5v-27q0-6.5 1-13.5l-75-57q-12-9-15-24t5-28l74-129q7-14 21.5-17.5T220-761l87 36q11-8 23-15t24-12l12-93q2-15 13-25t26-10h150q15 0 26 10t13 25l12 93q13 5 24.5 12t22.5 15l87-36q14-5 28-1t22 17l74 129q8 13 5 28t-15 24l-75 57q1 7 1 13.5v27q0 6.5-2 13.5l75 57q12 9 15 24t-5 28l-74 128q-8 13-22.5 17.5T738-199l-85-36q-11 8-23 15t-24 12l-12 93q-2 15-13 25t-26 10Zm-73-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm0-80q-25 0-42.5-17.5T422-480q0-25 17.5-42.5T482-540q25 0 42.5 17.5T542-480q0 25-17.5 42.5T482-420Zm-2-60Zm-40 320h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Z',
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
    icon: string;
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
    const [t] = useI18n();

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
                <svg class={isMobile ? 'h-4 w-4' : 'h-6 w-6'} viewBox='0 -960 960 960'>
                    <path class='transition-color' fill='currentColor' d={icon} />
                </svg>
            </div>
            <p class='text-xs'>{t(key)}</p>
        </A>
    );
};

export const SideBar: Component = () => {
    const [page, setPage] = createSignal(stripUrl(window.location.pathname));

    return (
        <div class='pointer-events-none fixed top-0 z-10 hidden h-full flex-col items-center gap-6 bg-gray-900/60 pb-5 pl-[max(env(safe-area-inset-left),1.25rem)] pr-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] backdrop-blur-md transition-all md:pointer-events-auto md:flex'>
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
