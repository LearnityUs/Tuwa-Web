import { I18nContext, createI18nContext } from '@solid-primitives/i18n';
import type { FlowComponent } from 'solid-js';
import enGb from './en-GB.json';
import enUs from './en-US.json';
import esEs from './es-ES.json';
import frFr from './fr-FR.json';
import jaJP from './ja-JP.json';
import zhCn from './zh-CN.json';
import zhTw from './zh-TW.json';

const ctx = createI18nContext(
    {
        enGb,
        enUs,
        esEs,
        frFr,
        jaJP,
        zhCn,
        zhTw
    },
    'enUs'
);

const availableLocales = ['enGb', 'enUs', 'esEs', 'frFr', 'jaJp', 'zhCn', 'zhTw'] as const;

const I18nProvider: FlowComponent<{
    dict?: Record<string, Record<string, any>>;
    locale?: string;
}> = props => {
    return <I18nContext.Provider value={ctx}>{props.children}</I18nContext.Provider>;
};

export { enUs, I18nProvider, availableLocales };
