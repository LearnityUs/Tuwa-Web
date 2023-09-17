import { createSignal, onCleanup, onMount } from 'solid-js';
import { StoreableSettingsV1, storeableSettingsV1 } from './v1';

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

            if (storeableSettingsV1.isValidSync(parsedSettings)) {
                return storeableSettingsV1.cast(parsedSettings);
            }

            return storeableSettingsV1.getDefault() as StoreableSettingsV1;
        } catch (e) {
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
    }
}

export const useSettingsStore = () => {
    const [settings, setSettings] = createSignal<StoreableSettingsV1>(
        storeableSettingsV1.getDefault() as StoreableSettingsV1
    );

    const store = SettingsStore.getInstance();

    const update = (newSettings: Partial<StoreableSettingsV1>) => {
        store.settings = {
            ...store.settings,
            ...newSettings
        };

        store.saveSettings();
    };

    onMount(() => {
        const listener = () => {
            setSettings(store.settings);
        };

        listener();

        store.on(listener);

        onCleanup(() => {
            store.off(listener);
        });
    });

    return [settings, update] as const;
};
