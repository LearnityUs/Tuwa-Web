import { type InferType, boolean, number, object, string } from 'yup';
import { availableLocales } from '../../locales';
import { iconKeys } from '../icon';

const periodSettingsV1 = object({
    // Only one emoji is allowed (the string must be one emoji and nothing else)
    icon: string().required().oneOf(iconKeys).default('graduationCap'),
    name: string(),
    classroom: string(),
    enabled: boolean().required().default(true)
});

export const storeableSettingsV1 = object({
    version: number().required().oneOf([1]).default(1),
    syncable: object({
        firstTime: boolean().required().default(true),
        locale: string().required().oneOf(availableLocales).default('en-US'),
        timeFormat: string().required().oneOf(['12h', '24h']).default('12h'),
        graduationYear: number()
            .required()
            .default(new Date().getFullYear() + 4),
        identificationNumber: string().required().default(''),
        periods: object({
            0: periodSettingsV1.required().default({ enabled: false }),
            1: periodSettingsV1.required().default({ enabled: true }),
            2: periodSettingsV1.required().default({ enabled: true }),
            3: periodSettingsV1.required().default({ enabled: true }),
            4: periodSettingsV1.required().default({ enabled: true }),
            5: periodSettingsV1.required().default({ enabled: true }),
            6: periodSettingsV1.required().default({ enabled: true }),
            7: periodSettingsV1.required().default({ enabled: true }),
            8: periodSettingsV1.required().default({ enabled: false }),
            prime: periodSettingsV1.required().default({ enabled: true }),
            self: periodSettingsV1.required().default({ enabled: true }),
            studyHall: periodSettingsV1.required().default({ enabled: true })
        }).required()
    }).required()
}).required();

export type StoreableSettingsV1 = InferType<typeof storeableSettingsV1>;
export type StorableSyncableSettingsV1 = StoreableSettingsV1['syncable'];
