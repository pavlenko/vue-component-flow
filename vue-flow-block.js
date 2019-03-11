Vue.component('vf-block', {
    template:
        '<div class="vf-block" :class="{selected: selected}" :style="style" @mousedown="$emit(\'block-select\');">' +
        '    <div v-if="_ports.top.length">' +
        '        <div style="display: table; margin: -5px auto 0">' +
        '            <div v-for="port in _ports.top"' +
        '                 :key="port.id"' +
        '                 :title="port.id"' +
        //'                 v-bind.sync="port"' +
        '                 style="display: table-cell"' +
        //'                 class="vf-port"' +
        '                 @mousedown="onPortMouseDown($event, id, port.id)"' +
        '                 @mouseup="onPortMouseUp($event, id, port.id)"><v-flow-port ref="ports" :key="port.id" v-bind.sync="port"/></div>' +
        '        </div>' +
        '    </div>' +
        '    <div style=" margin: 0 -5px;">' +
        '        <div style="display: table; width: 100%;">' +
        '            <div style="display: table-row;">' +
        '                <div v-if="_ports.left.length" style="display: table-cell; width: 1px">' +
        '                    <div v-for="port in _ports.left"' +
        '                         :key="port.id"' +
        '                         :title="port.id"' +
        //'                         v-bind.sync="port"' +
        //'                         class="vf-port"' +
        '                         @mousedown="onPortMouseDown($event, id, port.id)"' +
        '                         @mouseup="onPortMouseUp($event, id, port.id)"><v-flow-port ref="ports" :key="port.id" v-bind.sync="port"/></div>' +
        '                </div>' +
        '                <div style="display: table-cell;">' +
        '                    <button type="button" @click="$emit(\'block-remove\')">x</button>' +
        '                </div>' +
        '                <div v-if="_ports.right.length" style="display: table-cell; width: 1px">' +
        '                    <div v-for="port in _ports.right"' +
        '                         :key="port.id"' +
        '                         :title="port.id"' +
        //'                         v-bind.sync="port"' +
        //'                         class="vf-port"' +
        '                         @mousedown="onPortMouseDown($event, id, port.id)"' +
        '                         @mouseup="onPortMouseUp($event, id, port.id)"><v-flow-port ref="ports" :key="port.id" v-bind.sync="port"/></div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div v-if="_ports.bottom.length">' +
        '        <div style="display: table; margin: 0 auto -5px">' +
        '            <div v-for="port in _ports.bottom"' +
        '                 :key="port.id"' +
        '                 :title="port.id"' +
        '                 v-bind.sync="port"' +
        '                 style="display: table-cell"' +
        //'                 class="vf-port"' +
        '                 @mousedown="onPortMouseDown($event, id, port.id)"' +
        '                 @mouseup="onPortMouseUp($event, id, port.id)">' +
        '                <v-flow-port ref="ports" v-bind.sync="port" />' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    props: {
        id: String,
        x: Number,
        y: Number,
        selected: Boolean,
        ports: {type: Object, default: function () { return {}; }}
    },
    components: {
        'v-flow-port': {
            template:
                '<div class="vf-port" @mousedown="$emit(\'port-mouse-down\')" @mouseup="$emit(\'port-mouse-up\')" />',
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
            return this.$refs.ports.find(function (port) { return port.id === portID; });
        },
        portInsert: function () {}
    }
});
