import type { Component } from 'solid-js';
import { FmtProps, TranslationItem } from '../locales';
import { GroupBox } from './GroupBox';
import { ProgressBar } from './ProgressBar';
import { Icon } from 'solid-heroicons';
import { HeroIcon } from '../utils/icon';
import { getFormatedTimeLeft } from '../utils/time';

interface SchoolStatusProps {
    icon: () => HeroIcon;
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
                    <Icon path={icon()} class='h-8 w-8' />
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
