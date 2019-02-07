Vue.component('vf-link', {
    template:
        '<g>' +
        '    <path :d="d" stroke="#F85" stroke-width="2" fill="none" />' +
        '</g>',
    props: {
        id: String,
        sourceX: Number,
        sourceY: Number,
        targetX: Number,
        targetY: Number,
    }
});