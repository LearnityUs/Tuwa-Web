import { useI18n } from '@solid-primitives/i18n';
import { createSignal, type Component, onMount, onCleanup } from 'solid-js';
import { PageLayout } from '../layouts/page';
import {
    Holidays,
    ScheduleItem,
    getHolidayKey,
    getPeriodKey,
    schedules
} from '../utils/defaultSchedule';

interface DateData {
    dayName: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    monthKey: string;
    schedule?: (typeof schedules)[keyof typeof schedules];
    minutesSinceMidnight: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
}

const getDate = (): DateData => {
    const date = new Date();

    // Get the day of the week
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        date.getDay()
    ] as DateData['dayName'];

    // Get month name
    const month = date.getMonth();
    const monthKey =
        'common.month.' +
        [
            'january',
            'february',
            'march',
            'april',
            'may',
            'june',
            'july',
            'august',
            'september',
            'october',
            'november',
            'december'
        ][month];

    // Get the month
    return {
        dayName,
        monthKey,
        schedule: schedules[dayName as keyof typeof schedules] || null,
        minutesSinceMidnight: date.getHours() * 60 + date.getMinutes(),
        date: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    };
};

const getTimeFromMinutes = (minutes: number, padding = false) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return {
        hours: padding ? hour.toString().padStart(2, '0') : hour.toString(),
        minutes: padding ? minute.toString().padStart(2, '0') : minute.toString()
    };
};

const getClockTimeFromMinutes = (minutes: number) => {
    const time = getTimeFromMinutes(minutes, true);

    return `${time.hours}:${time.minutes}`;
};

interface NoSchoolWeekend {
    data: 'no-school';
    noSchoolReason: 'weekend';
}

interface NoSchoolHoliday {
    data: 'no-school';
    noSchoolReason: 'holiday';
    holiday: Holidays;
}

interface NoSchoolCustom {
    data: 'no-school';
    noSchoolReason: 'custom';
    customName: string;
}

interface PeriodSchoolStateSchool {
    data: 'before-school' | 'in-school' | 'after-school';
}

type PeriodNoSchool = NoSchoolWeekend | NoSchoolHoliday | NoSchoolCustom;

type PeriodSchoolState = PeriodSchoolStateSchool | PeriodNoSchool;

const isNoSchool = (state: PeriodSchoolState | undefined): state is PeriodNoSchool =>
    state ? state.data === 'no-school' : false;

interface PeriodSchool {
    type: 'period' | 'passing' | 'none';
    period?: ScheduleItem;
    length: number;
    start: number;
    end: number;
    nextPeriod?: ScheduleItem;
}

