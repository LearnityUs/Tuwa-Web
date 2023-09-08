import { useI18n } from '@solid-primitives/i18n';
import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';

const HomePage: Component = () => {
    const [t] = useI18n();

    return <PageLayout title='pages.home.title'>{t('pages.home.title')}</PageLayout>;
};

export default HomePage;
