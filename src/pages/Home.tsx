import { createSignal, type Component, onMount, onCleanup, createEffect } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { schedules } from '../utils/defaultSchedule';
import {
    getDateData,
    getFormatedTimeLeft,
    getFormattedClockTime,
    getFormattedDate
} from '../utils/time';
import { DayScheduleAny, PeriodAny } from '../utils/schedule';
import { FmtProps, TranslationItem, flattenFmt } from '../locales';

interface PeriodDataPassing {
    type: 'passing';
    length: number;
    start: number;
    end: number;
    nextPeriod: PeriodAny;
}

interface PeriodDataPeriod {
    type: 'period';
    period: PeriodAny;
    length: number;
    start: number;
    end: number;
    nextPeriod?: PeriodAny;
}

interface PeriodDataBeforeSchool {
    type: 'before-school';
    nextPeriod: PeriodAny;
}

interface PeriodDataAfterSchool {
    type: 'after-school';
}

const periodTexts = {
    0: 'common.periods.0',
    1: 'common.periods.1',
    2: 'common.periods.2',
    3: 'common.periods.3',
    4: 'common.periods.4',
    5: 'common.periods.5',
    6: 'common.periods.6',
    7: 'common.periods.7',
    8: 'common.periods.8',
    lunch: 'common.periods.lunch',
    brunch: 'common.periods.brunch',
    'study-hall': 'common.periods.studyHall',
    prime: 'common.periods.prime',
    self: 'common.periods.self',
    custom: 'common.periods.custom'
};

const getPeriodKey = (period: PeriodAny): FmtProps => {
    if (period.type === 'active') return { fmtString: periodTexts[period.active] };
    if (period.type === 'break') return { fmtString: periodTexts[period.break] };
    if (period.type === 'custom')
        return { fmtString: periodTexts.custom, fmtArgs: { name: period.name } };
    return { fmtString: periodTexts[period.period] };
};

// TODO: This is so botched and needs to be fixed
const getEmojiTextForPeriod = (
    schedule?: DayScheduleAny,
    period?: PeriodDataPassing | PeriodDataPeriod | PeriodDataBeforeSchool | PeriodDataAfterSchool
): {
    emoji: FmtProps;
    text: FmtProps;
} => {
    if (!schedule) return { emoji: { fmtString: '' }, text: { fmtString: '' } };

    // No school
    if (period) {
        // Before school
        if (period.type === 'before-school')
            return {
                emoji: { fmtString: 'pages.home.emojis.beforeSchool' },
                text: { fmtString: 'pages.home.beforeSchool' }
            };
        // After school
        if (period.type === 'after-school')
            return {
                emoji: { fmtString: 'pages.home.emojis.afterSchool' },
                text: { fmtString: 'pages.home.afterSchool' }
            };
        // Passing
        if (period.type === 'passing') {
            return {
                emoji: { fmtString: 'pages.home.emojis.periodPassing' },
                text: { fmtString: 'common.periods.passing' }
            };
        }
        // Period
        const periodData = period.period;
        if (periodData.type === 'active') {
            return {
                emoji: { fmtString: 'pages.home.emojis.periodActive' },
                text: {
                    fmtString: {
                        'study-hall': 'common.periods.studyHall',
                        prime: 'common.periods.prime',
                        self: 'common.periods.self'
                    }[periodData.active]
                }
            };
        }
        // Break
        if (periodData.type === 'break') {
            return {
                emoji: { fmtString: 'pages.home.emojis.periodBreak' },
                text: {
                    fmtString: {
                        brunch: 'common.periods.brunch',
                        lunch: 'common.periods.lunch'
                    }[periodData.break]
                }
            };
        }
        // Custom
        if (periodData.type === 'custom') {
            return {
                emoji: { fmtString: 'pages.home.emojis.periodCustom' },
                text: { fmtString: 'common.periods.custom', fmtArgs: { name: periodData.name } }
            };
        }
        // Class
        const periodNumber = periodData.period;
        return {
            emoji: { fmtString: 'pages.home.emojis.periodClass' },
            text: {
                fmtString: 'common.periods.' + periodNumber.toString()
            }
        };
    }

    // No school
    if (schedule.type === 'holiday') {
        return {
            emoji: { fmtString: 'pages.home.emojis.noSchoolHoliday' },
            text: { fmtString: '' } // TODO: Add holiday name
        };
    }
    // Weekend
    if (schedule.type === 'standard-weekend') {
        return {
            emoji: { fmtString: 'pages.home.emojis.noSchoolWeekend' },
            text: { fmtString: 'pages.home.weekend' }
        };
    }
    // Custom
    return {
        emoji: { fmtString: 'pages.home.emojis.noSchoolCustom' },
        text: {
            fmtString: 'pages.home.alternativeDay',
            fmtArgs: { name: schedule.type === 'custom-school' ? schedule.name : '' }
        }
    };
};

