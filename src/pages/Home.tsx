import { createSignal, type Component, onMount, onCleanup, createEffect } from 'solid-js';
import { PageLayout } from '../layouts/page';
import { getDateData, getFormattedClockTime, getFormattedDate } from '../utils/time';
import {
    DayScheduleAny,
    PeriodAny,
    filterSchedule,
    getHolidayFmtProps,
    getStandardSchedule,
    periodTexts,
    periodToStorablePeriod
} from '../utils/schedule';
import { FmtProps, TranslationItem, flattenFmt } from '../locales';
import { SchoolStatus } from '../components/SchoolStatus';
import { useSettingsStore } from '../utils/settings/store';
import { StorableSyncableSettingsV1 } from '../utils/settings/v1';
import { generateFavicon } from '../utils/favicon';

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

const getPeriodTitle = (
    scheduleData: DayScheduleAny | undefined,
    periodData:
        | PeriodDataPassing
        | PeriodDataPeriod
        | PeriodDataBeforeSchool
        | PeriodDataAfterSchool
        | undefined,
    settings: StorableSyncableSettingsV1
): FmtProps => {
    if (!scheduleData) return { fmtString: 'common.unknownError' };
    const periodKey =
        periodData && periodData.type === 'period'
            ? periodToStorablePeriod(periodData.period)
            : null;

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
    if (periodKey !== null && settings.periods[periodKey].name) {
        return {
            fmtString: 'pages.home.status.period',
            fmtArgs: {
                period: {
                    fmtString: 'common.periods.name',
                    fmtArgs: {
                        name: settings.periods[periodKey].name ?? ''
                    }
                }
            }
        };
    }

    return {
        fmtString: 'pages.home.status.period',
        fmtArgs: {
            period: getPeriodKey(periodData.period)
        }
    };
};

const getPeriodDescription = (
    scheduleData: DayScheduleAny | undefined,
    periodData:
        | PeriodDataPassing
        | PeriodDataPeriod
        | PeriodDataBeforeSchool
        | PeriodDataAfterSchool
        | undefined,
    settings: StorableSyncableSettingsV1
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
                period: getPeriodKey(periodData.nextPeriod, settings)
            }
        };
    }

    // Passing or period
    if (periodData.type === 'passing' || periodData.type === 'period') {
        if (!periodData.nextPeriod) return { fmtString: 'pages.home.descriptions.lastPeriod' };

        return {
            fmtString: 'pages.home.descriptions.upNext',
            fmtArgs: {
                period: getPeriodKey(periodData.nextPeriod, settings)
            }
        };
    }
};

