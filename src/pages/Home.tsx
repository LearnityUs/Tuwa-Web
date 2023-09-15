import { createSignal, type Component, onMount, onCleanup, createEffect } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { schedules } from '../utils/defaultSchedule';
import { getDateData, getFormattedClockTime, getFormattedDate } from '../utils/time';
import { DayScheduleAny, PeriodAny, getHolidayFmtProps } from '../utils/schedule';
import { FmtProps, TranslationItem, flattenFmt } from '../locales';
import {
    academicCap,
    arrowRight,
    bolt,
    faceSmile,
    heart,
    questionMarkCircle,
    sun
} from 'solid-heroicons/solid';
import { SchoolStatus } from '../components/SchoolStatus';

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

const getPeriodTitle = (
    scheduleData?: DayScheduleAny,
    periodData?:
        | PeriodDataPassing
        | PeriodDataPeriod
        | PeriodDataBeforeSchool
        | PeriodDataAfterSchool
): FmtProps => {
    if (!scheduleData) return { fmtString: 'common.unknownError' };

    if (!scheduleData.hasSchool || !scheduleData.periods) {
        return {
            fmtString: 'pages.home.status.noSchool'
        };
    }

    if (!periodData) return { fmtString: 'common.unknownError' };

    if (periodData.type === 'before-school') {
        return {
            fmtString: 'pages.home.status.beforeSchool',
            fmtArgs: {
                time: getFormattedClockTime(periodData.nextPeriod.start)
            }
        };
    }

    // After school
    if (periodData.type === 'after-school') {
        return {
            fmtString: 'pages.home.status.afterSchool'
        };
    }

    // Passing
    if (periodData.type === 'passing') {
        return {
            fmtString: 'pages.home.status.passing'
        };
    }

    // Period
    return {
        fmtString: 'pages.home.status.period',
        fmtArgs: {
            period: getPeriodKey(periodData.period)
        }
    };
};

const getPeriodDescription = (
    scheduleData?: DayScheduleAny,
    periodData?:
        | PeriodDataPassing
        | PeriodDataPeriod
        | PeriodDataBeforeSchool
        | PeriodDataAfterSchool
): FmtProps | undefined => {
    if (!scheduleData) return { fmtString: 'common.unknownError' };

    if (!scheduleData.hasSchool || !scheduleData.periods) {
        if (scheduleData.type === 'custom-school') {
            return {
                fmtString: 'pages.home.descriptions.noSchoolCustom',
                fmtArgs: {
                    name: scheduleData.name
                }
            };
        } else if (scheduleData.type === 'holiday') {
            return {
                fmtString: 'pages.home.descriptions.noSchoolHoliday',
                fmtArgs: {
                    name: getHolidayFmtProps(scheduleData.holiday)
                }
            };
        } else if (scheduleData.type === 'standard-weekend') {
            return {
                fmtString: 'pages.home.descriptions.noSchoolWeekend'
            };
        }
    }

    if (!periodData) return { fmtString: 'common.unknownError' };

    if (periodData.type === 'before-school') {
        return {
            fmtString: 'pages.home.descriptions.beforeSchool',
            fmtArgs: {
                period: getPeriodKey(periodData.nextPeriod)
            }
        };
    }

    // Passing or period
    if (periodData.type === 'passing' || periodData.type === 'period') {
        if (!periodData.nextPeriod) return { fmtString: 'pages.home.descriptions.lastPeriod' };

        return {
            fmtString: 'pages.home.descriptions.upNext',
            fmtArgs: {
                period: getPeriodKey(periodData.nextPeriod)
            }
        };
    }
};

const getPeriodKey = (period: PeriodAny): FmtProps => {
    if (period.type === 'active') return { fmtString: periodTexts[period.active] };
    if (period.type === 'break') return { fmtString: periodTexts[period.break] };
    if (period.type === 'custom')
        return { fmtString: periodTexts.custom, fmtArgs: { name: period.name } };
    return { fmtString: periodTexts[period.period] };
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
            <SchoolStatus
                icon={() => {
                    const scheduleData = schedule();
                    const periodData = period();
                    // If no schedule, show the question mark
                    if (!scheduleData) return questionMarkCircle;

                    if (!scheduleData.hasSchool) return heart;

                    if (!periodData) return questionMarkCircle;

                    // Passing
                    if (periodData.type === 'passing') return arrowRight;

                    // Before school
                    if (periodData.type === 'before-school') return sun;

                    // After school
                    if (periodData.type === 'after-school') return faceSmile;

                    // Break
                    if (periodData.period.type === 'break') return bolt;

                    // Period
                    return academicCap;
                }}
                title={() => {
                    return getPeriodTitle(schedule(), period());
                }}
                subtitle={() => {
                    return getPeriodDescription(schedule(), period());
                }}
                progress={() => {
                    const periodData = period();
                    if (
                        !periodData ||
                        (periodData.type !== 'period' && periodData.type !== 'passing')
                    )
                        return undefined;

                    // Get the current period
                    const progress = (periodData.end - date().secondMidnight) / periodData.length;

                    return 1 - progress;
                }}
                periodEndsIn={() => {
                    const periodData = period();
                    if (
                        !periodData ||
                        (periodData.type !== 'period' && periodData.type !== 'passing')
                    )
                        return undefined;

                    return periodData.end - date().secondMidnight;
                }}
            />
            {schedule() && schedule()?.periods && (
                <>
                    <h3 class='text-3xl font-bold'>
                        <TranslationItem fmtString='pages.home.today' />
                    </h3>
                    <div class='flex flex-col gap-4'>
                        {(schedule()?.periods as PeriodAny[]).map(period => (
                            <div
                                class={
                                    'w-full rounded-lg bg-gray-900 p-6 shadow ring-1 ring-gray-800/60 backdrop-blur ' +
                                    (date().secondMidnight >= period.end && 'text-gray-400')
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
