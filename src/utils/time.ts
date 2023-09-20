import { FmtProps } from '../locales';
import { StorableSyncableSettingsV1 } from './settings/v1';

/// Type containing the months
export type AllMonths =
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december';

/// Type containing the week days
export type AllDays =
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday';

/// Type containing the standard week days
export type WeekDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

/// Type containing the weekend week days
export type WeekendDays = 'saturday' | 'sunday';

/// The current time in seconds since midnight
export const getSecMidTime = (hours: number, minutes: number, seconds = 0) => {
    return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Format time to `1 hour and 2 minutes`
 * @param secondMidnight - time in seconds
 * @param useSeconds - whether to include seconds
 */
export const getFormatedTimeLeft = (secondMidnight: number, useSeconds = false): FmtProps => {
    const hours = Math.floor(secondMidnight / 3600);
    const minutes = Math.floor((secondMidnight % 3600) / 60);
    const seconds = useSeconds ? secondMidnight % 60 : 0;

    if (hours < 0 || minutes < 0) {
        return {
            fmtString: 'common.unknownError'
        };
    }

    const hoursFmt = {
        fmtString: 'utils.time.timeLeft.hours',
        fmtArgs: {
            count: hours
        }
    };

    const minutesFmt = {
        fmtString: 'utils.time.timeLeft.minutes',
        fmtArgs: {
            count: minutes
        }
    };

    const secondsFmt = {
        fmtString: 'utils.time.timeLeft.seconds',
        fmtArgs: {
            count: seconds
        }
    };

    // Now
    if (hours === 0 && minutes === 0 && seconds === 0) {
        return {
            fmtString: 'utils.time.timeLeft.seconds',
            fmtArgs: {
                count: secondMidnight % 60
            }
        };
    }

    // x seconds
    if (hours === 0 && minutes === 0 && seconds !== 0) {
        return secondsFmt;
    }

    // x minutes
    if (hours === 0 && minutes !== 0 && seconds === 0) {
        return minutesFmt;
    }

    // x hours
    if (hours !== 0 && minutes === 0 && seconds === 0) {
        return hoursFmt;
    }

    // x hours y minutes
    if (hours !== 0 && minutes !== 0 && seconds === 0) {
        return {
            fmtString: 'utils.time.timeLeft.timeFmtTwo',
            fmtArgs: {
                unitBig: hoursFmt,
                unitSmall: minutesFmt
            }
        };
    }

    // x hours y seconds
    if (hours !== 0 && minutes === 0 && seconds !== 0) {
        return {
            fmtString: 'utils.time.timeLeft.timeFmtTwo',
            fmtArgs: {
                unitBig: hoursFmt,
                unitSmall: secondsFmt
            }
        };
    }

    // x minutes y seconds
    if (hours === 0 && minutes !== 0 && seconds !== 0) {
        return {
            fmtString: 'utils.time.timeLeft.timeFmtTwo',
            fmtArgs: {
                unitBig: minutesFmt,
                unitSmall: secondsFmt
            }
        };
    }

    return {
        fmtString: 'utils.time.timeLeft.timeFmtThree',
        fmtArgs: {
            unitBig: hoursFmt,
            unitMedium: minutesFmt,
            unitSmall: secondsFmt
        }
    };
};

/**
 * Format time to `1:02 PM`
 * @param secondMidnight - time in seconds
 */

export const getFormattedClockTime = (
    secondMidnight: number,
    settings?: StorableSyncableSettingsV1
): FmtProps => {
    const hours = Math.floor(secondMidnight / 3600);
    const minutes = Math.floor((secondMidnight % 3600) / 60);

    if (settings?.timeFormat === '24h') {
        return {
            fmtString: 'common.time.timeFmt24h',
            fmtArgs: {
                hours,
                minutes: minutes < 10 ? `0${minutes}` : minutes
            }
        };
    }

    return {
        fmtString: 'common.time.timeFmt12h',
        fmtArgs: {
            hours: hours % 12 === 0 ? 12 : hours % 12,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            ampm: {
                fmtString: hours < 12 ? 'common.time.am' : 'common.time.pm'
            }
        }
    };
};

/**
 * Get the date formatted as `Monday, January 1, 2021`
 */
export const getFormattedDate = (dateData: DateData): FmtProps => {
    return {
        fmtString: 'utils.time.dateFmt',
        fmtArgs: {
            day: {
                fmtString: dateData.dayKey
            },
            month: {
                fmtString: dateData.monthKey
            },
            date: dateData.date,
            year: dateData.year
        }
    };
};

/**
 * Get the date formatted as `January 1, 2021`
 */
export const getFormattedDateShort = (dateData: DateData): FmtProps => {
    return {
        fmtString: 'utils.time.dateFmtShort',
        fmtArgs: {
            month: {
                fmtString: dateData.monthKey
            },
            date: dateData.date,
            year: dateData.year
        }
    };
};

export interface DateData {
    /// The year...
    year: number;
    /// The month...
    month: number;
    /// The month name (e.g. January)
    monthName: AllMonths;
    /// The month key (e.g. utils.time.months.january)
    monthKey: string;
    /// The date...
    date: number;
    /// The day of the month...
    day: number;
    /// The day name (e.g. Monday)
    dayName: AllDays;
    /// The day key (e.g. utils.time.days.monday)
    dayKey: string;
    /// The hour...
    hour: number;
    /// The minute...
    minute: number;
    /// The second...
    second: number;
    /// Seconds since midnight
    secondMidnight: number;
    /// Days since epoch
    dayEpoch: number;
}

/**
 * Get date data from a date object
 * @param date - the date object
 * @returns the date data
 * @example
 * const date = new Date();
 * const dateData = getDateData(date);
 * console.log(dateData);
 */
export const getDateData = (date = new Date()): DateData => {
    const year = date.getFullYear();

    // Month
    const month = date.getMonth();
    const months: AllMonths[] = [
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
    ];
    const monthName = months[month];
    const monthKey = `utils.time.months.${monthName}`;

    // Date
    const dateNum = date.getDate();

    // Day
    const day = date.getDay();
    const days: AllDays[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
    ];
    const dayName = days[date.getDay()];
    const dayKey = `utils.time.days.${dayName}`;

    // Time
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const secondMidnight = hour * 3600 + minute * 60 + second;

    // Days since epoch (adjusted for timezone)
    const dayEpoch = Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);

    return {
        year,
        month,
        monthName,
        monthKey,
        date: dateNum,
        day,
        dayName,
        dayKey,
        hour,
        minute,
        second,
        secondMidnight,
        dayEpoch
    };
};
