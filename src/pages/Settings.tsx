import { useI18n } from '@solid-primitives/i18n';
import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';

const SettingsPage: Component = () => {
    const [t] = useI18n();

    return (
        <PageLayout title='pages.settings.title'>
            <p>{t('pages.settings.title')}</p>
        </PageLayout>
    );
};

export default SettingsPage;
