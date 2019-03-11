Vue.component('vf-block', {
    template:
        '<div class="vf-block" :class="{selected: selected}" :style="style" @mousedown="$emit(\'block-select\');">' +
        '    <div v-if="_ports.top.length">' +
        '        <div style="display: table; margin: -5px auto 0">' +
        '            <div ref="ports" v-for="port in _ports.top"' +
        '                 style="display: table-cell"' +
        '                 class="vf-port"' +
        '                 @mousedown="onPortMouseDown($event, id, port)"' +
        '                 @mouseup="onPortMouseUp($event, id, port)"></div>' +
        '        </div>' +
        '    </div>' +
        '    <div style="display: table; width: 100%">' +
        '    <div style="display: table-row">' +
        '        <div v-if="_ports.left.length" style="display: table-cell; outline: 1px solid red; width: 1px; margin-left: -5px">' +
        '            <div ref="ports" v-for="port in _ports.left"' +
        '                 class="vf-port"' +
        '                 @mousedown="onPortMouseDown($event, id, port)"' +
        '                 @mouseup="onPortMouseUp($event, id, port)"></div>' +
        '        </div>' +
        '        <div style="display: table-cell; outline: 1px solid red;">' +
        '            <button type="button" @click="$emit(\'block-remove\')">x</button>' +
        '        </div>' +
        '        <div v-if="_ports.right.length" style="display: table-cell; outline: 1px solid red; width: 1px; margin-right: -5px">' +
        '            <div ref="ports" v-for="port in _ports.right"' +
        '                 class="vf-port"' +
        '                 @mousedown="onPortMouseDown($event, id, port)"' +
        '                 @mouseup="onPortMouseUp($event, id, port)"></div>' +
        '        </div>' +
        '    </div>' +
        '    </div>' +
        '    <div v-if="_ports.bottom.length">' +
        '        <div style="display: table; margin: 0 auto -5px">' +
        '            <div ref="ports" v-for="port in _ports.bottom"' +
        '                 style="display: table-cell"' +
        '                 class="vf-port"' +
        '                 @mousedown="onPortMouseDown($event, id, port)"' +
        '                 @mouseup="onPortMouseUp($event, id, port)"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    props: {
        id: String,
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
        _ports: function () {
            return {
                top: this.ports.filter(function (port) {
                    return port.group === 'top';
                }),
                right: this.ports.filter(function (port) {
                    return port.group === 'right';
                }),
                bottom: this.ports.filter(function (port) {
                    return port.group === 'bottom';
                }),
                left: this.ports.filter(function (port) {
                    return port.group === 'left';
                })
            };
        },
    },
    methods: {
        onPortMouseDown: function (e, id, port) {
            this.$emit('linking-start', e, id, port);
            if (e.preventDefault) e.preventDefault();
        },
        onPortMouseUp: function (e, id, port) {
            this.$emit('linking-stop', e, id, port);
            if (e.preventDefault) e.preventDefault();
        },
    }
});
