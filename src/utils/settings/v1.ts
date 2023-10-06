import { type InferType, boolean, number, object, string, array } from 'yup';
import { availableLocales } from '../../locales';
import { iconKeys } from '../icon';

const periodSettingsV1 = object({
    icon: string().required().oneOf(iconKeys).default('GraduationCap'),
    rgb: object({
        r: number().required().min(0).max(255).default(0),
        g: number().required().min(0).max(255).default(0),
        b: number().required().min(0).max(255).default(0)
    }).required(),
    name: string().default(''),
    classroom: string().default(''),
    enabled: boolean().required().default(true)
});

export const storeableSettingsV1 = object({
    version: number().required().oneOf([1]).default(1),
    syncable: object({
        firstTime: boolean().required().default(true),
        preferedColorScheme: string()
            .required()
            .oneOf(['system', 'light', 'dark'])
            .default('system'),
        locale: string().required().oneOf(availableLocales).default('en-US'),
        timeFormat: string().required().oneOf(['12h', '24h']).default('12h'),
        graduationYear: number()
            .required()
            .default(new Date().getFullYear() + 4),
        isEducator: boolean().required().default(false),
        identificationNumber: string().default(''),
        periods: object({
            0: periodSettingsV1.required(),
            1: periodSettingsV1.required(),
            2: periodSettingsV1.required(),
            3: periodSettingsV1.required(),
            4: periodSettingsV1.required(),
            5: periodSettingsV1.required(),
            6: periodSettingsV1.required(),
            7: periodSettingsV1.required(),
            8: periodSettingsV1.required(),
            prime: periodSettingsV1.required(),
            self: periodSettingsV1.required(),
            studyHall: periodSettingsV1.required()
        }).required(),
        clubs: array(object({})).ensure().required().default([])
    }).required()
}).required();

export type StoreableSettingsV1 = InferType<typeof storeableSettingsV1>;
export type StorableSyncableSettingsV1 = StoreableSettingsV1['syncable'];
