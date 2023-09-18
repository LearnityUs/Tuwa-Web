import type { Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { Barcode } from '../components/Barcode';
import { useTransContext } from '@mbarzda/solid-i18next';
import { useSettingsStore } from '../utils/settings/store';

const IdentificationPage: Component = () => {
    const [t] = useTransContext();
    const [settings, setSettings] = useSettingsStore();

    return (
        <PageLayout title='pages.identification.title'>
            <div class='w-full max-w-md rounded-lg bg-white px-4 py-2'>
                <div class='h-16 overflow-hidden'>
                    <Barcode height={64} value={() => `*${settings().identificationNumber}*`} />
                </div>
            </div>
            <input
                class='w-full max-w-md rounded-lg bg-gray-700 px-4 py-2 text-white ring-1 ring-gray-600/60'
                type='text'
                inputMode='numeric'
                value={settings().identificationNumber}
                placeholder={t('pages.identification.idPlaceholder')}
                onInput={e => {
                    const value = e.currentTarget.value;

                    if (value.length > 12) {
                        e.currentTarget.value = settings().identificationNumber;
                        return;
                    }

                    // Remove all non-numeric characters
                    const code = value.replace(/[^\d]/g, '');
                    setSettings({ identificationNumber: code });
                    e.currentTarget.value = code;
                }}
            />
        </PageLayout>
    );
};

export default IdentificationPage;
