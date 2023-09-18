import { SVGAttributes } from 'lucide-solid/dist/types/types';
import { icons } from 'lucide-solid';
import { type Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
export const availableIcons: Partial<Record<keyof typeof icons, string>> = {
    GraduationCap: 'icons.graduationCap'
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
    name: () => keyof typeof icons;
}

export const Icon: Component<IconProps> = (props: IconProps) => {
    return <Dynamic component={icons[props.name()]} {...props} />;
};
