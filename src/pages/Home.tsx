import { createSignal, type Component, onMount, onCleanup } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { getDateData, getFormattedDate } from '../utils/time';
import { DayScheduleAny, filterSchedule, getStandardSchedule } from '../utils/schedule';
import { TranslationItem } from '../locales';
import { SchoolStatus } from '../components/SchoolStatus';
import { ScheduleList } from '../components/ScheduleList';
import { useSettingsStore } from '../utils/settings/store';

const HomePage: Component = () => {
    const [settings] = useSettingsStore();
    const [date, setDate] = createSignal(getDateData());
    const [schedule, setSchedule] = createSignal<DayScheduleAny>();

    onMount(() => {
        let timeout: number | undefined;

        /// Returns a number to makesure this is called when returned by doUpdate
        const doRefresh = (): number => {
            const timeUntilNextSecond = 1000 - (Date.now() % 1000);

            timeout = setTimeout(doUpdate, timeUntilNextSecond) as unknown as number;
            return timeout;
        };

        const doUpdate = (): number => {
            timeout = undefined;

            // Update the date
            const dateData = getDateData();

            // Get the schedule
            const scheduleData = getStandardSchedule(dateData);

            // Only update the schedule if it is different
            if (date().dayEpoch !== dateData.dayEpoch || !schedule()) {
                setSchedule(filterSchedule(dateData, scheduleData, settings));
            }

            // Update the date
            setDate(dateData);

            return doRefresh();
        };

        requestAnimationFrame(doUpdate);

        onCleanup(() => {
            if (timeout) clearTimeout(timeout);

            // Reset favicon
            let faviocn = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
            if (!faviocn) {
                faviocn = document.createElement('link');
                faviocn.rel = 'icon';
                document.head.appendChild(faviocn);
            }
            faviocn.href = '/icon/icon.svg';
            faviocn.type = 'image/svg+xml';
        });
    });

    return (
        <PageLayout showTitle={false} title='pages.home.title'>
            <div>
                <h2 class='text-6xl font-bold'>
                    <span>{date().hour.toString().padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{date().minute.toString().padStart(2, '0')}</span>
                    <span class='text-4xl text-gray-300'>:</span>
                    <span class='text-4xl text-gray-300'>
                        {date().second.toString().padStart(2, '0')}
                    </span>
                </h2>
                <p class='text-gray-300'>
                    <TranslationItem {...getFormattedDate(date() ?? getDateData())} />
                </p>
            </div>
            <SchoolStatus date={() => date()} schedule={() => schedule()} shouldSetFavicon={true} />
            <ScheduleList defaultDate={() => date()} />
        </PageLayout>
    );
};

export default HomePage;
