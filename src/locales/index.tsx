import type { Component, FlowComponent } from 'solid-js';
import enGb from './en-GB/translation.json';
import enUs from './en-US/translation.json';
import esEs from './es-ES/translation.json';
import frFr from './fr-FR/translation.json';
import jaJp from './ja-JP/translation.json';
import zhCn from './zh-CN/translation.json';
import zhTw from './zh-TW/translation.json';
import { TransProvider, useTransContext } from '@mbarzda/solid-i18next';

interface TranslationUnit {
    [key: string]: string | TranslationUnit;
}

const localeTranslationUnits: Record<
    (typeof availableLocales)[number],
    {
        translation: TranslationUnit;
    }
> = {
    'en-GB': {
        translation: enGb
    },
    'en-US': {
        translation: enUs
    },
    'es-ES': {
        translation: esEs
    },
    'fr-FR': {
        translation: frFr
    },
    'ja-JP': {
        translation: jaJp
    },
    'zh-CN': {
        translation: zhCn
    },
    'zh-TW': {
        translation: zhTw
    }
};

export const availableLocales = [
    'en-GB',
    'en-US',
    'es-ES',
    'fr-FR',
    'ja-JP',
    'zh-CN',
    'zh-TW'
] as const;

export const I18nProvider: FlowComponent = props => {
    return (
        <TransProvider
            lng='en-US'
            options={{
                resources: localeTranslationUnits,
                interpolation: {
                    escapeValue: false
                }
            }}
        >
            {props.children}
        </TransProvider>
    );
};

export const flattenFmt = (fmt: FmtProps): string => {
    const [t] = useTransContext();
    const args = new Map();

    for (const [key, value] of Object.entries(fmt.fmtArgs ?? {})) {
        if (typeof value === 'object') {
            args.set(key, flattenFmt(value));
        } else {
            args.set(key, value);
        }
    }

    return t(fmt.fmtString, Object.fromEntries(args));
};

export const TranslationItem: Component<FmtProps> = props => {
    return <>{flattenFmt(props)}</>;
};

export type Locale = (typeof availableLocales)[number];

export interface FmtProps {
    fmtString: string;
    fmtArgs?: Record<string, string | number | boolean | FmtProps>;
}
