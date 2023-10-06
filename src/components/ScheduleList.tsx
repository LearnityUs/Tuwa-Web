import { createSignal, type Component, createEffect } from 'solid-js';
import { DateData, getDateData, getFormattedClockTime, getFormattedDate } from '../utils/time';
import {
    DayScheduleAny,
    filterSchedule,
    getPeriodName,
    getStandardSchedule
} from '../utils/schedule';
import { TranslationItem } from '../locales';
import { Button } from './Button';
import { Icon } from '../utils/icon';
import { useSettingsStore } from '../utils/settings/store';

interface ScheduleListProps {
    defaultDate: () => DateData;
}

export const ScheduleList: Component<ScheduleListProps> = ({ defaultDate }) => {
    let cache = 0;
    let settingsDate = 0;
    const [settings, , updateTime] = useSettingsStore();
    const [lookAhead, setLookAhead] = createSignal<Date | null>(null);
    const [schedule, setSchedule] = createSignal<DayScheduleAny>({
        type: 'customSchool',
        name: 'error',
        hasSchool: false
    });

    const updateSchedule = (date: DateData) => {
        if (date.dayEpoch === cache && updateTime() === settingsDate) return;
        settingsDate = updateTime();
        cache = date.dayEpoch;

        const scheduleData = getStandardSchedule(date);
        setSchedule(filterSchedule(date, scheduleData, settings));
    };

    createEffect(() => {
        const date = defaultDate();
        const lookAheadDate = lookAhead();

        if (lookAheadDate) {
            // Get the date data for the look ahead date
            const lookAheadDateData = getDateData(lookAheadDate);

            if (lookAheadDateData.dayEpoch === date.dayEpoch) {
                updateSchedule(date);
                setLookAhead(null);
                return;
            }
            updateSchedule(getDateData(lookAheadDate));
        } else {
            updateSchedule(date);
        }
    });

    return (
        <div class='flex flex-col gap-4'>
            <div class='flex flex-col gap-2 md:flex-row md:items-center'>
                <div class='flex flex-col gap-1'>
                    <h2 class='text-2xl font-bold'>
                        {lookAhead() ? (
                            <TranslationItem fmtString='components.scheduleList.arbitrary' />
                        ) : (
                            <TranslationItem fmtString='components.scheduleList.today' />
                        )}
                    </h2>
                    {lookAhead() ? (
                        <p class='text-milk-800 dark:text-rice-200 text-sm'>
                            {['standardSchool', 'standardWeekend', 'holiday'].includes(
                                schedule().type
                            ) ? (
                                <TranslationItem
                                    {...getFormattedDate(getDateData(lookAhead() || new Date()))}
                                />
                            ) : (
                                <TranslationItem
                                    fmtString='components.scheduleList.arbitraryAlternate'
                                    fmtArgs={{
                                        date: getFormattedDate(
                                            getDateData(lookAhead() || new Date())
                                        )
                                    }}
                                />
                            )}
                        </p>
                    ) : (
                        <p class='text-milk-800 dark:text-rice-200 text-sm'>
                            {['standardSchool', 'standardWeekend', 'holiday'].includes(
                                schedule().type
                            ) || <TranslationItem fmtString='components.scheduleList.alternate' />}
                        </p>
                    )}
                </div>
                <div class='md:flex-grow' />
                <div class='flex w-full justify-center gap-3 md:w-min'>
                    <Button
                        state={() => (lookAhead() ? 'default' : 'disabled')}
                        onClick={() => setLookAhead(null)}
                        style='secondary'
                        ariaLabel={{
                            fmtString: 'components.scheduleList.goBack'
                        }}
                    >
                        <Icon class='h-4 w-4' name={() => 'Home'} />
                    </Button>
                    <Button
                        onClick={() => {
                            const ogDate = lookAhead() || new Date();
                            const newDate = new Date(ogDate);
                            newDate.setDate(newDate.getDate() - 1);
                            setLookAhead(newDate);
                        }}
                        style='secondary'
                        ariaLabel={{
                            fmtString: 'components.scheduleList.previousDay'
                        }}
                    >
                        <Icon class='h-4 w-4' name={() => 'ArrowLeft'} />
                    </Button>
                    <Button
                        onClick={() => {
                            const ogDate = lookAhead() || new Date();
                            const newDate = new Date(ogDate);
                            newDate.setDate(newDate.getDate() + 1);
                            setLookAhead(newDate);
                        }}
                        style='secondary'
                        ariaLabel={{
                            fmtString: 'components.scheduleList.nextDay'
                        }}
                    >
                        <Icon class='h-4 w-4' name={() => 'ArrowRight'} />
                    </Button>
                </div>
            </div>
            <div class='flex flex-col gap-4'>
                {schedule().hasSchool && schedule().periods ? (
                    schedule().periods!.map(p => (
                        <div class='flex gap-4 px-4 py-2'>
                            <div
                                class={
                                    'h-full w-1 rounded-full transition-colors ' +
                                    (!lookAhead() && p.end <= defaultDate().secondMidnight
                                        ? 'dark:bg-themedark-800 bg-theme-300'
                                        : 'dark:bg-themedark-700 bg-theme-400')
                                }
                            />
                            <div
                                class={
                                    'flex flex-col gap-1 ' +
                                    (!lookAhead() &&
                                        p.end <= defaultDate().secondMidnight &&
                                        'opacity-60')
                                }
                            >
                                <h3 class='text-xl font-bold'>
                                    <TranslationItem {...getPeriodName(p, settings)} />
                                </h3>
                                <div
                                    class={
                                        'text-md text-milk-800 dark:text-rice-200 flex items-center gap-2 transition-colors ' +
                                        (!lookAhead() && p.end <= defaultDate().secondMidnight
                                            ? 'text-milk-700 dark:text-rice-300'
                                            : 'text-milk-800 dark:text-rice-200 ')
                                    }
                                >
                                    <Icon name={() => 'Clock'} class='h-4 w-4' />
                                    <p>
                                        <TranslationItem
                                            fmtString='components.scheduleList.periodTime'
                                            fmtArgs={{
                                                start: getFormattedClockTime(p.start, settings),
                                                end: getFormattedClockTime(p.end, settings)
                                            }}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p class='text-md text-milk-800 dark:text-rice-200 flex items-center justify-center text-lg font-bold'>
                        <TranslationItem fmtString='components.scheduleList.noSchool' />
                    </p>
                )}
            </div>
        </div>
    );
};
