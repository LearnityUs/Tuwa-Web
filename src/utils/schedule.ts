import type { FmtProps } from '../locales';
import { schedules } from './defaultSchedule';
import type { StorableSyncableSettingsV1 } from './settings/v1';
import type { DateData, WeekDays } from './time';
import overides from './overides.json';

/// Base period with start and end time
interface Period {
    start: number;
    end: number;
    grades?: ('9' | '10' | '11' | '12')[];
}

/// Class period (period 0-8)
export interface PeriodClass extends Period {
    type: 'period';
    period: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

/// Break period (brunch or lunch)
export interface PeriodBreak extends Period {
    type: 'break';
    break: 'brunch' | 'lunch';
}

/// Active period (study hall, prime, self)
export interface PeriodActive extends Period {
    type: 'active';
    active: 'study-hall' | 'prime' | 'self';
}

/// Custom period
export interface PeriodCustom extends Period {
    type: 'custom';
    name: string;
}

/// Any period
export type PeriodAny = PeriodClass | PeriodBreak | PeriodActive | PeriodCustom;

/// Day schedule
interface DaySchedule {
    hasSchool: boolean;
    periods?: PeriodAny[];
}

/// In school day schedule
export interface DayScheduleStandardSchool extends DaySchedule {
    type: 'standard-school';
    day: WeekDays;
    hasSchool: true;
    periods: PeriodAny[];
}

/// Weekend school day schedule
export interface DayScheduleStandardWeekend extends DaySchedule {
    type: 'standard-weekend';
    day: 'saturday' | 'sunday';
    hasSchool: false;
}

/// Holiday name
// TODO: Add holiday names
export type HolidayName = '';

/// Holiday school day schedule
export interface DayScheduleHoliday extends DaySchedule {
    type: 'holiday';
    holiday: HolidayName;
    periods?: PeriodAny[];
}

/// Custom school day schedule
export interface DayScheduleCustom extends DaySchedule {
    type: 'custom-school';
    name: string;
    periods?: PeriodAny[];
}

/// Any school day schedule
export type DayScheduleAny =
    | DayScheduleStandardSchool
    | DayScheduleStandardWeekend
    | DayScheduleHoliday
    | DayScheduleCustom;

/// Converts a period to a StorablePeriod name
export const periodToStorablePeriod = (
    period: PeriodAny
): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'prime' | 'self' | 'studyHall' | null => {
    if (period.type === 'period') {
        return period.period;
    }

    if (period.type === 'active') {
        const map: Record<'prime' | 'self' | 'study-hall', 'prime' | 'self' | 'studyHall'> = {
            prime: 'prime',
            self: 'self',
            'study-hall': 'studyHall'
        };

        return map[period.active];
    }

    return null;
};

/// Filters a schedule
export const filterSchedule = (
    date: DateData,
    schedule: DayScheduleAny,
    settings: StorableSyncableSettingsV1
) => {
    const gradeLevel = (settings.graduationYear - date.year + 9).toString() as
        | '9'
        | '10'
        | '11'
        | '12';

    schedule.periods = schedule.periods
        ? schedule.periods!.filter(period => {
              const isGrade = period.grades ? period.grades.includes(gradeLevel) : true;
              const isEnabled =
                  periodToStorablePeriod(period) !== null
                      ? settings.periods[periodToStorablePeriod(period)!].enabled
                      : true;

              return isGrade && isEnabled;
          })
        : [];

    return schedule;
};

/// Get the standard schedule for a day
export const getStandardSchedule = (dateData: DateData): DayScheduleAny => {
    // Check if day epoch is overidden
    const dayEpoch = dateData.dayEpoch.toString();
    if (dayEpoch in overides) {
        return overides[dayEpoch as keyof typeof overides] as DayScheduleAny;
    }

    return schedules[dateData.dayName];
};

/// Gets the FmtProps for a holiday
export const getHolidayFmtProps = (holiday: HolidayName): FmtProps => {
    return { fmtString: holiday };
};

export const periodTexts = {
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
    studyHall: 'common.periods.studyHall',
    prime: 'common.periods.prime',
    self: 'common.periods.self',
    custom: 'common.periods.custom'
};
