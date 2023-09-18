import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { AvailableLocales, TranslationItem, flattenFmt } from '../locales';
import { GroupBox } from '../components/GroupBox';
import { Button } from '../components/Button';
import { SelectMenu } from '../components/SelectMenu';
import { useSettingsStore } from '../utils/settings/store';
import { StorableSyncableSettingsV1 } from '../utils/settings/v1';
import { periodTexts } from '../utils/schedule';

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
                    selected={() => settings().locale}
                    onChange={value => {
                        setSettings({
                            locale: value as AvailableLocales
                        });
                    }}
                />
            </div>
            <GroupBox>
                <h3 class='text-2xl font-bold'>
                    <TranslationItem fmtString='pages.settings.scheduleCustomization' />
                </h3>
                <div class='flex flex-col gap-2'>
                    {Object.keys(settings().periods).map(key => (
                        <div class='flex flex-col gap-2'>
                            <p class='text-sm text-gray-300'>
                                <TranslationItem
                                    fmtString={
                                        periodTexts[
                                            key as keyof StorableSyncableSettingsV1['periods']
                                        ]
                                    }
                                />
                            </p>
                            <div class='flex items-center gap-4'>
                                <input
                                    type='period'
                                    class='w-full rounded-lg bg-gray-700 px-4 py-2 text-white ring-1 ring-gray-600/60'
                                    placeholder={flattenFmt({
                                        fmtString:
                                            periodTexts[
                                                key as keyof StorableSyncableSettingsV1['periods']
                                            ]
                                    })}
                                    value={
                                        settings().periods[
                                            key as keyof StorableSyncableSettingsV1['periods']
                                        ].name || ''
                                    }
                                    onChange={e => {
                                        setSettings({
                                            periods: {
                                                ...settings().periods,
                                                [key]: {
                                                    ...settings().periods[
                                                        key as keyof StorableSyncableSettingsV1['periods']
                                                    ],
                                                    name: e.currentTarget.value
                                                }
                                            }
                                        });
                                    }}
                                />
                                <input
                                    type='checkbox'
                                    class='h-4 w-4'
                                    checked={
                                        settings().periods[
                                            key as keyof StorableSyncableSettingsV1['periods']
                                        ].enabled
                                    }
                                    onChange={e => {
                                        setSettings({
                                            periods: {
                                                ...settings().periods,
                                                [key]: e.currentTarget.checked
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </GroupBox>
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
