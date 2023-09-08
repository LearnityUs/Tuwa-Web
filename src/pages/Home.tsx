import { useI18n } from '@solid-primitives/i18n';
import type { Component } from 'solid-js';
import { DefaultLayout } from '../layouts/default';

const Home: Component = () => {
    const [t] = useI18n();

    return (
        <DefaultLayout>
            <h1>{t('pages.home.title')}</h1>
        </DefaultLayout>
    );
};

export default Home;
