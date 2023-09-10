import { useI18n } from '@solid-primitives/i18n';
import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';

const SettingsPage: Component = () => {
    const [t] = useI18n();

    return (
        <PageLayout title='pages.settings.title'>
            <div class='flex flex-col gap-4 rounded-3xl bg-tertiary-900/60 p-8 backdrop-blur'>
                <div class='flex flex-col gap-2'>
                    <h3 class='text-2xl font-bold'>{t('pages.settings.appRefresh')}</h3>
                    <p class='text-sm text-gray-300'>{t('pages.settings.appRefreshDescription')}</p>
                </div>
                <button
                    onClick={async () => {
                        if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistration)
                            return;
                        const registrations = await navigator.serviceWorker.getRegistrations();

                        for (const registration of registrations) {
                            registration.unregister();
                        }
                    }}
                    class='w-fit cursor-pointer rounded-xl bg-tertiary-500/60 px-6 py-2 font-bold text-white transition-colors active:bg-tertiary-500/80'
                >
                    {t('pages.settings.appRefreshButton')}
                </button>
            </div>
        </PageLayout>
    );
};

export default SettingsPage;
