Vue.component('vf-link', {
    template:
        '<g>' +
        '    <path :d="d" stroke="#333" stroke-width="1" fill="none" />' +
        '    <path d="M -1 -1 L 0 1 L 1 -1 z" stroke="#666" stroke-width="6" stroke-opacity="1" fill="none" :transform="a.transform" />' +
        '</g>',
    props: {
        id: String,
        sourceX: Number,
        sourceY: Number,
        targetX: Number,
        targetY: Number,
        angle: {type: Number, default: -90}
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
        a: function () {
            return {
                transform: 'translate(' + this.targetX + ', ' + this.targetY + ') rotate(' + this.angle +')'
            };
        }
    }
});
