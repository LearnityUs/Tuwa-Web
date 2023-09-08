import { useI18n } from '@solid-primitives/i18n';
import { A } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';

const pageOptions = [
    {
        key: 'pages.home.title',
        href: '/home',
        icon: 'M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z'
    },
    {
        key: 'pages.barcode.title',
        href: '/barcode',
        icon: 'M40-200v-560h80v560H40Zm120 0v-560h80v560h-80Zm120 0v-560h40v560h-40Zm120 0v-560h80v560h-80Zm120 0v-560h120v560H520Zm160 0v-560h40v560h-40Zm120 0v-560h120v560H800Z'
    }
];

interface NavOptionProps {
    key: string;
    href: string;
    icon: string;
    active: () => boolean;
    onClick: () => void;
}

const NavOption: Component<NavOptionProps> = ({ key, href, icon, active, onClick }) => {
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
                    'group-hover:bg-theme-700/20 rounded-full px-3 py-1 text-gray-300 transition-colors group-hover:text-white ' +
                    (active() && 'bg-theme-700 group-hover:!bg-theme-700 text-white')
                }
            >
                <svg class='h-6 w-6 transition-all' viewBox='0 -960 960 960'>
                    <path fill='currentColor' d={icon} />
                </svg>
            </div>
            <p class='text-xs'>{t(key)}</p>
        </A>
    );
};

export const SideBar: Component = () => {
    const [page, setPage] = createSignal(window.location.pathname);

    return (
        <div class='hidden h-full flex-col items-center gap-6 bg-gray-900/60 px-5 py-5 backdrop-blur-md transition-all xl:flex'>
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
