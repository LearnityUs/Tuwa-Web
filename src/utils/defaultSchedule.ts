import { DayScheduleStandardWeekend, DayScheduleStandardSchool } from './schedule';
import { AllDays, getSecMidTime } from './time';

/// Default schedules
export const schedules: Record<AllDays, DayScheduleStandardSchool | DayScheduleStandardWeekend> = {
    sunday: {
        type: 'standardWeekend',
        day: 'sunday',
        hasSchool: false
    },
    monday: {
        type: 'standardSchool',
        day: 'monday',
        hasSchool: true,
        periods: [
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 0,
                start: getSecMidTime(7, 55),
                end: getSecMidTime(8, 45)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 1,
                start: getSecMidTime(9, 0),
                end: getSecMidTime(9, 45)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 2,
                start: getSecMidTime(9, 55),
                end: getSecMidTime(10, 40)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'brunch',
                start: getSecMidTime(10, 40),
                end: getSecMidTime(10, 45)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 3,
                start: getSecMidTime(10, 55),
                end: getSecMidTime(11, 40)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 4,
                start: getSecMidTime(11, 50),
                end: getSecMidTime(12, 35)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'lunch',
                start: getSecMidTime(12, 35),
                end: getSecMidTime(13, 5)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 5,
                start: getSecMidTime(13, 15),
                end: getSecMidTime(14, 0)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 6,
                start: getSecMidTime(14, 10),
                end: getSecMidTime(14, 55)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 7,
                start: getSecMidTime(15, 5),
                end: getSecMidTime(15, 50)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 8,
                start: getSecMidTime(16, 0),
                end: getSecMidTime(16, 45)
            }
        ]
    },
    tuesday: {
        type: 'standardSchool',
        day: 'tuesday',
        hasSchool: true,
        periods: [
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 0,
                start: getSecMidTime(7, 55),
                end: getSecMidTime(8, 45)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 1,
                start: getSecMidTime(9, 0),
                end: getSecMidTime(10, 35)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'brunch',
                start: getSecMidTime(10, 35),
                end: getSecMidTime(10, 40)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 2,
                start: getSecMidTime(10, 50),
                end: getSecMidTime(12, 20)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'lunch',
                start: getSecMidTime(12, 20),
                end: getSecMidTime(12, 50)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 3,
                start: getSecMidTime(13, 0),
                end: getSecMidTime(14, 30)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 4,
                start: getSecMidTime(14, 40),
                end: getSecMidTime(16, 10)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 8,
                start: getSecMidTime(16, 20),
                end: getSecMidTime(17, 50)
            }
        ]
    },
    wednesday: {
        type: 'standardSchool',
        day: 'wednesday',
        hasSchool: true,
        periods: [
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 0,
                start: getSecMidTime(7, 55),
                end: getSecMidTime(8, 45)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 5,
                start: getSecMidTime(9, 0),
                end: getSecMidTime(10, 35)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'brunch',
                start: getSecMidTime(10, 35),
                end: getSecMidTime(10, 40)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 6,
                start: getSecMidTime(10, 50),
                end: getSecMidTime(12, 20)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'lunch',
                start: getSecMidTime(12, 20),
                end: getSecMidTime(12, 50)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 7,
                start: getSecMidTime(13, 0),
                end: getSecMidTime(14, 30)
            },
            {
                type: 'active',
                grades: ['9', '10', '11', '12', 'educator'],
                active: 'prime',
                start: getSecMidTime(14, 40),
                end: getSecMidTime(15, 30)
            }
        ]
    },
    thursday: {
        type: 'standardSchool',
        day: 'thursday',
        hasSchool: true,
        periods: [
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 0,
                start: getSecMidTime(7, 55),
                end: getSecMidTime(8, 45)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 1,
                start: getSecMidTime(9, 0),
                end: getSecMidTime(10, 35)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'brunch',
                start: getSecMidTime(10, 35),
                end: getSecMidTime(10, 40)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 2,
                start: getSecMidTime(10, 50),
                end: getSecMidTime(12, 20)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'lunch',
                start: getSecMidTime(12, 20),
                end: getSecMidTime(12, 50)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 3,
                start: getSecMidTime(13, 0),
                end: getSecMidTime(14, 30)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 4,
                start: getSecMidTime(14, 40),
                end: getSecMidTime(16, 10)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 8,
                start: getSecMidTime(16, 20),
                end: getSecMidTime(17, 50)
            }
        ]
    },
    friday: {
        type: 'standardSchool',
        day: 'friday',
        hasSchool: true,
        periods: [
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 5,
                start: getSecMidTime(9, 0),
                end: getSecMidTime(10, 35)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'brunch',
                start: getSecMidTime(10, 35),
                end: getSecMidTime(10, 40)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 6,
                start: getSecMidTime(10, 50),
                end: getSecMidTime(12, 20)
            },
            {
                type: 'break',
                grades: ['9', '10', '11', '12', 'educator'],
                break: 'lunch',
                start: getSecMidTime(12, 20),
                end: getSecMidTime(12, 50)
            },
            {
                type: 'active',
                grades: ['9', '10', '11', '12', 'educator'],
                active: 'self',
                start: getSecMidTime(13, 0),
                end: getSecMidTime(13, 50)
            },
            {
                type: 'period',
                grades: ['9', '10', '11', '12', 'educator'],
                period: 7,
                start: getSecMidTime(14, 0),
                end: getSecMidTime(15, 30)
            }
        ]
    },
    saturday: {
        type: 'standardWeekend',
        day: 'saturday',
        hasSchool: false
    }
};
