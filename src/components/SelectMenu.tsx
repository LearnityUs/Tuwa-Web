import { createSignal, type Component, type JSX, createEffect, onMount, onCleanup } from 'solid-js';
import { Icon } from '../utils/icon';
import { Button } from './Button';

interface SelectMenuProps {
    options: () => {
        key: string;
        element: JSX.Element;
    }[];
    disabled: () => boolean;
    selected: () => string;
    onChange: (value: string) => void;
}

export const SelectMenu: Component<SelectMenuProps> = ({
    options,
    disabled,
    selected,
    onChange
}) => {
    let element: HTMLDivElement | null = null;
    const [isOpen, setIsOpen] = createSignal(false);
    const [animateIn, setAnimateIn] = createSignal(false);

    createEffect(() => {
        if (isOpen() && disabled()) {
            setIsOpen(false);
        }
    });

    const animateState = (to: boolean) => {
        if (to) {
            setIsOpen(true);
            setTimeout(() => {
                setAnimateIn(true);
            }, 100);
        } else {
            setAnimateIn(false);
            setTimeout(() => {
                setIsOpen(false);
            }, 200);
        }
    };

    // Clicking outside of the menu should close it
    onMount(() => {
        const handler = (e: MouseEvent) => {
            if (!element) return;
            if (isOpen() && !e.composedPath().includes(element)) {
                animateState(false);
            }
        };

        document.addEventListener('click', handler);

        onCleanup(() => {
            document.removeEventListener('click', handler);
        });
    });

    return (
        <div
            ref={e => {
                element = e;
            }}
            class='relative'
        >
            <Button
                style='secondary'
                state={() => (disabled() ? 'disabled' : isOpen() ? 'selected' : 'default')}
                onClick={() => {
                    animateState(!isOpen());
                }}
            >
                {options().find(o => o.key === selected())?.element}
                <Icon class='h-4 w-4' name={() => 'ChevronDown'} />
            </Button>
            {isOpen() && (
                <div
                    class={
                        'absolute right-0 z-10 mt-4 max-h-64 w-48 min-w-[8rem] flex-col overflow-x-hidden overflow-y-scroll rounded-lg bg-milk-200 py-1 shadow-lg transition-all dark:bg-rice-800 md:min-w-[16rem] ' +
                        (animateIn() ? 'flex scale-100' : 'pointer-events-none scale-95 opacity-0')
                    }
                >
                    {options().map(o => (
                        <Button
                            style='bordered'
                            class='w-full !rounded-none'
                            onClick={() => {
                                animateState(false);
                                onChange(o.key);
                            }}
                        >
                            {o.element}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};
