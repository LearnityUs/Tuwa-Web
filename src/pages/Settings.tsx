import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { TranslationItem } from '../locales';
import { GroupBox } from '../components/GroupBox';
import { Button } from '../components/Button';

const SettingsPage: Component = () => {
    return (
        <PageLayout title='pages.settings.title'>
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
