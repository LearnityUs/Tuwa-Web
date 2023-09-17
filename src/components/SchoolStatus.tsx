import type { Component } from 'solid-js';
import { FmtProps, TranslationItem } from '../locales';
import { GroupBox } from './GroupBox';
import { ProgressBar } from './ProgressBar';
import { getFormatedTimeLeft } from '../utils/time';
import { icons } from 'lucide-solid';
import { Icon } from '../utils/icon';

interface SchoolStatusProps {
    icon: () => keyof typeof icons;
    title: () => FmtProps;
    subtitle: () => FmtProps | undefined;
    progress: () => number | undefined;
    periodEndsIn: () => number | undefined;
}

export const SchoolStatus: Component<SchoolStatusProps> = ({
    icon,
    title,
    subtitle,
    progress,
    periodEndsIn
}) => {
    return (
        <GroupBox>
            <div class={'flex items-start gap-4 ' + (subtitle() || 'items-center')}>
                <div class='flex h-12 w-12 items-center justify-center rounded-full bg-theme-700 p-2'>
                    <Icon class='h-8 w-8' name={icon()} />
                </div>
                <div class='flex w-full flex-col gap-4'>
                    <div class='flex flex-col gap-1'>
                        <h2 class='text-3xl font-bold'>
                            <TranslationItem {...title()} />
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
                                value={() => progress() ?? 0}
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
