import { useI18n } from '@solid-primitives/i18n';
import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';

const NotFoundPage: Component = () => {
    const [t] = useI18n();

    return (
        <PageLayout title='pages.404.title'>
            <p>{t('pages.404.message')}</p>
        </PageLayout>
    );
};

export default NotFoundPage;
