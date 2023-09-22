import type { FmtProps } from '../locales';
import { schedules } from './defaultSchedule';
import type { StorableSyncableSettingsV1 } from './settings/v1';
import type { DateData, WeekDays } from './time';
import overides from './overides.json';

/// Base period with start and end time
interface Period {
    start: number;
    end: number;
    grades: ('9' | '10' | '11' | '12' | 'educator')[];
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
    active: 'studyHall' | 'prime' | 'self';
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
    type: 'standardSchool';
    day: WeekDays;
    hasSchool: true;
    periods: PeriodAny[];
}

/// Weekend school day schedule
export interface DayScheduleStandardWeekend extends DaySchedule {
    type: 'standardWeekend';
    day: 'saturday' | 'sunday';
    hasSchool: false;
}

/// Holiday name
// TODO: Add holiday names
export type HolidayName = 'localHoliday';

/// Holiday school day schedule
export interface DayScheduleHoliday extends DaySchedule {
    type: 'holiday';
    holiday: HolidayName;
    periods?: PeriodAny[];
}

/// Custom school day schedule
export interface DayScheduleCustom extends DaySchedule {
    type: 'customSchool';
    name: string;
    periods?: PeriodAny[];
}

/// Any school day schedule
export type DayScheduleAny =
    | DayScheduleStandardSchool
    | DayScheduleStandardWeekend
    | DayScheduleHoliday
    | DayScheduleCustom;

export type PeriodKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'prime' | 'self' | 'studyHall';

/// Gets the period key for a period
export const getPeriodKey = (period: PeriodAny): PeriodKey | null => {
    if (period.type === 'period') {
        return period.period;
    }

    if (period.type === 'active') {
        return period.active;
    }

    return null;
};

/// Gets the holiday name for a holiday
export const getHolidayName = (holiday: HolidayName): FmtProps => {
    return {
        fmtString: holidayTexts[holiday]
    };
};

/// Gets the formatted period text for a period
export const getPeriodName = (
    period: PeriodAny,
    settings?: StorableSyncableSettingsV1
): FmtProps => {
    const key = getPeriodKey(period);

    if (settings && key !== null && settings.periods[key].name) {
        return {
            fmtString: 'common.periods.custom',
            fmtArgs: {
                name: settings.periods[key].name
            }
        };
    }

    if (period.type === 'custom') {
        return {
            fmtString: 'common.periods.custom',
            fmtArgs: {
                name: period.name
            }
        };
    }

    // Breaks are not customizable
    if (period.type === 'break') {
        return {
            fmtString: periodTexts[period.break]
        };
    }

    return {
        fmtString: periodTexts[key ?? 'custom']
    };
};

/// Filters a schedule
export const filterSchedule = (
    date: DateData,
    schedule: DayScheduleAny,
    settings: StorableSyncableSettingsV1
) => {
    const year = date.year;
    const gradYear =
        settings.graduationYear < year || settings.graduationYear > year + 4
            ? year
            : settings.graduationYear;
    const gradeLevel = gradYear - year + 8 + (date.month >= 8 ? 0 : -1);

    const educator = settings.isEducator;

    const scheduleData = { ...schedule };

    scheduleData.periods = scheduleData.periods
        ? [...scheduleData.periods].filter(period => {
              const isGrade = period.grades.includes(
                  (educator ? 'educator' : gradeLevel.toString()) as
                      | '9'
                      | '10'
                      | '11'
                      | '12'
                      | 'educator'
              );
              const isEnabled =
                  getPeriodKey(period) !== null
                      ? settings.periods[getPeriodKey(period)!].enabled
                      : true;

              return isGrade && isEnabled;
          })
        : [];

    return scheduleData;
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

export const periodTexts: Record<PeriodKey | 'lunch' | 'brunch' | 'custom', string> = {
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
    studyHall: 'common.periods.studyHall',
    prime: 'common.periods.prime',
    self: 'common.periods.self',
    custom: 'common.periods.custom'
};

export const holidayTexts: Record<HolidayName, string> = {
    localHoliday: 'common.holidays.localHoliday'
};