const HomePage: Component = () => {
    const [date, setDate] = createSignal(getDateData());
    const [schedule, setSchedule] = createSignal<DayScheduleAny>();
    const [period, setPeriod] = createSignal<
        PeriodDataPassing | PeriodDataPeriod | PeriodDataBeforeSchool | PeriodDataAfterSchool
    >();

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

            // Update the date
            const dateData = getDateData();

            // Get the schedule
            const scheduleData = schedules[dateData.dayName];

            // Only update the schedule if it is different
            if (date().dayEpoch !== dateData.dayEpoch || !schedule()) {
                setPeriod(undefined);
                setSchedule(scheduleData);
            }

            setDate(dateData);

            // Check holiday
            if (!scheduleData.hasSchool || !scheduleData.periods || !scheduleData.periods.length) {
                if (period()) setPeriod(undefined);
                return doRefresh();
            }

            // Check before school
            if (dateData.secondMidnight < scheduleData.periods[0].start) {
                if (!period() || period()?.type !== 'before-school') {
                    // Don't refresh if we don't have to (chromebooks are slow)
                    setPeriod({
                        type: 'before-school',
                        nextPeriod: scheduleData.periods[0]
                    });
                }
                return doRefresh();
            }

            // Check after school
            if (
                dateData.secondMidnight > scheduleData.periods[scheduleData.periods.length - 1].end
            ) {
                if (!period() || period()?.type !== 'after-school') {
                    // Don't refresh if we don't have to (chromebooks are slow)
                    setPeriod({
                        type: 'after-school'
                    });
                }

                return doRefresh();
            }

            // Then we are in school

            // Find the current period (it may be passing)
            let currentPeriodIndex = -1;

            for (let i = scheduleData.periods.length - 1; i >= 0; i--) {
                if (dateData.secondMidnight >= scheduleData.periods[i].start) {
                    currentPeriodIndex = i;
                    break;
                }
            }

            const latestPeriod: PeriodAny = scheduleData.periods[currentPeriodIndex];
            const nextPeriod: PeriodAny | undefined = scheduleData.periods[currentPeriodIndex + 1];

            // Check if we are in passing
            const isPassing = dateData.secondMidnight >= latestPeriod.end && nextPeriod;

            if (isPassing) {
                if (
                    !period() ||
                    period()?.type !== 'passing' ||
                    (period()?.type === 'passing' &&
                        (period() as PeriodDataPassing).start !== latestPeriod.end)
                ) {
                    // Don't refresh if we don't have to (chromebooks are slow)
                    setPeriod({
                        type: 'passing',
                        length: nextPeriod.start - latestPeriod.end,
                        start: latestPeriod.end,
                        end: nextPeriod.start,
                        nextPeriod
                    });
                }
                return doRefresh();
            }

            // We are in a period
            if (
                !period() ||
                period()?.type !== 'period' ||
                (period()?.type === 'period' &&
                    (period() as PeriodDataPeriod).start !== latestPeriod.start)
            ) {
                // Don't refresh if we don't have to (chromebooks are slow)
                setPeriod({
                    type: 'period',
                    period: latestPeriod,
                    length: latestPeriod.end - latestPeriod.start,
                    start: latestPeriod.start,
                    end: latestPeriod.end,
                    nextPeriod
                });
            }
            // Find the next period

            return doRefresh();
        };

        requestAnimationFrame(doUpdate);

        onCleanup(() => {
            if (timeout) clearTimeout(timeout);
            if (animFrame) cancelAnimationFrame(animFrame);
        });
    });

    createEffect(() => {
        let fmt: FmtProps = { fmtString: 'common.unknownError' };
        const periodData = period();
        const scheduleData = schedule();

        if (periodData) {
            if (periodData.type === 'after-school') {
                fmt = { fmtString: 'pages.home.titles.afterSchool' };
            } else if (periodData.type === 'before-school') {
                fmt = {
                    fmtString: 'pages.home.titles.beforeSchool',
                    fmtArgs: {
                        time: getFormattedClockTime(periodData.nextPeriod.start)
                    }
                };
            } else if (periodData.type === 'passing') {
                fmt = {
                    fmtString: 'pages.home.titles.periodPassing',
                    fmtArgs: {
                        period: getPeriodKey(periodData.nextPeriod)
                    }
                };
            } else if (periodData.type === 'period') {
                fmt = {
                    fmtString: 'pages.home.titles.period',
                    fmtArgs: {
                        period: getPeriodKey(periodData.period)
                    }
                };
            }
        } else if (scheduleData) {
            if (scheduleData.type === 'custom-school') {
                fmt = {
                    fmtString: 'pages.home.titles.noSchoolCustom',
                    fmtArgs: {
                        name: scheduleData.name
                    }
                };
            } else if (scheduleData.type === 'holiday') {
                fmt = {
                    fmtString: 'pages.home.titles.noSchoolHoliday',
                    fmtArgs: {
                        // TODO: Add holiday name
                        name: scheduleData.holiday
                    }
                };
            } else if (scheduleData.type === 'standard-weekend') {
                fmt = { fmtString: 'pages.home.titles.noSchoolWeekend' };
            }
        }

        document.title = flattenFmt({
            fmtString: 'common.pageFmt',
            fmtArgs: {
                page: fmt
            }
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
            <div class='flex w-full flex-col items-center gap-6 rounded-3xl bg-gray-900/60 p-8 backdrop-blur-lg md:flex-row '>
                <div class='flex h-32 w-32 items-center justify-center rounded-full bg-theme-500/20 text-6xl'>
                    <TranslationItem {...getEmojiTextForPeriod(schedule(), period()).emoji} />
                </div>
                <div class='flex w-full flex-1 flex-col items-center text-center md:h-full md:items-start md:text-left'>
                    <h3 class='text-3xl font-bold'>
                        <TranslationItem {...getEmojiTextForPeriod(schedule(), period()).text} />
                    </h3>
                    {period()?.type === 'before-school' && (
                        <p class='text-gray-300'>
                            <TranslationItem
                                fmtString='pages.home.beforeSchoolNextPeriod'
                                fmtArgs={{
                                    period: getPeriodKey(
                                        (period() as PeriodDataBeforeSchool).nextPeriod
                                    ),
                                    time: getFormatedTimeLeft(
                                        (period() as PeriodDataBeforeSchool).nextPeriod.start -
                                            date().secondMidnight
                                    )
                                }}
                            />
                        </p>
                    )}
                    {(period()?.type === 'passing' ||
                        (period()?.type === 'period' &&
                            (period() as PeriodDataPeriod).nextPeriod)) && (
                        <p class='text-gray-300'>
                            <TranslationItem
                                fmtString='pages.home.nextPeriod'
                                fmtArgs={{
                                    period: getPeriodKey(
                                        (period() as PeriodDataPassing | PeriodDataPeriod)
                                            .nextPeriod as PeriodAny
                                    )
                                }}
                            />
                        </p>
                    )}
                    {(period()?.type === 'period' || period()?.type === 'passing') && (
                        <>
                            <div class='flex min-h-[1rem] w-full flex-1 flex-col'></div>
                            <div class='flex w-full flex-1 flex-col items-center md:h-full md:items-start'>
                                <div class='flex w-full flex-col gap-2'>
                                    <div
                                        class='h-2 w-full rounded-full bg-gray-800/60 transition-all'
                                        role='progressbar'
                                        aria-valuemin={0}
                                        aria-valuenow={
                                            100 -
                                            (period()?.type === 'passing' ||
                                            period()?.type === 'period'
                                                ? ((
                                                      period() as
                                                          | PeriodDataPassing
                                                          | PeriodDataPeriod
                                                  ).end -
                                                      date().secondMidnight) /
                                                  (period() as PeriodDataPassing | PeriodDataPeriod)
                                                      .length
                                                : 0) *
                                                100
                                        }
                                        aria-valuemax={100}
                                        aria-label={flattenFmt({
                                            fmtString: 'pages.home.periodIn',
                                            fmtArgs: {
                                                time: getFormatedTimeLeft(
                                                    (period()?.type === 'passing' ||
                                                    period()?.type === 'period'
                                                        ? (
                                                              period() as
                                                                  | PeriodDataPassing
                                                                  | PeriodDataPeriod
                                                          ).end
                                                        : 0) - date().secondMidnight
                                                )
                                            }
                                        })}
                                    >
                                        <div
                                            class='h-full min-w-[0.5rem] rounded-full bg-theme-500/60'
                                            style={{
                                                width: `${
                                                    100 -
                                                    (period()?.type === 'passing' ||
                                                    period()?.type === 'period'
                                                        ? ((
                                                              period() as
                                                                  | PeriodDataPassing
                                                                  | PeriodDataPeriod
                                                          ).end -
                                                              date().secondMidnight) /
                                                          (
                                                              period() as
                                                                  | PeriodDataPassing
                                                                  | PeriodDataPeriod
                                                          ).length
                                                        : 0) *
                                                        100
                                                }%`
                                            }}
                                        />
                                    </div>
                                    <p class='text-sm text-gray-300'>
                                        <TranslationItem
                                            fmtString='pages.home.periodIn'
                                            fmtArgs={{
                                                time: getFormatedTimeLeft(
                                                    (period()?.type === 'passing' ||
                                                    period()?.type === 'period'
                                                        ? (
                                                              period() as
                                                                  | PeriodDataPassing
                                                                  | PeriodDataPeriod
                                                          ).end
                                                        : 0) - date().secondMidnight
                                                )
                                            }}
                                        />
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {schedule() && schedule()?.periods && (
                <>
                    <h3 class='text-3xl font-bold'>
                        <TranslationItem fmtString='pages.home.today' />
                    </h3>
                    <div class='flex flex-col gap-4'>
                        {(schedule()?.periods as PeriodAny[]).map(period => (
                            <div
                                class={
                                    'w-full rounded-xl bg-gray-900/60 p-6 backdrop-blur ' +
                                    (date().secondMidnight >= period.end &&
                                        'bg-gray-900/50 text-gray-400')
                                }
                            >
                                <h4 class='text-2xl font-bold'>
                                    <TranslationItem {...getPeriodKey(period)} />
                                </h4>
                                <p
                                    class={
                                        'text-gray-300 ' +
                                        (date().secondMidnight >= period.end && 'text-gray-400')
                                    }
                                >
                                    <TranslationItem
                                        fmtString='pages.home.periodTime'
                                        fmtArgs={{
                                            start: getFormattedClockTime(period.start),
                                            end: getFormattedClockTime(period.end)
                                        }}
                                    />
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
