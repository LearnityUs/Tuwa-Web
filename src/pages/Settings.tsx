import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { AvailableLocales, TranslationItem } from '../locales';
import { GroupBox } from '../components/GroupBox';
import { Button } from '../components/Button';
import { SelectMenu } from '../components/SelectMenu';
import { useSettingsStore } from '../utils/settings/store';

const languages = [
    {
        key: 'en-GB',
        text: 'English (UK)'
    },
    {
        key: 'en-US',
        text: 'English (US)'
    },
    {
        key: 'es-ES',
        text: 'Español (España)'
    },
    {
        key: 'fr-FR',
        text: 'Français (France)'
    },
    {
        key: 'ja-JP',
        text: '日本語'
    },
    {
        key: 'zh-CN',
        text: '中文（简体）'
    },
    {
        key: 'zh-TW',
        text: '中文（繁體）'
    }
];

const SettingsPage: Component = () => {
    const [settings, setSettings] = useSettingsStore();

    return (
        <PageLayout title='pages.settings.title'>
            <div class='flex w-full items-center'>
                <p>
                    <TranslationItem fmtString='pages.settings.language' />
                </p>
                <div class='flex flex-grow' />
                <SelectMenu
                    options={() =>
                        languages.map(l => ({
                            key: l.key,
                            element: <span>{l.text}</span>
                        }))
                    }
                    selected={() => settings().syncable.locale}
                    onChange={value => {
                        setSettings({
                            syncable: {
                                ...settings().syncable,
                                locale: value as AvailableLocales
                            }
                        });
                    }}
                />
            </div>
            <GroupBox>
                <div class='flex flex-col gap-2'>
                    <h3 class='text-2xl font-bold'>
                        <TranslationItem fmtString='pages.settings.appRefresh' />
                    </h3>
                    <p class='text-sm text-gray-300'>
                        <TranslationItem fmtString='pages.settings.appRefreshDescription' />
                    </p>
                </div>
                <Button
                    style='secondary'
                    onClick={async () => {
                        if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistration)
                            return;
                        const registrations = await navigator.serviceWorker.getRegistrations();

                        for (const registration of registrations) {
                            registration.unregister();
                        }

                        location.reload();
                    }}
                >
                    <TranslationItem fmtString='pages.settings.appRefreshButton' />
                </Button>
            </GroupBox>
        </PageLayout>
    );
};

export default SettingsPage;
