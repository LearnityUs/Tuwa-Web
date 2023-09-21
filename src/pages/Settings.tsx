import { Index, type Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { AvailableLocales, TranslationItem } from '../locales';
import { GroupBox } from '../components/GroupBox';
import { Button } from '../components/Button';
import { SelectMenu } from '../components/SelectMenu';
import { useSettingsStore } from '../utils/settings/store';
import { StorableSyncableSettingsV1 } from '../utils/settings/v1';
import { periodTexts } from '../utils/schedule';
import { InputBox } from '../components/InputBox';
import { TickBox } from '../components/TickBox';

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
                    disabled={() => false}
                    selected={() => settings.locale}
                    onChange={value => {
                        setSettings({
                            locale: value as AvailableLocales
                        });
                    }}
                />
            </div>
            <div class='flex w-full items-center'>
                <p>
                    <TranslationItem fmtString='pages.settings.educator' />
                </p>
                <div class='flex flex-grow' />
                <TickBox
                    value={() => settings.isEducator}
                    disabled={() => false}
                    onChange={value => {
                        setSettings({
                            isEducator: value
                        });
                    }}
                />
            </div>
            <div class='flex w-full items-center'>
                <p class={'transition-all ' + (settings.isEducator ? 'text-gray-300' : '')}>
                    <TranslationItem fmtString='pages.settings.graduationYear' />
                </p>
                <div class='flex flex-grow' />
                <SelectMenu
                    options={() =>
                        [1, 2, 3, 4].map(year => ({
                            key: (year + new Date().getFullYear()).toString(),
                            element: (
                                <span>
                                    <TranslationItem
                                        fmtString='pages.settings.graduationYearOption'
                                        fmtArgs={{ year: year + new Date().getFullYear() }}
                                    />
                                </span>
                            )
                        }))
                    }
                    disabled={() => settings.isEducator}
                    selected={() => {
                        const year = new Date().getFullYear();
                        return settings.graduationYear < year || settings.graduationYear > year + 4
                            ? year.toString()
                            : settings.graduationYear.toString();
                    }}
                    onChange={value => {
                        setSettings({
                            graduationYear: parseInt(value)
                        });
                    }}
                />
            </div>
            <GroupBox>
                <h3 class='text-2xl font-bold'>
                    <TranslationItem fmtString='pages.settings.scheduleCustomization' />
                </h3>
                <div class='flex flex-col gap-2'>
                    <Index each={Object.keys(settings.periods)}>
                        {key => (
                            <div class='flex flex-col gap-2'>
                                <p class='text-sm text-gray-300'>
                                    <TranslationItem
                                        fmtString={
                                            periodTexts[
                                                key() as keyof StorableSyncableSettingsV1['periods']
                                            ]
                                        }
                                    />
                                </p>
                                <div class='flex items-center gap-4'>
                                    <InputBox
                                        inputMode='text'
                                        type='text'
                                        placeholder={{
                                            fmtString:
                                                periodTexts[
                                                    key() as keyof StorableSyncableSettingsV1['periods']
                                                ]
                                        }}
                                        value={() =>
                                            settings.periods[
                                                key() as keyof StorableSyncableSettingsV1['periods']
                                            ].name || ''
                                        }
                                        disabled={() =>
                                            !settings.periods[
                                                key() as keyof StorableSyncableSettingsV1['periods']
                                            ].enabled
                                        }
                                        onChange={e => {
                                            setSettings({
                                                periods: {
                                                    ...settings.periods,
                                                    [key()]: {
                                                        ...settings.periods[
                                                            key() as keyof StorableSyncableSettingsV1['periods']
                                                        ],
                                                        name: e
                                                    }
                                                }
                                            });
                                        }}
                                    />
                                    <TickBox
                                        value={() =>
                                            settings.periods[
                                                key() as keyof StorableSyncableSettingsV1['periods']
                                            ].enabled
                                        }
                                        disabled={() => false}
                                        onChange={value => {
                                            setSettings({
                                                periods: {
                                                    ...settings.periods,
                                                    [key()]: {
                                                        ...settings.periods[
                                                            key() as keyof StorableSyncableSettingsV1['periods']
                                                        ],
                                                        enabled: value
                                                    }
                                                }
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </Index>
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
                    disabled={() => false}
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
