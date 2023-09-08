import { onMount, type Component, onCleanup } from 'solid-js';

class GameOfLifeLogic {
    private width: number;
    private height: number;
    private grid: boolean[];
    private curve = 0.5;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = new Array(width * height).fill(false);
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getGrid(): readonly boolean[] {
        return this.grid;
    }

    public setPoint(x: number, y: number, value: boolean): void {
        this.grid[y * this.width + x] = value;
    }

    public async resize(width: number, height: number): Promise<void> {
        // Resize the grid (deletes or adds rows/columns)

        const newGrid = [...this.grid];

        // Because the grid is a 1D array, we need to calculate how many we need to add/remove
        // for the width
        // Ex: 2x2 -> 3x3 grid (00x)(00x)
        const widthDiff = width - this.width;
        for (let i = 0; i < this.height; i++) {
            const lastIdx = i * width - 1;
            // 0..1.2
            // 2.3...5
            if (widthDiff > 0) {
                // Add columns
                const row = new Array(widthDiff);
                for (let j = 0; j < widthDiff; j++) {
                    row[j] = Math.random() > this.curve;
                }
                // Insert the row at the end of the current row
                newGrid.splice(lastIdx + this.width, 0, ...row);
            } else if (widthDiff < 0) {
                // Remove columns
                newGrid.splice(lastIdx + widthDiff, Math.abs(widthDiff));
            }
        }

        // The height is easier because we can just add/remove rows
        const heightDiff = height - this.height;
        if (heightDiff > 0) {
            // Add rows
            newGrid.push(
                ...new Array(width * heightDiff).fill(false).map(() => Math.random() > this.curve)
            );
        } else if (heightDiff < 0) {
            // Remove rows
            newGrid.splice(width * height, Math.abs(width * heightDiff));
        }

        this.width = width;
        this.height = height;

        this.grid = newGrid;
    }

    private getNeighbors(x: number, y: number): number {
        // Looks ugly but is fast
        let neighbors = 0;

        const topRowExists = y > 0;
        const bottomRowExists = y < this.height - 1;
        const leftColumnExists = x > 0;
        const rightColumnExists = x < this.width - 1;

        if (topRowExists) {
            neighbors += (leftColumnExists &&
                (this.grid[(y - 1) * this.width + (x - 1)] as unknown as number)) as number;
            neighbors += this.grid[(y - 1) * this.width + x] as unknown as number;
            neighbors += (rightColumnExists &&
                (this.grid[(y - 1) * this.width + (x + 1)] as unknown as number)) as number;
        }

        neighbors += (leftColumnExists &&
            (this.grid[y * this.width + (x - 1)] as unknown as number)) as number;
        neighbors += (rightColumnExists &&
            (this.grid[y * this.width + (x + 1)] as unknown as number)) as number;

        if (bottomRowExists) {
            neighbors += (leftColumnExists &&
                (this.grid[(y + 1) * this.width + (x - 1)] as unknown as number)) as number;
            neighbors += this.grid[(y + 1) * this.width + x] as unknown as number;
            neighbors += (rightColumnExists &&
                (this.grid[(y + 1) * this.width + (x + 1)] as unknown as number)) as number;
        }

        return neighbors;
    }

    public step(): void {
        // Step the simulation forward one generation
        const newGrid = new Array(this.width * this.height).fill(false);

        for (let i = 0; i < this.grid.length; i++) {
            const x = i % this.width;
            const y = Math.floor(i / this.width);
            const neighbors = this.getNeighbors(x, y);

            if (this.grid[i]) {
                // Alive
                if (neighbors < 2 || neighbors > 3) {
                    // Dies
                    newGrid[i] = false;
                } else {
                    // Lives
                    newGrid[i] = true;
                }
            } else {
                // Dead
                if (neighbors === 3) {
                    // Lives
                    newGrid[i] = true;
                } else {
                    // Stays dead
                    newGrid[i] = false;
                }
            }
        }

        this.grid = newGrid;
    }
}

export const Background: Component = () => {
    const cellSize = 20;
    let canvas: HTMLCanvasElement | undefined;
    let gol = new GameOfLifeLogic(0, 0);
    let animFrame: number | undefined;

    const draw = () => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const width = (canvas?.width ?? 0) * 2;
        const height = (canvas?.height ?? 0) * 2;

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Calc offset
        const offsetX = (width - gol.getWidth() * cellSize) / 2;
        const offsetY = (height - gol.getHeight() * cellSize) / 2;

        // Draw the grid
        ctx.fillStyle = '#1f293750';
        const grid = gol.getGrid();
        for (let i = 0; i < grid.length; i++) {
            const x = i % gol.getWidth();
            const y = Math.floor(i / gol.getWidth());

            if (!grid[i]) continue;

            ctx?.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }

        animFrame = undefined;
    };

    const mouseEvent = (e: MouseEvent | TouchEvent) => {
        const width = (canvas?.width ?? 0) * 2;
        const height = (canvas?.height ?? 0) * 2;

        // Calc offset
        const offsetX = (width - gol.getWidth() * cellSize) / 2;
        const offsetY = (height - gol.getHeight() * cellSize) / 2;

        // Get the mouse position and convert it to grid coordinates
        if (e instanceof MouseEvent) {
            const x = Math.floor((e.clientX - offsetX) / cellSize);
            const y = Math.floor((e.clientY - offsetY) / cellSize);

            gol.setPoint(x, y, true);
            return;
        }

        for (const touch of e.changedTouches) {
            const x = Math.floor((touch.clientX - offsetX) / cellSize);
            const y = Math.floor((touch.clientY - offsetY) / cellSize);

            gol.setPoint(x, y, true);
        }
    };

    const resize = () => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        // Get canvas size
        const width = canvas?.clientWidth ?? 0;
        const height = canvas?.clientHeight ?? 0;

        const calcWidth = Math.ceil((width * 2) / cellSize);
        const calcHeight = Math.ceil((height * 2) / cellSize);

        if (gol.getWidth() !== calcWidth || gol.getHeight() !== calcHeight) {
            // Resize the grid
            gol.resize(calcWidth, calcHeight);
        }

        // Set canvas size
        canvas!.width = width;
        canvas!.height = height;

        animFrame = requestAnimationFrame(draw);
    };

    onMount(() => {
        resize();

        const stepFrame = setInterval(() => {
            gol.step();
            if (!animFrame) animFrame = requestAnimationFrame(draw);
        }, 100);

        // Resize canvas
        const resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(animFrame!);
            animFrame = 1;
            resize();
        });

        resizeObserver.observe(canvas!);
        window.addEventListener('mousemove', mouseEvent);
        window.addEventListener('mousedown', mouseEvent);
        window.addEventListener('touchmove', mouseEvent);
        window.addEventListener('touchstart', mouseEvent);

        onCleanup(() => {
            resizeObserver.disconnect();
            clearInterval(stepFrame);
            cancelAnimationFrame(animFrame!);
            window.removeEventListener('mousemove', mouseEvent);
            window.removeEventListener('mousedown', mouseEvent);
            window.removeEventListener('touchmove', mouseEvent);
            window.removeEventListener('touchstart', mouseEvent);
        });
    });

    return (
        <canvas
            ref={canvas}
            class='fixed left-0 top-0 -z-10 h-screen w-screen'
            aria-hidden={true}
        />
    );
};
