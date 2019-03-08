Vue.component('vf-block', {
    template:
        '<div class="vf-block" :class="{selected: selected}" :style="style">' +
        '    <div v-if="portsTop.length">' +
        '        <div style="display: table; margin: -5px auto 0">' +
        '            <div v-for="port in portsTop" style="display: table-cell" class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '        </div>' +
        '    </div>' +
        '    <div style="display: table; width: 100%">' +
        '    <div style="display: table-row">' +
        '        <div style="display: table-cell; outline: 1px solid red; width: 1px; margin-left: -5px">' +
        '            <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '            <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '            <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '        </div>' +
        '        <div style="display: table-cell; outline: 1px solid red;">' +
        '            <button type="button" @click="$emit(\'block-remove\')">x</button>' +
        '        </div>' +
        '        <div style="display: table-cell; outline: 1px solid red; width: 1px; margin-right: -5px">' +
        '            <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '            <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '            <div class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '        </div>' +
        '    </div>' +
        '    </div>' +
        '    <div>' +
        '        <div style="display: table; margin: 0 auto -5px">' +
        '            <div style="display: table-cell" class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '            <div style="display: table-cell" class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '            <div style="display: table-cell" class="vf-port" @mousedown="onPortMouseDown($event)" @mouseup="onPortMouseUp($event)"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    props: {
        x: Number,
        y: Number,
        selected: Boolean
    },
    data: function () {
        return {
            ports: [
                {id: 'p-1', group: 'top'},
                {id: 'p-2', group: 'top'},
                {id: 'p-3', group: 'top'},
                {id: 'p-4', group: 'left'},
                {id: 'p-5', group: 'left'},
                {id: 'p-6', group: 'left'},
                {id: 'p-7', group: 'bottom'},
                {id: 'p-8', group: 'bottom'},
                {id: 'p-9', group: 'bottom'},
                {id: 'p-10', group: 'right'},
                {id: 'p-11', group: 'right'},
                {id: 'p-12', group: 'right'},
            ]
        };
    },
    computed: {
        style: function () {
            return {top: this.y + 'px', left: this.x + 'px'};
        },
        portsTop: function () {
            return this.ports.filter(function (port) {
                return port.group === 'top';
            })
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
        getPorts: function (group) {
            if (group) {
                return this.ports.filter(function (port) {
                    return port.group === group;
                })
            }

            return this.ports;
        },
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
            this.$emit('linking-start', e);
            if (e.preventDefault) e.preventDefault();
        },
        onPortMouseUp: function (e) {
            this.$emit('linking-stop', e);
            if (e.preventDefault) e.preventDefault();
        },
    }
});
