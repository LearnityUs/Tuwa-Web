import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { TranslationItem } from '../locales';
import { GroupBox } from '../components/GroupBox';
import { Button } from '../components/Button';
import { Icon } from '../utils/icon';

const AboutPage: Component = () => {
    return (
        <PageLayout title='pages.about.title'>
            <GroupBox>
                <div class='flex flex-col gap-2'>
                    <h2 class='text-2xl font-bold italic'>
                        <TranslationItem fmtString='pages.about.quote' />
                    </h2>
                    <p class='text-md text-gray-300'>
                        <TranslationItem fmtString='pages.about.quoteAuthor' />
                    </p>
                </div>
            </GroupBox>
            <p>
                <TranslationItem fmtString='pages.about.description' />
            </p>
            <div class='flex gap-4'>
                <Button
                    style='secondary'
                    element='a'
                    href='https://discord.gg/sA7MGJnU'
                    topRightSharp={true}
                >
                    <TranslationItem fmtString='pages.about.discordLink' />
                    <Icon class='h-4 w-4' name='ArrowUpRight' />
                </Button>
                <Button
                    style='secondary'
                    element='a'
                    href='https://github.com/JoshuaBrest/TUWA'
                    topRightSharp={true}
                >
                    <TranslationItem fmtString='pages.about.githubLink' />
                    <Icon class='h-4 w-4' name='ArrowUpRight' />
                </Button>
            </div>
        </PageLayout>
    );
};

export default AboutPage;