const HomePage: Component = () => {
    const [t] = useI18n();
    const [date, setDate] = createSignal(getDate());
    const [schedule, setSchedule] = createSignal<(typeof schedules)[keyof typeof schedules]>();
    const [schoolState, setSchoolState] = createSignal<PeriodSchoolState>();
    const [period, setPeriod] = createSignal<PeriodSchool>();

    onMount(() => {
        let timeout: number | undefined;
        let animFrame: number | undefined;

        /// Returns a number to makesure this is called when returned by doUpdate
        const doRefresh = (): number => {
            const timeUntilNextSecond = 1000 - (Date.now() % 1000);

            timeout = setTimeout(() => {
                animFrame = requestAnimationFrame(doUpdate);
            }, timeUntilNextSecond) as unknown as number;
            return timeout;
        };

        const doUpdate = (): number => {
            animFrame = undefined;
            const dateData = getDate();
            setDate(dateData);

            const scheduleData = dateData.schedule;
            const minutesSinceMidnight = date().minutesSinceMidnight;

            if (scheduleData?.day !== schedule()?.day) {
                setSchedule(scheduleData);
            }

            // Check holiday
            if (!scheduleData || scheduleData.periods.length === 0) {
                setSchoolState({
                    data: 'no-school',
                    noSchoolReason: 'weekend'
                });
                setPeriod(undefined);
                return doRefresh();
            }

            // Check before school
            if (minutesSinceMidnight < scheduleData.periods[0].start) {
                setSchoolState({
                    data: 'before-school'
                });
                setPeriod({
                    type: 'none',
                    length: scheduleData.periods[0].start,
                    start: 0,
                    end: scheduleData.periods[0].start,
                    nextPeriod: scheduleData.periods[0]
                });

                return doRefresh();
            }

            // Check after school
            if (minutesSinceMidnight > scheduleData.periods[scheduleData.periods.length - 1].end) {
                setSchoolState({
                    data: 'after-school'
                });
                setPeriod({
                    type: 'none',
                    length: 24 * 60 - scheduleData.periods[scheduleData.periods.length - 1].end,
                    start: scheduleData.periods[scheduleData.periods.length - 1].end,
                    end: 24 * 60
                });

                return doRefresh();
            }

            // Then we are in school
            setSchoolState({
                data: 'in-school'
            });

            // Find the current period (it may be passing)
            let currentPeriodIndex = -1;

            for (let i = scheduleData.periods.length - 1; i >= 0; i--) {
                if (minutesSinceMidnight >= scheduleData.periods[i].start) {
                    currentPeriodIndex = i;
                    break;
                }
            }

            const currentPeriod: ScheduleItem | undefined =
                scheduleData.periods[currentPeriodIndex];
            const nextPeriod: ScheduleItem | undefined =
                scheduleData.periods[currentPeriodIndex + 1];

            if (!currentPeriod) {
                throw new Error(
                    'No current period (this should not happen because of the checks above)'
                );
            }

            // Check if we are in passing
            const isPassing = minutesSinceMidnight >= currentPeriod!.end && nextPeriod;

            if (isPassing) {
                setPeriod({
                    type: 'passing',
                    length: nextPeriod.start - currentPeriod.end,
                    start: currentPeriod.end,
                    end: nextPeriod.start,
                    nextPeriod
                });
                return doRefresh();
            }

            // We are in a period
            setPeriod({
                type: 'period',
                period: currentPeriod,
                length: currentPeriod.end - currentPeriod.start,
                start: currentPeriod.start,
                end: currentPeriod.end,
                nextPeriod
            });

            // Find the next period

            return doRefresh();
        };

        requestAnimationFrame(doUpdate);

        onCleanup(() => {
            if (timeout) clearTimeout(timeout);
            if (animFrame) cancelAnimationFrame(animFrame);
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
                    {t('common.dateFormat', {
                        day: t('common.day.' + date().dayName),
                        month: t(date().monthKey),
                        date: date().date.toString()
                    })}
                </p>
            </div>
            <div class='flex w-full flex-col items-center gap-6 rounded-3xl bg-gray-900/60 p-8 backdrop-blur-lg md:flex-row '>
                {isNoSchool(schoolState()) && (
                    <>
                        <div class='flex h-32 w-32 items-center justify-center rounded-full bg-theme-500/20 text-6xl'>
                            {(schoolState() as PeriodNoSchool).noSchoolReason === 'holiday' &&
                                t('pages.home.emojis.noSchoolHoliday')}
                            {(schoolState() as PeriodNoSchool).noSchoolReason === 'weekend' &&
                                t('pages.home.emojis.noSchoolWeekend')}
                            {(schoolState() as PeriodNoSchool).noSchoolReason === 'custom' &&
                                t('pages.home.emojis.noSchoolCustom')}
                        </div>
                        <h3 class='text-center text-3xl font-bold'>
                            {(schoolState() as PeriodNoSchool).noSchoolReason === 'holiday' &&
                                t(getHolidayKey((schoolState() as NoSchoolHoliday).holiday))}
                            {(schoolState() as PeriodNoSchool).noSchoolReason === 'weekend' &&
                                t('pages.home.weekend')}
                            {(schoolState() as PeriodNoSchool).noSchoolReason === 'custom' &&
                                (schoolState() as NoSchoolCustom).customName}
                        </h3>
                    </>
                )}
                {schoolState()?.data === 'after-school' && (
                    <>
                        <div class='flex h-32 w-32 items-center justify-center rounded-full bg-theme-500/20 text-6xl'>
                            {t('pages.home.emojis.afterSchool')}
                        </div>
                        <h3 class='text-center text-3xl font-bold'>
                            {t('pages.home.afterSchool')}
                        </h3>
                    </>
                )}
                {schoolState()?.data === 'before-school' && (
                    <>
                        <div class='flex h-32 w-32 items-center justify-center rounded-full bg-theme-500/20 text-6xl'>
                            {t('pages.home.emojis.beforeSchool')}
                        </div>
                        <div class='flex flex-col justify-center text-center md:h-full'>
                            <h3 class='text-3xl font-bold'>{t('pages.home.beforeSchool')}</h3>
                            <p class='text-gray-300'>
                                {t('pages.home.beforeSchoolNextPeriod', {
                                    period: period()?.nextPeriod
                                        ? t(getPeriodKey(period()?.nextPeriod!))
                                        : t('common.somethingWentWrong'),
                                    time: period()?.nextPeriod
                                        ? t(
                                              'common.timeFormat',
                                              getTimeFromMinutes(
                                                  (period()?.nextPeriod?.start ?? 0) -
                                                      date().minutesSinceMidnight
                                              )
                                          )
                                        : t('common.somethingWentWrong')
                                })}
                            </p>
                        </div>
                    </>
                )}
                {schoolState()?.data === 'in-school' && (
                    <>
                        <div class='flex h-32 w-32 items-center justify-center rounded-full bg-theme-500/20 text-center text-6xl'>
                            {period()?.type === 'none' && t('pages.home.emojis.beforeSchool')}
                            {period()?.type === 'passing' && t('pages.home.emojis.passingPeriod')}
                            {period()?.type === 'period' &&
                                period()?.period?.type === 'active' &&
                                t('pages.home.emojis.activePeriod')}
                            {period()?.type === 'period' &&
                                period()?.period?.type === 'break' &&
                                t('pages.home.emojis.breakPeriod')}
                            {period()?.type === 'period' &&
                                period()?.period?.type === 'period' &&
                                t('pages.home.emojis.classPeriod')}
                        </div>
                        <div class='flex w-full flex-col items-center md:h-full md:items-start'>
                            <h3 class='text-3xl font-bold'>
                                {schoolState()?.data === 'before-school' &&
                                    t('pages.home.beforeSchool')}
                                {schoolState()?.data === 'in-school' &&
                                    (period()?.type === 'passing'
                                        ? t('pages.home.passingPeriod')
                                        : t(
                                              period()?.period
                                                  ? getPeriodKey(period()?.period!)
                                                  : 'common.somethingWentWrong'
                                          ))}
                            </h3>
                            {(period()?.type === 'passing' ||
                                period()?.period?.type === 'break') && (
                                <p class='text-gray-300'>
                                    {t('pages.home.nextPeriod', {
                                        period: t(getPeriodKey(period()?.nextPeriod!))
                                    })}
                                </p>
                            )}

                            <div class='flex min-h-[1rem] flex-1' />
                            <div class='flex w-full flex-col gap-2'>
                                <div
                                    class='h-2 w-full rounded-full bg-gray-800/60 transition-all'
                                    role='progressbar'
                                    aria-valuemin={0}
                                    aria-valuenow={
                                        100 -
                                        ((period()?.end! - date().minutesSinceMidnight) /
                                            period()?.length!) *
                                            100
                                    }
                                    aria-valuemax={100}
                                >
                                    <div
                                        class='h-full min-w-[0.5rem] rounded-full bg-theme-500/60'
                                        style={{
                                            width: `${
                                                100 -
                                                ((period()?.end! - date().minutesSinceMidnight) /
                                                    period()?.length!) *
                                                    100
                                            }%`
                                        }}
                                    />
                                </div>
                                <p class='text-sm text-gray-300'>
                                    {t('pages.home.periodIn', {
                                        time: t(
                                            'common.timeFormat',
                                            getTimeFromMinutes(
                                                period()?.end! - date().minutesSinceMidnight
                                            )
                                        )
                                    })}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {schedule() && (
                <>
                    <h3 class='text-3xl font-bold'>{t('pages.home.today')}</h3>
                    <div class='flex flex-col gap-4'>
                        {schedule()?.periods.map(period => (
                            <div
                                class={
                                    'w-full rounded-xl bg-gray-900/60 p-6 backdrop-blur ' +
                                    (date().minutesSinceMidnight >= period.end &&
                                        'bg-gray-900/50 text-gray-500')
                                }
                            >
                                <h4 class='text-2xl font-bold'>{t(getPeriodKey(period))}</h4>
                                <p
                                    class={
                                        'text-gray-300 ' +
                                        (date().minutesSinceMidnight >= period.end &&
                                            'text-gray-500')
                                    }
                                >
                                    {t('pages.home.periodTime', {
                                        start: getClockTimeFromMinutes(period.start),
                                        end: getClockTimeFromMinutes(period.end)
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </PageLayout>
    );
};

export default HomePage;
