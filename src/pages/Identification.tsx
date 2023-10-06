import type { Component } from 'solid-js';
import { DefaultPageTitle, PageLayout } from '../layouts/Page';
import { Barcode } from '../components/Barcode';
import { useSettingsStore } from '../utils/settings/store';
import { InputBox } from '../components/InputBox';

const IdentificationPage: Component = () => {
    const [settings, setSettings] = useSettingsStore();

    return (
        <PageLayout
            title={() => <DefaultPageTitle title={{ fmtString: 'pages.identification.title' }} />}
        >
            <div class='w-full max-w-md rounded-lg bg-white px-4 py-2'>
                <div class='h-16 overflow-hidden'>
                    <Barcode height={1} value={() => `*${settings.identificationNumber}*`} />
                </div>
            </div>
            <InputBox
                type='number'
                inputMode='numeric'
                value={() => settings.identificationNumber}
                disabled={() => false}
                placeholder={{ fmtString: 'pages.identification.idPlaceholder' }}
                onChange={value => {
                    if (value.length > 12) {
                        setSettings({ identificationNumber: settings.identificationNumber });
                        return;
                    }

                    // Remove all non-numeric characters
                    const code = value.replace(/[^\d]/g, '');
                    setSettings({ identificationNumber: code });
                }}
            />
        </PageLayout>
    );
};

export default IdentificationPage;
