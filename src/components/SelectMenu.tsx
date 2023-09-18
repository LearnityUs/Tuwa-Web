import { createSignal, type Component, type JSX, createEffect, onMount, onCleanup } from 'solid-js';
import { Icon } from '../utils/icon';

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

    createEffect(() => {
        if (isOpen() && disabled()) {
            setIsOpen(false);
        }
    });

    // Clicking outside of the menu should close it
    onMount(() => {
        const handler = (e: MouseEvent) => {
            if (!element) return;
            if (isOpen() && !e.composedPath().includes(element)) {
                setIsOpen(false);
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
        >
            <button
                class={
                    'flex w-fit min-w-[16rem] cursor-pointer flex-row items-center gap-2 rounded-lg bg-gray-800 p-2 px-4 py-2 shadow-md ring-1 ring-gray-700/60 transition-colors hover:bg-gray-700 active:bg-gray-600 ' +
                    (disabled() &&
                        '!cursor-not-allowed !bg-gray-800/60 !text-gray-300 !shadow-none !outline-none !ring-0')
                }
                onClick={() => setIsOpen(disabled() ? false : !isOpen())}
            >
                {options().find(o => o.key === selected())?.element}
                <div class='flex flex-grow' />
                <Icon class='h-4 w-4' name={() => 'ChevronDown'} />
            </button>
            <div
                class={
                    'absolute z-10 mt-4 max-h-64 min-w-[16rem] origin-top-left flex-col overflow-x-hidden overflow-y-scroll rounded-lg bg-gray-800 py-1 ring-1 ring-gray-700/60 transition-all ' +
                    (isOpen() ? 'flex scale-100' : 'pointer-events-none scale-95 opacity-0')
                }
            >
                {options().map(o => (
                    <button
                        class='flex w-full cursor-pointer flex-row items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600'
                        onClick={() => {
                            setIsOpen(false);
                            onChange(o.key);
                        }}
                    >
                        {o.element}
                    </button>
                ))}
            </div>
        </div>
    );
};
