Vue.component('vf-block', {
    template:
        '<div class="vf-block" :style="style">' +
        '    <div class="vf-block-header">' +
        '        <div class="vf-block-tools">' +
        '            <button type="button" @click="$emit(\'block-remove\')">x</button>' +
        '        </div>' +
        '    </div>' +
        '    <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '</div>',
    props: {
        x: Number,
        y: Number
    },
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
            var rect = VueFlow.utils.getElementPosition(this.$el);
            var pos  = VueFlow.utils.getCursorPosition(e);

            this.cursorOffsetX = pos.x - rect.x;
            this.cursorOffsetY = pos.y - rect.y;

            if (this.$el.contains(e.target || e.srcElement) && e.which === 1) {
                this.dragging = true;

                this.$emit('block-select');

                if (e.preventDefault) e.preventDefault();
            }
        },
        onMouseMove: function (e) {
            var rect = VueFlow.utils.getElementPosition(this.$parent.$el);
            var pos  = VueFlow.utils.getCursorPosition(e);

            if (this.dragging && !this.linking) {
                var newX = VueFlow.utils.snapTo(pos.x - rect.x - this.cursorOffsetX, this.$parent.gridSize);
                var newY = VueFlow.utils.snapTo(pos.y - rect.y - this.cursorOffsetY, this.$parent.gridSize);

                this.$emit('update:x', newX);
                this.$emit('update:y', newY);

                this.hasDragged = true;
            }
        },
        onMouseUp: function (e) {
            if (this.dragging) {
                this.dragging = false;

                if (this.hasDragged) {
                    this.$emit('update');
                    this.hasDragged = false
                }
            }

            if (this.linking) {
                this.linking = false
            }
        },
        onPortMouseDown: function (e) {
            this.linking = true;
            this.$emit('linking-start');
            if (e.preventDefault) e.preventDefault();
        },
        onPortMouseUp: function (e) {
            this.$emit('linking-stop');
            if (e.preventDefault) e.preventDefault();
        },
    }
});