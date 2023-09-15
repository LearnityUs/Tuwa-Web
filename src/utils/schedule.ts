import { FmtProps } from '../locales';
import { schedules } from './defaultSchedule';
import { WeekDays, getDateData } from './time';

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

/// Get the standard schedule for a day
export const getStandardSchedule = (date: Date): DayScheduleAny => {
    const dateData = getDateData(date);

    return schedules[dateData.dayName];
};

/// Gets the FmtProps for a holiday
export const getHolidayFmtProps = (holiday: HolidayName): FmtProps => {
    return { fmtString: holiday };
};
