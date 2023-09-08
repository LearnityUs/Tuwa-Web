import { useI18n } from '@solid-primitives/i18n';
import { createSignal, type Component } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { Barcode } from '../components/Barcode';

const Home: Component = () => {
    const [t] = useI18n();
    const [code, setCode] = createSignal('');

    return (
        <PageLayout title='pages.barcode.title'>
            <div class='flex w-full flex-col items-center'>
                <div class='w-full max-w-md rounded-lg bg-white px-4 py-2'>
                    <div class='h-16 overflow-hidden'>
                        <Barcode height={64} value={() => `*${code()}`} />
                    </div>
                </div>
            </div>
            <input
                class='w-full max-w-md rounded-lg bg-gray-700 px-4 py-2'
                type='text'
                inputMode='numeric'
                value={code()}
                placeholder='Enter your id here'
                onInput={e => {
                    const value = e.currentTarget.value;

                    // Remove all non-numeric characters
                    setCode(value.replace(/[^\d]/g, ''));
                }}
            />
        </PageLayout>
    );
};

export default Home;
