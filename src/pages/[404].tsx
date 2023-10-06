import type { Component } from 'solid-js';
import { DefaultPageTitle, PageLayout } from '../layouts/Page';
import { TranslationItem } from '../locales';

const NotFoundPage: Component = () => {
    return (
        <PageLayout
            title={() => <DefaultPageTitle title={{ fmtString: 'pages.404.title' }} />}
            titleKey={{ fmtString: 'pages.404.title' }}
        >
            <p>
                <TranslationItem fmtString='pages.404.message' />
            </p>
        </PageLayout>
    );
};

export default NotFoundPage;
