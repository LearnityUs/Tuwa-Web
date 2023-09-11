import { createSignal, type Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { Barcode } from '../components/Barcode';
import { useTransContext } from '@mbarzda/solid-i18next';

const BarcodePage: Component = () => {
    const [t] = useTransContext();
    const [code, setCode] = createSignal('');

    return (
        <PageLayout title='pages.barcode.title'>
            <div class='w-full max-w-md rounded-lg bg-white px-4 py-2'>
                <div class='h-16 overflow-hidden'>
                    <Barcode height={64} value={() => `*${code()}*`} />
                </div>
            </div>
            <input
                class='w-full max-w-md rounded-lg bg-gray-700 px-4 py-2'
                type='text'
                inputMode='numeric'
                value={code()}
                placeholder={t('pages.barcode.idPlaceholder')}
                onInput={e => {
                    const value = e.currentTarget.value;

                    if (value.length > 12) {
                        e.currentTarget.value = code();
                        return;
                    }

                    // Remove all non-numeric characters
                    setCode(value.replace(/[^\d]/g, ''));
                    e.currentTarget.value = code();
                }}
            />
        </PageLayout>
    );
};

export default BarcodePage;
