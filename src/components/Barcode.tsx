import { type Component, onMount, createEffect } from 'solid-js';

const BARCODE_CHARS = {
    '0': 349,
    '1': 581,
    '2': 419,
    '3': 661,
    '4': 347,
    '5': 589,
    '6': 427,
    '7': 341,
    '8': 583,
    '9': 421,
    '*': 295
};

interface BarcodeProps {
    value: () => string;
    height: number;
}

export const Barcode: Component<BarcodeProps> = ({ value, height }) => {
    let canvas: HTMLCanvasElement | undefined;

    const draw = (value: string) => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const drawHeight = height;

        const data = value
            .normalize('NFC')
            .split('')
            .filter(c => c in BARCODE_CHARS)
            .map(c => BARCODE_CHARS[c as keyof typeof BARCODE_CHARS].toString(3));

        // Clear the canvas
        ctx.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

        // Set the canvas width
        canvas!.width = data.length * 16 - 1;

        // Draw the barcode
        ctx.fillStyle = '#000';
        let offset = 0;
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            for (let j = 0; j < d.length; j++) {
                if (d[j] === '2') {
                    ctx.fillRect(offset, 0, 3, drawHeight);
                    offset += 4;
                } else {
                    if (d[j] === '1') {
                        ctx.fillRect(offset, 0, 1, drawHeight);
                    }
                    offset += 2;
                }
            }
        }
    };

    onMount(() => {
        draw(value());
    });

    createEffect(() => {
        draw(value());
    });

    return (
        <canvas
            ref={canvas}
            height={height}
            class='w-full'
            style={{
                'image-rendering': 'pixelated'
            }}
            aria-label={value()}
        />
    );
};
