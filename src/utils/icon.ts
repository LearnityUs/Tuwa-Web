import { SVGAttributes } from 'lucide-solid/dist/types/types';
import { icons } from 'lucide-solid';
import { type Component, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

interface AvaliableIcon {
    key: string;
    icon: keyof typeof icons;
}

export const availableIcons: Record<string, AvaliableIcon> = {
    graduationCap: {
        key: 'common.icons.graduationCap',
        icon: 'GraduationCap'
    }
};

export const iconKeys: (keyof typeof availableIcons)[] = Object.keys(
    availableIcons
) as (keyof typeof availableIcons)[];

export interface LucideProps extends SVGAttributes {
    key?: string | number;
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    class?: string;
    absoluteStrokeWidth?: boolean;
}

interface IconProps extends LucideProps {
    name: keyof typeof icons;
}

export const Icon: Component<IconProps> = (props: IconProps) => {
    const [local, others] = splitProps(props, ['name']);

    return Dynamic({
        component: icons[local.name],
        ...others
    });
};
