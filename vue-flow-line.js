Vue.component('v-flow-line', {
    template:
        '<g class="v-flow-line">' +
        '    <path :d="d" stroke="#333" stroke-width="1" fill="none" />' +
        '    <a :transform="styles.deleteButton.transform" @click.prevent="$emit(\'linking-remove\')">' +
        '        <text text-anchor="middle" font-size="22">&times;</text>' +
        '    </a>' +
        '    <path d="M -1 -1 L 0 1 L 1 -1 z" stroke="#666" stroke-width="6" stroke-opacity="1" fill="none" :transform="styles.sourceArrow.transform" />' +
        '    <path d="M -1 -1 L 0 1 L 1 -1 z" stroke="#666" stroke-width="6" stroke-opacity="1" fill="none" :transform="styles.targetArrow.transform" />' +
        '</g>',
    props: {
        id:      String,
        sourceX: Number,
        sourceY: Number,
        targetX: Number,
        targetY: Number
    },
    computed: {
        d: function () {
            var sx = this.sourceX,
                sy = this.sourceY,
                tx = this.targetX,
                ty = this.targetY;

            var x1 = sx,
                y1 = sy/* + 50*/,
                x2 = tx,
                y2 = ty/* - 50*/;

            return 'M ' + sx + ', ' + sy + ' C ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + tx + ', ' + ty;
        },
        styles: function () {
            var radians  = -Math.atan2(this.targetX - this.sourceX, this.targetY - this.sourceY);
            var degrees  = radians * 180 / Math.PI;
            var distance = Math.sqrt(Math.pow(this.targetX - this.sourceX, 2) + Math.pow(this.targetY - this.sourceY, 2));
            //angle = angle < 0 ? angle + 360 : angle;

            var multiplierX = Math.abs(Math.sin(radians));
            var multiplierY = Math.abs(Math.cos(radians));

            var buttonPosition = {
                x: this.targetX - 16 * multiplierX,
                y: this.targetY - 16 * multiplierY
            };

            var sArrowPosition = {
                x: this.sourceX + 6 * multiplierX,
                y: this.sourceY + 6 * multiplierY
            };

            var tArrowPosition = {
                x: this.targetX - 6 * multiplierX,
                y: this.targetY - 6 * multiplierY
            };

            return {
                deleteButton: {
                    transform: 'translate(' + buttonPosition.x + ', ' + buttonPosition.y + ') rotate(' + degrees +')'
                },
                sourceArrow: {
                    transform: 'translate(' + sArrowPosition.x + ', ' + sArrowPosition.y + ') rotate(' + (degrees - 180) +')'
                },
                targetArrow: {
                    transform: 'translate(' + tArrowPosition.x + ', ' + tArrowPosition.y + ') rotate(' + degrees +')'
                }
            };
        },
        a: function () {
            // calculate arrow rotation
            var angle = -Math.atan2(this.targetX - this.sourceX, this.targetY - this.sourceY) * 180 / Math.PI;
            angle = angle < 0 ? angle + 360 : angle;

            return {
                transform: 'translate(' + this.targetX + ', ' + this.targetY + ') rotate(' + angle +')'
            };
        }
    }
});
