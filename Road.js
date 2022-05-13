class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;

        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 10000000; // don't set too high, otherwise the dashes don't work
        this.top = -infinity;
        this.bottom = infinity;
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 0; i <= this.laneCount; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount);

            ctx.beginPath();

            if (i > 0 && i < this.laneCount) {
                ctx.setLineDash([20, 20]);
            } else {
                ctx.setLineDash([]);
            }

            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();


        }
    }
}
