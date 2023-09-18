import { createSignal, type Component, createEffect } from 'solid-js';
import { DateData, getDateData, getFormattedClockTime, getFormattedDateShort } from '../utils/time';
import {
    DayScheduleAny,
    filterSchedule,
    getPeriodName,
    getStandardSchedule
} from '../utils/schedule';
import { GroupBox } from './GroupBox';
import { TranslationItem } from '../locales';
import { Button } from './Button';
import { Icon } from '../utils/icon';
import { useSettingsStore } from '../utils/settings/store';

interface ScheduleListProps {
    defaultDate: () => DateData;
}

export const ScheduleList: Component<ScheduleListProps> = ({ defaultDate }) => {
    let cache = 0;
    const [settings] = useSettingsStore();
    const [lookAhead, setLookAhead] = createSignal<Date | null>(null);
    const [schedule, setSchedule] = createSignal<DayScheduleAny>({
        type: 'customSchool',
        name: 'error',
        hasSchool: false
    });

    const updateSchedule = (date: DateData) => {
        if (date.dayEpoch === cache) return;
        cache = date.dayEpoch;

        const scheduleData = filterSchedule(date, getStandardSchedule(date), settings);
        setSchedule(scheduleData);
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
            <div class='flex items-center gap-2'>
                <div class='flex flex-col gap-1'>
                    <h2 class='text-2xl font-bold'>
                        {lookAhead() ? (
                            <TranslationItem fmtString='components.scheduleList.arbitrary' />
                        ) : (
                            <TranslationItem fmtString='components.scheduleList.today' />
                        )}
                    </h2>
                    {lookAhead() ? (
                        <p class='text-sm text-gray-300'>
                            {['standardSchool', 'standardWeekend', 'holiday'].includes(
                                schedule().type
                            ) ? (
                                <TranslationItem
                                    {...getFormattedDateShort(
                                        getDateData(lookAhead() || new Date())
                                    )}
                                />
                            ) : (
                                <TranslationItem
                                    fmtString='components.scheduleList.arbitraryAlternate'
                                    fmtArgs={{
                                        date: getFormattedDateShort(
                                            getDateData(lookAhead() || new Date())
                                        )
                                    }}
                                />
                            )}
                        </p>
                    ) : (
                        <p class='text-sm text-gray-300'>
                            {['standardSchool', 'standardWeekend', 'holiday'].includes(
                                schedule().type
                            ) || <TranslationItem fmtString='components.scheduleList.alternate' />}
                        </p>
                    )}
                </div>
                <div class='flex-grow' />
                <Button
                    disabled={() => lookAhead() === null}
                    onClick={() => setLookAhead(null)}
                    style='secondary'
                    ariaLabel={{
                        fmtString: 'components.scheduleList.goBack'
                    }}
                >
                    <Icon class='h-4 w-4' name={() => 'Home'} />
                </Button>
                <Button
                    disabled={() => false}
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
                    disabled={() => false}
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
            <div class='flex flex-col gap-4'>
                {schedule().hasSchool && schedule().periods ? (
                    schedule().periods!.map(p => (
                        <GroupBox padding='small'>
                            <div
                                class={
                                    'flex flex-col gap-1 ' +
                                    (!lookAhead() && p.end <= defaultDate().secondMidnight
                                        ? 'opacity-60'
                                        : '')
                                }
                            >
                                <h3 class='text-xl font-bold'>
                                    <TranslationItem {...getPeriodName(p, settings)} />
                                </h3>
                                <p class='text-md text-gray-300'>
                                    <TranslationItem
                                        fmtString='components.scheduleList.periodTime'
                                        fmtArgs={{
                                            start: getFormattedClockTime(p.start),
                                            end: getFormattedClockTime(p.end)
                                        }}
                                    />
                                </p>
                            </div>
                        </GroupBox>
                    ))
                ) : (
                    <GroupBox padding='medium'>
                        <p class='text-md flex items-center justify-center text-lg font-bold text-gray-300'>
                            <TranslationItem fmtString='components.scheduleList.noSchool' />
                        </p>
                    </GroupBox>
                )}
            </div>
        </div>
    );
};