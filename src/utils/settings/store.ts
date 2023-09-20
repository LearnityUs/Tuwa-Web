import { createSignal, onCleanup, onMount } from 'solid-js';
import { StorableSyncableSettingsV1, StoreableSettingsV1, storeableSettingsV1 } from './v1';
import { createStore } from 'solid-js/store';

const LOCAL_STORAGE_KEY = 'syncableSettings';

class SettingsStore {
    private static instance: SettingsStore;
    public settings: StoreableSettingsV1;
    private listeners: Array<() => void> = [];

    private loadSettings(): StoreableSettingsV1 {
        const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!storedSettings) {
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(storeableSettingsV1.getDefault())
            );
            return storeableSettingsV1.getDefault() as StoreableSettingsV1;
        }

        try {
            const parsedSettings = JSON.parse(storedSettings);

            const isValid = storeableSettingsV1.validateSync(parsedSettings);
            if (isValid) {
                return storeableSettingsV1.cast(parsedSettings);
            }

            return storeableSettingsV1.getDefault() as StoreableSettingsV1;
        } catch (e) {
            console.error(e);
            return storeableSettingsV1.getDefault() as StoreableSettingsV1;
        }
    }

    private constructor() {
        this.settings = this.loadSettings();

        window.addEventListener('storage', () => {
            this.settings = this.loadSettings();
            this.listeners.forEach(listener => listener());
        });
    }

    static getInstance(): SettingsStore {
        if (!SettingsStore.instance) {
            SettingsStore.instance = new SettingsStore();
            SettingsStore.instance.settings = SettingsStore.instance.loadSettings();
        }

        return SettingsStore.instance;
    }

    public on(listener: () => void): void {
        this.listeners.push(listener);
    }

    public off(listener: () => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public saveSettings(): void {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.settings));
        this.listeners.forEach(listener => listener());
    }
}

export const useSettingsStore = () => {
    const [updateTime, setUpdateTime] = createSignal<number>(Date.now());
    const [settings, setSettings] = createStore<StorableSyncableSettingsV1>(
        (storeableSettingsV1.getDefault() as StoreableSettingsV1).syncable
    );

    const store = SettingsStore.getInstance();

    const update = (newSettings: Partial<StorableSyncableSettingsV1>) => {
        store.settings.syncable = {
            ...store.settings.syncable,
            ...newSettings
        };

        store.saveSettings();
    };

    onMount(() => {
        const listener = () => {
            setSettings(store.settings.syncable);
            setUpdateTime(Date.now());
        };

        listener();

        store.on(listener);

        onCleanup(() => {
            store.off(listener);
        });
    });

    return [settings, update, updateTime] as const;
};
