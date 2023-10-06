import { createEffect, type Component, type JSX, onMount, createSignal, onCleanup } from 'solid-js';
import { BottomBar, SideBar } from '../components/Navigation';
import { useSettingsStore } from '../utils/settings/store';
import { useTransContext } from '@mbarzda/solid-i18next';

const SettingsApplicator: Component = () => {
    const [settings] = useSettingsStore();
    let previousTheme: 'dark' | 'light' | 'system' = settings.preferedColorScheme;
    const trans = useTransContext()[1];

    const getPreferredColorScheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const updateTheme = (theme: 'dark' | 'light') => {
        const html = document.documentElement;
        html.classList.remove('dark', 'light');
        html.classList.add(theme);

        // Find the 'theme-color' meta tag
        let themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

        // Create the tag if it does not exist
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            document.head.appendChild(themeColor);
        }

        // Get width
        const styles =
            window.innerWidth < 768
                ? theme === 'dark'
                    ? '#3730a3'
                    : '#fda4af'
                : theme === 'dark'
                    ? '#1f1f1f'
                    : '#f6f5f4';

        // Set the theme color
        themeColor.content !== styles && (themeColor.content = styles);
    };

    onMount(() => {
        if (settings.preferedColorScheme !== 'system') {
            updateTheme(settings.preferedColorScheme);
        }

        const colorSchemeListener = (event: MediaQueryListEvent) => {
            const theme = event.matches ? 'dark' : 'light';
            if (settings.preferedColorScheme === 'system') updateTheme(theme);
        };

        const resizeListener = () => {
            const colorScheme = getPreferredColorScheme();
            if (settings.preferedColorScheme === 'system') updateTheme(colorScheme);
            else updateTheme(settings.preferedColorScheme);
        };

        const colorScheme = getPreferredColorScheme();
        if (settings.preferedColorScheme === 'system') updateTheme(colorScheme);

        const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeMedia.addEventListener('change', colorSchemeListener);
        window.addEventListener('resize', resizeListener);

        onCleanup(() => {
            colorSchemeMedia.removeEventListener('change', colorSchemeListener);
            window.removeEventListener('resize', resizeListener);
        });
    });

    createEffect(() => {
        const settingsData = settings;
        const locale = settingsData.locale;

        if (trans.getI18next().language !== locale) {
            document.documentElement.lang = locale;
            trans.changeLanguage(locale);
        }

        if (previousTheme !== settingsData.preferedColorScheme) {
            previousTheme = settingsData.preferedColorScheme;
            if (settingsData.preferedColorScheme === 'system') {
                updateTheme(getPreferredColorScheme());
            } else {
                updateTheme(settingsData.preferedColorScheme);
            }
        }
    });

    return <></>;
};

interface DefaultLayoutProps {
    children: JSX.Element;
}

export const DefaultLayout: Component<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
    const [screenSize, setScreenSize] = createSignal(window.innerWidth);

    onMount(() => {
        const resizeObserver = () => {
            // Detect changes in the screen size
            setScreenSize(window.innerWidth);
        };

        window.addEventListener('resize', resizeObserver);

        onCleanup(() => {
            window.removeEventListener('resize', resizeObserver);
        });
    });

    return (
        <div class='flex h-full w-full flex-row gap-8 overflow-visible md:px-safe-or-5'>
            <SettingsApplicator />
            {screenSize() >= 768 && <SideBar />}
            <div class={'flex w-full justify-center ' + (screenSize() >= 768 && 'pt-20')}>
                <div class='flex min-h-full w-full max-w-6xl flex-1 flex-col'>{props.children}</div>
            </div>
            {screenSize() < 768 && <BottomBar />}
        </div>
    );
};
