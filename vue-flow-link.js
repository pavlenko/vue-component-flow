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
            var dist = VueFlow.utils.distance(this.sourceX, this.sourceY, this.targetX, this.targetY) * 0.25;

            return 'M ' + this.sourceX + ', '
                //+ this.sourceY + ' C ' + (this.sourceX + dist) + ', '
                + this.sourceY + ', '
                + (this.targetX - dist) + ', '
                + this.targetY + ', '
                + this.targetX + ', '
                + this.targetY;
        },
        a: function () {
            return {
                transform: 'translate(' + this.targetX + ', ' + this.targetY + ') rotate(' + this.angle +')'
            };
        }
    }
});