import { createSignal, type Component, type JSX } from 'solid-js';
import { Icon } from '../utils/icon';

interface SelectMenuProps {
    options: () => {
        key: string;
        element: JSX.Element;
    }[];

    selected: () => string;
    onChange: (value: string) => void;
}

export const SelectMenu: Component<SelectMenuProps> = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = createSignal(false);

    return (
        <div>
            <button
                class='flex w-fit min-w-[16rem] cursor-pointer flex-row items-center gap-2 rounded-lg bg-gray-800 p-2 px-4 py-2 shadow-md ring-1 ring-gray-700/60 transition-colors hover:bg-gray-700 active:bg-gray-600'
                onClick={() => setIsOpen(!isOpen())}
            >
                {options().find(o => o.key === selected())?.element}
                <div class='flex flex-grow' />
                <Icon class='h-4 w-4' name='ChevronDown' />
            </button>
            <div
                class={
                    'absolute mt-4 max-h-64 min-w-[16rem] origin-top-left flex-col overflow-x-hidden overflow-y-scroll rounded-lg bg-gray-800 py-1 ring-1 ring-gray-700/60 transition-all ' +
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
