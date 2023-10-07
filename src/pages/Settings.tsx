import { Index, type Component, JSX } from 'solid-js';
import { DefaultPageTitle, PageLayout } from '../layouts/Page';
import { AvailableLocales, FmtProps, TranslationItem } from '../locales';
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
        key: 'ko-KR',
        text: '한국어'
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

const SettingItem: Component<{
    text: FmtProps;
    disabled: () => boolean;
    children: JSX.Element;
}> = ({ text, disabled, children }) => {
    return (
        <div class='flex h-10 items-center'>
            <p
                class={
                    'max-w-[8rem] transition-colors md:max-w-[16rem] ' +
                    (disabled() && 'text-milk-800 dark:text-rice-200')
                }
            >
                <TranslationItem {...text} />
            </p>
            <div class='min-w-[0.5rem] flex-grow' />
            <div>{children}</div>
        </div>
    );
};

const SettingsPage: Component = () => {
    const [settings, setSettings] = useSettingsStore();

    return (
        <PageLayout
            title={() => <DefaultPageTitle title={{ fmtString: 'pages.settings.title' }} />}
        >
            <div class='flex flex-col gap-4'>
                <SettingItem
                    text={{
                        fmtString: 'pages.settings.language'
                    }}
                    disabled={() => false}
                >
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
                </SettingItem>
                <SettingItem text={{ fmtString: 'pages.settings.educator' }} disabled={() => false}>
                    <TickBox
                        value={() => settings.isEducator}
                        disabled={() => false}
                        onChange={value => {
                            setSettings({
                                isEducator: value
                            });
                        }}
                        label={{ fmtString: 'pages.settings.educator' }}
                    />
                </SettingItem>
                <SettingItem
                    text={{ fmtString: 'pages.settings.graduationYear' }}
                    disabled={() => settings.isEducator}
                >
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
                            return settings.graduationYear < year ||
                                settings.graduationYear > year + 4
                                ? year.toString()
                                : settings.graduationYear.toString();
                        }}
                        onChange={value => {
                            setSettings({
                                graduationYear: parseInt(value)
                            });
                        }}
                    />
                </SettingItem>
                <SettingItem
                    text={{ fmtString: 'pages.settings.theme' }}
                    disabled={() => settings.isEducator}
                >
                    <SelectMenu
                        options={() =>
                            [
                                ['system', 'pages.settings.themeOptions.system'],
                                ['light', 'pages.settings.themeOptions.light'],
                                ['dark', 'pages.settings.themeOptions.dark']
                            ].map(([key, text]) => ({
                                key,
                                element: (
                                    <span>
                                        <TranslationItem fmtString={text} />
                                    </span>
                                )
                            }))
                        }
                        disabled={() => false}
                        selected={() => settings.preferedColorScheme}
                        onChange={value => {
                            setSettings({
                                preferedColorScheme: value as 'system' | 'light' | 'dark'
                            });
                        }}
                    />
                </SettingItem>
                <SettingItem
                    text={{ fmtString: 'pages.settings.timeFormat' }}
                    disabled={() => false}
                >
                    <SelectMenu
                        options={() => [
                            {
                                key: '12h',
                                element: (
                                    <span>
                                        <TranslationItem fmtString='pages.settings.time.12hr' />
                                    </span>
                                )
                            },
                            {
                                key: '24h',
                                element: (
                                    <span>
                                        <TranslationItem fmtString='pages.settings.time.24hr' />
                                    </span>
                                )
                            }
                        ]}
                        disabled={() => false}
                        selected={() => settings.timeFormat}
                        onChange={value => {
                            setSettings({
                                timeFormat: value === '12h' ? '12h' : '24h'
                            });
                        }}
                    />
                </SettingItem>
            </div>
            <GroupBox>
                <h3 class='text-2xl font-bold'>
                    <TranslationItem fmtString='pages.settings.scheduleCustomization' />
                </h3>
                <div class='flex flex-col gap-2'>
                    <Index each={Object.keys(settings.periods)}>
                        {key => (
                            <div class='flex flex-col gap-2'>
                                <p class='text-sm text-milk-800 dark:text-rice-200'>
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
                                        label={{
                                            fmtString: 'pages.settings.scheduleCustomizationEnabled'
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
                    <p class='text-sm text-milk-800 dark:text-rice-200'>
                        <TranslationItem fmtString='pages.settings.appRefreshDescription' />
                    </p>
                </div>
                <Button
                    class='w-fit'
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
