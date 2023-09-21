import { createSignal, type Component, createEffect } from 'solid-js';
import { FmtProps, TranslationItem } from '../locales';
import { GroupBox } from './GroupBox';
import { ProgressBar } from './ProgressBar';
import { DateData, getFormatedTimeLeft, getFormattedClockTime } from '../utils/time';
import { icons } from 'lucide-solid';
import { Icon } from '../utils/icon';
import { DayScheduleAny, getPeriodKey, getPeriodName } from '../utils/schedule';
import { useSettingsStore } from '../utils/settings/store';
import { generateFavicon } from '../utils/favicon';

interface SchoolStatusProps {
    schedule: () => DayScheduleAny | undefined;
    date: () => DateData;
    shouldSetFavicon: boolean;
}

export const SchoolStatus: Component<SchoolStatusProps> = ({
    schedule,
    date,
    shouldSetFavicon
}) => {
    let cache: string = '';
    let faviconCache: string = '';
    const [settings] = useSettingsStore();
    const [icon, setIcon] = createSignal<keyof typeof icons>('School');
    const [title, setTitle] = createSignal<FmtProps | undefined>(undefined);
    const [subtitle, setSubtitle] = createSignal<FmtProps | undefined>(undefined);
    const [progress, setProgress] = createSignal<number | undefined>(undefined);
    const [periodEndsIn, setPeriodEndsIn] = createSignal<number | undefined>(undefined);

    const updateFavicon = (periodLeft: number | null) => {
        if (!shouldSetFavicon) return;

        let favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'shortcut icon';
            document.head.appendChild(favicon);
        }

        const cacheString = periodLeft === null ? 'null' : `${Math.floor(periodLeft / 60)}`;
        if (faviconCache === cacheString) return;
        faviconCache = cacheString;

        if (periodLeft === null) {
            favicon.href = '/icon/icon.svg';
            favicon.type = 'image/svg+xml';
            return;
        }

        // Get icon blob
        const icon = generateFavicon(
            {
                r: 0,
                g: 0,
                b: 0
            },
            Math.floor(periodLeft / 60),
            128
        );
        // Encode the image as a data url
        favicon.href = icon;
        favicon.type = 'image/png';
    };

    createEffect(() => {
        // Using the time check the current period
        const scheduleData = schedule();
        const dateData = date();

        if (!scheduleData) {
            setProgress(undefined);
            setPeriodEndsIn(undefined);
            setIcon('AlertTriangle');
            setTitle({ fmtString: 'common.unknownError' });
            setSubtitle(undefined);
            updateFavicon(null);
            return;
        }

        // No school!
        if (!scheduleData.hasSchool || !scheduleData.periods || !scheduleData.periods.length) {
            setProgress(undefined);
            setPeriodEndsIn(undefined);

            switch (scheduleData.type) {
                case 'standardWeekend':
                    if (cache === 'standardWeekend') return;
                    setIcon('Sun');
                    setTitle({ fmtString: 'components.schoolStatus.headings.weekend' });
                    setSubtitle(undefined);
                    cache = 'standardWeekend';
                    break;
                case 'holiday':
                    if (cache === 'holiday') return;
                    // TODO: Properly handle holidays
                    // setIcon('Gift');
                    // setTitle({ fmtString: 'components.schoolStatus.holiday' });
                    // setSubtitle(undefined);
                    cache = 'holiday';
                    break;
                case 'customSchool':
                    if (cache === 'customSchool') return;
                    setIcon('Calendar');
                    setTitle({
                        fmtString: 'components.schoolStatus.headings.noSchool',
                        fmtArgs: {
                            name: scheduleData.name
                        }
                    });
                    setSubtitle(undefined);
                    cache = 'customSchool';
                    break;
            }
            updateFavicon(null);
            return;
        }

        // Get the current period
        let periodIndex = -1;

        // Get the last period that has already ended
        for (let i = scheduleData.periods.length - 1; i >= 0; i--) {
            if (dateData.secondMidnight >= scheduleData.periods[i].start) {
                periodIndex = i;
                break;
            }
        }

        // Period finished
        const periodFinished =
            periodIndex !== -1
                ? dateData.secondMidnight >= scheduleData.periods[periodIndex].end
                : false;

        const cacheString = `${periodIndex}-${periodFinished}`;

        // Before school
        if (periodIndex === -1) {
            if (cache === cacheString) return;
            cache = cacheString;
            setProgress(undefined);
            setPeriodEndsIn(undefined);
            setIcon('Sunrise');
            setTitle({
                fmtString: 'components.schoolStatus.headings.beforeSchool',
                fmtArgs: {
                    time: getFormattedClockTime(scheduleData.periods[0].start)
                }
            });
            setSubtitle({
                fmtString: 'components.schoolStatus.subheadings.firstPeriod',
                fmtArgs: {
                    period: getPeriodName(scheduleData.periods[0], settings)
                }
            });
            updateFavicon(null);
            return;
        }

        // After school
        if (periodFinished && periodIndex === scheduleData.periods.length - 1) {
            if (cache === cacheString) return;
            cache = cacheString;
            setProgress(undefined);
            setPeriodEndsIn(undefined);
            setIcon('Sunset');
            setTitle({ fmtString: 'components.schoolStatus.headings.afterSchool' });
            setSubtitle(undefined);
            updateFavicon(null);
            return;
        }

        const periodData = scheduleData.periods[periodIndex];

        // Passing period
        if (periodFinished) {
            const nextPeriod = scheduleData.periods[periodIndex + 1];
            const length = nextPeriod.start - periodData.end;
            const timeLeft = nextPeriod.start - dateData.secondMidnight;

            updateFavicon(timeLeft);
            setProgress(timeLeft / length);
            setPeriodEndsIn(timeLeft);
            if (cache === cacheString) return;
            cache = cacheString;
            setIcon('Clock');
            setTitle({
                fmtString: 'components.schoolStatus.headings.passingPeriod'
            });
            setSubtitle({
                fmtString: 'components.schoolStatus.subheadings.nextPeriod',
                fmtArgs: {
                    period: getPeriodName(nextPeriod, settings)
                }
            });
        }

        // In class
        const length = periodData.end - periodData.start;
        const timeLeft = periodData.end - dateData.secondMidnight;

        updateFavicon(timeLeft);
        setProgress(timeLeft / length);
        setPeriodEndsIn(timeLeft);

        if (cache === cacheString) return;
        cache = cacheString;

        // Custom icon and stuff
        const key = getPeriodKey(periodData);
        if (key) {
            setIcon(settings.periods[key].icon);
        } else {
            setIcon('Pizza');
        }

        setTitle(getPeriodName(periodData, settings));

        // If last period, show last period
        if (periodIndex === scheduleData.periods.length - 1) {
            setSubtitle({
                fmtString: 'components.schoolStatus.subheadings.lastPeriod'
            });
        } else {
            setSubtitle({
                fmtString: 'components.schoolStatus.subheadings.nextPeriod',
                fmtArgs: {
                    period: getPeriodName(scheduleData.periods[periodIndex + 1], settings)
                }
            });
        }
    });

    return (
        <GroupBox>
            <div class={'flex items-start gap-4 ' + (subtitle() || 'items-center')}>
                <div class='flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full bg-theme-700 p-3'>
                    <Icon name={icon} />
                </div>
                <div class='flex w-full flex-col gap-4'>
                    <div class='flex flex-col gap-1'>
                        <h2 class='text-3xl font-bold'>
                            <TranslationItem
                                {...(title() ?? {
                                    fmtString: 'common.unknownError'
                                })}
                            />
                        </h2>
                        {subtitle() && (
                            <p class='text-md text-gray-300'>
                                <TranslationItem
                                    {...(subtitle() ?? {
                                        fmtString: 'common.unknownError'
                                    })}
                                />
                            </p>
                        )}
                    </div>
                    {typeof progress() !== 'undefined' && (
                        <div class='flex flex-col gap-2'>
                            <ProgressBar
                                value={() => 1 - (progress() ?? 0)}
                                label={() => ({
                                    fmtString: 'components.schoolStatus.progress'
                                })}
                            />
                            <p class='text-sm text-gray-300'>
                                <TranslationItem
                                    fmtString='components.schoolStatus.periodLeft'
                                    fmtArgs={{
                                        time: getFormatedTimeLeft(periodEndsIn() ?? 0)
                                    }}
                                />
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </GroupBox>
    );
};