const getPeriodKey = (period: PeriodAny, settings?: StorableSyncableSettingsV1): FmtProps => {
    if (settings) {
        const periodKey = periodToStorablePeriod(period);
        if (periodKey !== null && settings.periods[periodKey].name)
            return {
                fmtString: 'common.periods.custom',
                fmtArgs: { name: settings.periods[periodKey].name ?? '' }
            };
    }

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
    const [settings] = useSettingsStore();

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
            const scheduleData = getStandardSchedule(dateData);

            // Only update the schedule if it is different
            if (date().dayEpoch !== dateData.dayEpoch || !schedule()) {
                setPeriod(undefined);
                setSchedule(scheduleData);
            }

            setDate(dateData);
            const periodData = period();

            // Check holiday
            if (!scheduleData.hasSchool || !scheduleData.periods || !scheduleData.periods.length) {
                if (periodData) setPeriod(undefined);
                return doRefresh();
            }

            // Check before school
            if (dateData.secondMidnight < scheduleData.periods[0].start) {
                if (!periodData || periodData.type !== 'before-school') {
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
                if (!periodData || periodData?.type !== 'after-school') {
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
                    !periodData ||
                    periodData.type !== 'passing' ||
                    (periodData.type === 'passing' &&
                        (periodData as PeriodDataPassing).start !== latestPeriod.end)
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
                !periodData ||
                periodData.type !== 'period' ||
                (periodData.type === 'period' &&
                    (periodData as PeriodDataPeriod).start !== latestPeriod.start)
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

    createEffect(async () => {
        let fmt: FmtProps = { fmtString: 'common.unknownError' };
        const dateData = date();
        const periodData = period();
        const scheduleData = schedule()
            ? filterSchedule(date(), schedule()!, settings())
            : undefined;
        const settingsData = settings();
        const periodKey =
            periodData && periodData.type === 'period'
                ? periodToStorablePeriod(periodData.period)
                : null;

        if (periodData) {
            // After school
            if (periodData.type === 'after-school') {
                fmt = { fmtString: 'pages.home.titles.afterSchool' };
            }

            // Before school
            if (periodData.type === 'before-school') {
                fmt = {
                    fmtString: 'pages.home.titles.beforeSchool',
                    fmtArgs: {
                        time: getFormattedClockTime(periodData.nextPeriod.start)
                    }
                };
            }

            // Passing
            if (periodData.type === 'passing') {
                fmt = {
                    fmtString: 'pages.home.titles.periodPassing',
                    fmtArgs: {
                        period: getPeriodKey(periodData.nextPeriod)
                    }
                };
            }

            // Period
            if (periodData.type === 'period') {
                fmt = {
                    fmtString: 'pages.home.titles.period',
                    fmtArgs: {
                        period:
                            periodKey !== null && settingsData.periods[periodKey].name
                                ? {
                                      fmtString: 'common.periods.name',
                                      fmtArgs: {
                                          name: settingsData.periods[periodKey].name ?? ''
                                      }
                                  }
                                : getPeriodKey(periodData.period)
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

        // Set the favicon
        let faviconUrl: string = '/icon/icon.svg';
        let faviconType = 'image/svg+xml';
        if (periodData) {
            // Only show the favicon if we are in school (break, passing, or period)
            if (periodData.type === 'passing') {
                faviconUrl = URL.createObjectURL(
                    await generateFavicon(
                        {
                            r: 9,
                            g: 9,
                            b: 11
                        },
                        Math.floor((periodData.end - dateData.secondMidnight) / 60),
                        128
                    )
                );
                faviconType = 'image/png';
            } else if (periodData.type === 'period') {
                faviconUrl = URL.createObjectURL(
                    await generateFavicon(
                        {
                            r: 9,
                            g: 9,
                            b: 11
                        },
                        Math.floor((periodData.end - dateData.secondMidnight) / 60),
                        128
                    )
                );
                faviconType = 'image/png';
            }
        }

        // Set the favicon
        let faviocn = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
        if (!faviocn) {
            faviocn = document.createElement('link');
            faviocn.rel = 'icon';
            document.head.appendChild(faviocn);
        }

        faviocn.href = faviconUrl;
        faviocn.type = faviconType;
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
                    const scheduleData = schedule()
                        ? filterSchedule(date(), schedule()!, settings())
                        : undefined;
                    const periodData = period();
                    const settingsData = settings();
                    const periodKey =
                        periodData && periodData.type === 'period'
                            ? periodToStorablePeriod(periodData.period)
                            : null;

                    // If no schedule, show the question mark
                    if (!scheduleData) return 'Cloud';

                    if (!scheduleData.hasSchool) return 'Cloud';

                    if (!periodData) return 'HelpCircle';

                    if (periodKey !== null) settingsData.periods[periodKey].icon;

                    // Before school
                    if (periodData.type === 'before-school') return 'Sunrise';

                    // After school
                    if (periodData.type === 'after-school') return 'BedDouble';

                    // Passing
                    if (periodData.type === 'passing') return 'Clock';

                    // Break
                    if (periodData.period.type === 'break') return 'Pizza';

                    // Period
                    return 'GraduationCap';
                }}
                title={() => {
                    return getPeriodTitle(
                        schedule() ? filterSchedule(date(), schedule()!, settings()) : undefined,
                        period(),
                        settings()
                    );
                }}
                subtitle={() => {
                    return getPeriodDescription(
                        schedule() ? filterSchedule(date(), schedule()!, settings()) : undefined,
                        period(),
                        settings()
                    );
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
            {(schedule() ? filterSchedule(date(), schedule()!, settings()) : undefined) &&
                (schedule() ? filterSchedule(date(), schedule()!, settings()) : undefined)
                    ?.periods && (
                    <>
                        <h3 class='text-3xl font-bold'>
                            <TranslationItem fmtString='pages.home.today' />
                        </h3>
                        <div class='flex flex-col gap-4'>
                            {(
                                (schedule()
                                    ? filterSchedule(date(), schedule()!, settings())
                                    : undefined
                                )?.periods as PeriodAny[]
                            ).map(period => (
                                <div
                                    class={
                                        'w-full rounded-lg bg-gray-900 p-6 shadow ring-1 ring-gray-800/60 backdrop-blur ' +
                                        (date().secondMidnight >= period.end && 'text-gray-400')
                                    }
                                >
                                    <h4 class='text-2xl font-bold'>
                                        <TranslationItem {...getPeriodKey(period, settings())} />
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
