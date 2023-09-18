import { createEffect, type Component, type JSX } from 'solid-js';
import { BottomBar, SideBar } from '../components/Navigation';
import { useSettingsStore } from '../utils/settings/store';
import { useTransContext } from '@mbarzda/solid-i18next';

const LanguageChanger: Component = () => {
    const [settings] = useSettingsStore();
    const trans = useTransContext()[1];

    createEffect(() => {
        const settingsData = settings;
        const locale = settingsData.locale;

        document.documentElement.lang = locale;
        trans.changeLanguage(locale);
    });

    return <></>;
};

interface DefaultLayoutProps {
    children: JSX.Element;
}

export const DefaultLayout: Component<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
    return (
        <div class='flex min-h-full w-full flex-row text-white'>
            <LanguageChanger />
            <SideBar />
            <div class='flex min-h-full w-full justify-center'>
                <div class='flex min-h-full w-full max-w-4xl flex-1 flex-col'>{props.children}</div>
            </div>
            <BottomBar />
        </div>
    );
};
