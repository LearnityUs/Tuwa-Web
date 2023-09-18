const decideTextColour = (color: { r: number; g: number; b: number }) => {
    // Using luminance formula to decide if we should use white or black text
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const rRange = color.r / 255;
    const gRange = color.g / 255;
    const bRange = color.b / 255;

    const rSRGB = rRange <= 0.03928 ? rRange / 12.92 : ((rRange + 0.055) / 1.055) ^ 2.4;
    const gSRGB = gRange <= 0.03928 ? gRange / 12.92 : ((gRange + 0.055) / 1.055) ^ 2.4;
    const bSRGB = bRange <= 0.03928 ? bRange / 12.92 : ((bRange + 0.055) / 1.055) ^ 2.4;

    const luminance = 0.2126 * rSRGB + 0.7152 * gSRGB + 0.0722 * bSRGB;

    return luminance > 0.179 ? '#000' : '#fff';
};

export const generateFavicon = async (
    color: {
        r: number;
        g: number;
        b: number;
    },
    number: number,
    size: number
): Promise<Blob> => {
    // Convert color to RGB
    const useDarkText = decideTextColour(color);

    // Create a canvas element
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');

    if (!ctx) return new Blob();

    // Draw background
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.fillRect(0, 0, size, size);

    // Draw text
    ctx.fillStyle = useDarkText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${
        size * 0.75
    }px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    ctx.fillStyle = useDarkText;
    ctx.fillText(number.toString(), size / 2, size / 2);

    return canvas.convertToBlob({ type: 'image/png' });
};
