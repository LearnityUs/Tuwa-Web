import type { Component } from 'solid-js';
import { Icon } from '../utils/icon';
import { FmtProps, flattenFmt } from '../locales';
import { Button } from './Button';

interface TickBoxProps {
    value: () => boolean;
    disabled: () => boolean;
    onChange: (data: boolean, preventDefault: () => void) => void;
    label: FmtProps;
}

export const TickBox: Component<TickBoxProps> = ({ value, disabled, onChange, label }) => {
    return (
        <Button
            class='h-6 w-6 !rounded !p-0'
            style='secondary'
            isIcon={true}
            state={() => (value() ? 'selected' : 'default')}
            role='checkbox'
            propData={{
                'aria-checked': value(),
                'aria-label': flattenFmt(label)
            }}
            onClick={e => {
                if (disabled()) return;
                onChange(!value(), () => {
                    e();
                });
            }}
        >
            <div
                class={
                    'flex h-full w-full origin-center scale-50 items-center justify-center rounded bg-theme-500 p-1 opacity-0 transition-all dark:bg-themedark-700 ' +
                    (value() && '!scale-100 !opacity-100')
                }
            >
                <Icon name={() => 'Check'} class='text-white' />
            </div>
        </Button>
    );
};
