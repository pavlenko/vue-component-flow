Vue.component('vf-block', {
    template:
        '<div class="vf-block" :class="{selected: selected}" :style="style" @mousedown="$emit(\'block-select\');">' +
        '    <div v-if="_ports.top.length">' +
        '        <div style="display: table; margin: -5px auto 0">' +
        '            <div v-for="port in _ports.top" :key="port.id" style="display: table-cell">' +
        '                <v-flow-port ref="ports"' +
        '                             v-bind.sync="port"' +
        '                             @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                             @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div style=" margin: 0 -5px;">' +
        '        <div style="display: table; width: 100%;">' +
        '            <div class="v-flow-block-ports-vertical" v-if="_ports.left.length">' +
        '                <div v-for="port in _ports.left" :key="port.id">' +
        '                    <v-flow-port ref="ports"' +
        '                                 v-bind.sync="port"' +
        '                                 @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                                 @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
        '                </div>' +
        '            </div>' +
        '            <div class="v-flow-block-content">' +
        '                <button type="button" @click="$emit(\'block-remove\')">x</button>' +
        '            </div>' +
        '            <div class="v-flow-block-ports-vertical" v-if="_ports.right.length">' +
        '                <div v-for="port in _ports.right" :key="port.id">' +
        '                    <v-flow-port ref="ports"' +
        '                                 v-bind.sync="port"' +
        '                                 @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                                 @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div v-if="_ports.bottom.length">' +
        '        <div style="display: table; margin: 0 auto -5px">' +
        '            <div v-for="port in _ports.bottom" :key="port.id" style="display: table-cell">' +
        '                <v-flow-port ref="ports"' +
        '                             v-bind.sync="port"' +
        '                             @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                             @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    props: {
        id: String,
        x: Number,
        y: Number,
        selected: Boolean,
        ports: {type: Object, default: function () { return []; }}
    },
    components: {
        'v-flow-port': {
            template:
                '<div :class="\'v-flow-port v-flow-port-\' + edge" @mousedown="$emit(\'port-mouse-down\', $event)" @mouseup="$emit(\'port-mouse-up\', $event)" />',
            props: {
                id:   {type: String, required: true},
                edge: {type: String, required: true},
                type: {type: String, required: true}
            }
        },
    },
    computed: {
        style: function () {
            return {top: this.y + 'px', left: this.x + 'px'};
        },
        _ports: function () {
            return {
                top: this.ports.filter(function (port) {
                    return port.edge === 'top';
                }),
                right: this.ports.filter(function (port) {
                    return port.edge === 'right';
                }),
                bottom: this.ports.filter(function (port) {
                    return port.edge === 'bottom';
                }),
                left: this.ports.filter(function (port) {
                    return port.edge === 'left';
                })
            };
        },
    },
    methods: {
        onPortMouseDown: function (e, id, portID) {
            this.$emit('linking-start', e, id, portID);
            if (e.preventDefault) e.preventDefault();
        },
        onPortMouseUp: function (e, id, portID) {
            this.$emit('linking-stop', e, id, portID);
            if (e.preventDefault) e.preventDefault();
        },
        portSearch: function (portID) {
            return this.$refs.ports ? this.$refs.ports.find(function (port) { return port.id === portID; }) : null;
        },
        portInsert: function (edge, type) {
            this.ports.push({
                id:   VueFlow.utils.generateUUID(),
                edge: edge,
                type: type
            });
        }
    }
});
