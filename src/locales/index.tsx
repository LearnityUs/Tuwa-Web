import { I18nContext, createI18nContext } from '@solid-primitives/i18n';
import type { FlowComponent } from 'solid-js';
import enGb from './en-gb.json';
import enUs from './en-us.json';
import esEs from './es-es.json';
import frFr from './fr-fr.json';
import jaJP from './ja-jp.json';
import zhCn from './zh-cn.json';
import zhTw from './zh-tw.json';

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
    'en-us'
);

const availableLocales = ['en-gb', 'en-us', 'es-es', 'fr-fr', 'ja-jp', 'zh-cn', 'zh-tw'] as const;

const I18nProvider: FlowComponent<{
    dict?: Record<string, Record<string, any>>;
    locale?: string;
}> = props => {
    return <I18nContext.Provider value={ctx}>{props.children}</I18nContext.Provider>;
};

export { enUs, I18nProvider, availableLocales };
