import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { TranslationItem } from '../locales';

const NotFoundPage: Component = () => {
    return (
        <PageLayout title='pages.404.title'>
            <p>
                <TranslationItem fmtString='pages.404.description' />
            </p>
        </PageLayout>
    );
};

export default NotFoundPage;
