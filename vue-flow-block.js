Vue.component('vf-block', {
    template:
        '<div class="vf-block" :style="style">' +
        '    <div class="vf-block-header">' +
        '        <div class="vf-block-tools">' +
        '            <button type="button" @click="$emit(\'block-delete\')">x</button>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    computed: {
        style: function () {
            return {top: this.y + 'px', left: this.x + 'px'};
        }
    },
    mounted: function () {
        document.documentElement.addEventListener('mousedown', this._onMouseDown = this.onMouseDown.bind(this), true);
        document.documentElement.addEventListener('mousemove', this._onMouseMove = this.onMouseMove.bind(this), true);
        document.documentElement.addEventListener('mouseup', this._onMouseUp = this.onMouseUp.bind(this), true);
    },
    beforeDestroy: function () {
        document.documentElement.removeEventListener('mousedown', this._onMouseDown, true);
        document.documentElement.removeEventListener('mousemove', this._onMouseMove, true);
        document.documentElement.removeEventListener('mouseup', this._onMouseUp, true);
    },
    methods: {
        onMouseDown: function (e) {
            //TODO save cursor position
            //TODO resolve dragging/linking
        },
        onMouseMove: function (e) {
            //TODO update position if dragging
            //TODO update target of link if linking
            //TODO emit update
        },
        onMouseUp: function (e) {
            //TODO reset state
        }
    }
});