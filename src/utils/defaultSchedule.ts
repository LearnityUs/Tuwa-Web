interface Period {
    start: number;
    end: number;
}

interface ScheduleClass extends Period {
    type: 'period';
    period: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

interface ScheduleBreak extends Period {
    type: 'break';
    break: 'brunch' | 'lunch';
}

interface ScheduleActive extends Period {
    type: 'active';
    active: 'study-hall' | 'prime' | 'self';
}

export type ScheduleItem = ScheduleClass | ScheduleBreak | ScheduleActive;

const startTime = (hour: number, minute: number) => hour * 60 + minute;

export const schedules: Record<
    string,
    {
        day: 'monday' | 'tuesday' | 'wednessday' | 'thursday' | 'friday';
        periods: ScheduleItem[];
    }
> = {
    monday: {
        day: 'monday',
        periods: [
            {
                type: 'period',
                period: 0,
                start: startTime(7, 55),
                end: startTime(8, 45)
            },
            {
                type: 'period',
                period: 1,
                start: startTime(9, 0),
                end: startTime(9, 45)
            },
            {
                type: 'period',
                period: 2,
                start: startTime(9, 55),
                end: startTime(10, 40)
            },
            {
                type: 'break',
                break: 'brunch',
                start: startTime(10, 40),
                end: startTime(10, 45)
            },
            {
                type: 'period',
                period: 3,
                start: startTime(10, 55),
                end: startTime(11, 40)
            },
            {
                type: 'period',
                period: 4,
                start: startTime(11, 50),
                end: startTime(12, 35)
            },
            {
                type: 'break',
                break: 'lunch',
                start: startTime(12, 35),
                end: startTime(13, 5)
            },
            {
                type: 'period',
                period: 5,
                start: startTime(13, 15),
                end: startTime(14, 0)
            },
            {
                type: 'period',
                period: 6,
                start: startTime(14, 10),
                end: startTime(14, 55)
            },
            {
                type: 'period',
                period: 7,
                start: startTime(15, 5),
                end: startTime(15, 50)
            },
            {
                type: 'period',
                period: 8,
                start: startTime(16, 0),
                end: startTime(16, 45)
            }
        ]
    },
    tuesday: {
        day: 'tuesday',
        periods: [
            {
                type: 'period',
                period: 0,
                start: startTime(7, 55),
                end: startTime(8, 45)
            },
            {
                type: 'period',
                period: 1,
                start: startTime(9, 0),
                end: startTime(10, 35)
            },
            {
                type: 'break',
                break: 'brunch',
                start: startTime(10, 35),
                end: startTime(10, 40)
            },
            {
                type: 'period',
                period: 2,
                start: startTime(10, 50),
                end: startTime(12, 20)
            },
            {
                type: 'break',
                break: 'lunch',
                start: startTime(12, 20),
                end: startTime(12, 50)
            },
            {
                type: 'period',
                period: 3,
                start: startTime(13, 0),
                end: startTime(14, 30)
            },
            {
                type: 'period',
                period: 4,
                start: startTime(14, 40),
                end: startTime(16, 10)
            },
            {
                type: 'period',
                period: 8,
                start: startTime(16, 20),
                end: startTime(17, 50)
            }
        ]
    },
    wednessday: {
        day: 'wednessday',
        periods: [
            {
                type: 'period',
                period: 0,
                start: startTime(7, 55),
                end: startTime(8, 45)
            },
            {
                type: 'period',
                period: 5,
                start: startTime(9, 0),
                end: startTime(10, 35)
            },
            {
                type: 'break',
                break: 'brunch',
                start: startTime(10, 35),
                end: startTime(10, 40)
            },
            {
                type: 'period',
                period: 6,
                start: startTime(10, 50),
                end: startTime(12, 20)
            },
            {
                type: 'break',
                break: 'lunch',
                start: startTime(12, 20),
                end: startTime(12, 50)
            },
            {
                type: 'period',
                period: 7,
                start: startTime(13, 0),
                end: startTime(14, 30)
            },
            {
                type: 'active',
                active: 'prime',
                start: startTime(14, 40),
                end: startTime(15, 30)
            }
        ]
    },
    thursday: {
        day: 'thursday',
        periods: [
            {
                type: 'period',
                period: 0,
                start: startTime(7, 55),
                end: startTime(8, 45)
            },
            {
                type: 'period',
                period: 1,
                start: startTime(9, 0),
                end: startTime(10, 35)
            },
            {
                type: 'break',
                break: 'brunch',
                start: startTime(10, 35),
                end: startTime(10, 40)
            },
            {
                type: 'period',
                period: 2,
                start: startTime(10, 50),
                end: startTime(12, 20)
            },
            {
                type: 'break',
                break: 'lunch',
                start: startTime(12, 20),
                end: startTime(12, 50)
            },
            {
                type: 'period',
                period: 3,
                start: startTime(13, 0),
                end: startTime(14, 30)
            },
            {
                type: 'period',
                period: 4,
                start: startTime(14, 40),
                end: startTime(16, 10)
            },
            {
                type: 'period',
                period: 8,
                start: startTime(16, 20),
                end: startTime(17, 50)
            }
        ]
    },
    friday: {
        day: 'friday',
        periods: [
            {
                type: 'period',
                period: 5,
                start: startTime(9, 0),
                end: startTime(10, 35)
            },
            {
                type: 'break',
                break: 'brunch',
                start: startTime(10, 35),
                end: startTime(10, 40)
            },
            {
                type: 'period',
                period: 6,
                start: startTime(10, 50),
                end: startTime(12, 20)
            },
            {
                type: 'break',
                break: 'lunch',
                start: startTime(12, 20),
                end: startTime(12, 50)
            },
            {
                type: 'active',
                active: 'self',
                start: startTime(13, 0),
                end: startTime(13, 50)
            },
            {
                type: 'period',
                period: 7,
                start: startTime(14, 0),
                end: startTime(15, 30)
            }
        ]
    }
};

export const getPeriodKey = (period: ScheduleItem): string => {
    if (period.type === 'active') {
        return (
            'common.period.' +
            {
                'study-hall': 'studyHall',
                prime: 'prime',
                self: 'self'
            }[period.active]
        );
    } else if (period.type === 'break') {
        return 'common.period.' + period.break;
    } else {
        return 'common.period.' + period.period;
    }
};

export type Holidays = '';

export const getHolidayKey = (holiday: Holidays): string => {
    return 'common.holiday.' + holiday;
};
