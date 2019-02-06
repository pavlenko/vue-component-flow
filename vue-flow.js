var VueFlow = {
    components: {},
    utils: {
        snapTo: function (value, snap) { return Math.round(Math.round(value / snap) * snap); },
        generateUUID: function () {
            var date = new Date().getTime();

            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (date + Math.random() * 16) % 16 | 0;
                date = Math.floor(date / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }
    }
};

VueFlow.components['vue-flow-block'] = Vue.component('vue-flow-block', {
    props: {
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 100
        },
        selected: Boolean,
        title: String,
        inputs: {
            type: Array,
            default: function () { return []; }
        },
        outputs: {
            type: Array,
            default: function () { return []; }
        }
    },
    computed: {
        style: function () {
            return {
                top:   this.y + 'px',
                left:  this.x + 'px',
                width: this.width + 'px',
            }
        }
    },
    template:
        '<div class="vf-block" :class="{selected: selected}" :style="style">' +
        '    <div class="vf-block-header">' +
        '        <div>{{ title }}</div>' +
        '        <button type="button" v-on:click="removeBlock">x</button>' +
        '    </div>' +
        '    <div class="vf-block-body"></div>' +
        '    <div class="vf-port-group vf-port-group-input">' +
        '        <div class="vf-port" v-for="(port, index) in inputs" :class="{active: port.active}"></div>' +
        '    </div>' +
        '    <div class="vf-port-group vf-port-group-output">' +
        '        <div class="vf-port" v-for="(port, index) in outputs" :class="{active: port.active}"></div>' +
        '    </div>' +
        '</div>',
    mounted: function () {
        document.documentElement.addEventListener('mousedown', this.onMouseDown, true);
        document.documentElement.addEventListener('mousemove', this.onMouseMove, true);
        document.documentElement.addEventListener('mouseup', this.onMouseUp, true);
    },
    beforeDestroy: function () {
        document.documentElement.removeEventListener('mousedown', this.onMouseDown, true);
        document.documentElement.removeEventListener('mousemove', this.onMouseMove, true);
        document.documentElement.removeEventListener('mouseup', this.onMouseUp, true);
    },
    methods: {
        selectBlock: function () {

        },
        removeBlock: function () {
            this.$emit('remove');
        },
        onMouseDown: function (event) {
            var rect = this.$parent.$el.getBoundingClientRect();

            this.cursorPositionX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            this.cursorPositionY = event.pageY || event.clientY + document.documentElement.scrollTop;

            this.cursorOffsetX = this.cursorPositionX - rect.left;
            this.cursorOffsetY = this.cursorPositionY - rect.top;

            var target = event.target || event.srcElement;

            if (this.$el.contains(target) && event.which === 1) {
                this.dragging = true;

                this.$emit('select');

                if (event.preventDefault) event.preventDefault()
            }
        },
        onMouseMove: function (event) {
            var rect = this.$parent.$el.getBoundingClientRect();

            this.cursorPositionX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            this.cursorPositionY = event.pageY || event.clientY + document.documentElement.scrollTop;

            if (this.dragging && !this.linking) {
                var newX = VueFlow.utils.snapTo(this.cursorPositionX - rect.left - this.cursorOffsetX, this.$parent.gridSize);
                var newY = VueFlow.utils.snapTo(this.cursorPositionY - rect.top - this.cursorOffsetY, this.$parent.gridSize);

                this.$emit('update:x', newX);
                this.$emit('update:y', newY);

                this.hasDragged = true
            }
        },
        onMouseUp: function () {
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
        }
    }
});

VueFlow.components['vue-flow-paper'] = Vue.component('vue-flow-paper', {
    props: {
        gridShow: Boolean,
        gridSize: {
            type: Number,
            default: 10,
            validator: function (value) { return value > 0; }
        },
        blocks: {
            type: Array,
            default: function () { return []; }
        },
        links:  {
            type: Array,
            default: function () { return []; }
        }
    },
    template:
        '<div class="vf-paper" style="height: 500px">' +
        '    <vue-flow-block v-for="block in blocks"' +
        '                    :key="block.id"' +
        '                    v-bind.sync="block"' +
        '                    @select="selectBlock(block)"' +
        '                    @update="updateBlock(block)"' +
        '                    @remove="removeBlock(block)" />' +
        '</div>',
    methods: {
        insertBlock: function (type) {
            this.blocks.push({
                id:       VueFlow.utils.generateUUID(),
                x:        0,
                y:        0,
                type:     type,
                selected: false,
                inputs:   [],
                outputs:  []
            });
        },
        selectBlock: function (block) {
            block.selected = true;

            this.blocks.forEach(function (item) {
                if (item.id !== block.id && item.selected) {
                    item.selected = false;
                }
            });
        },
        updateBlock: function (block) {
            console.log(arguments);
        },
        removeBlock: function (block) {
            var index = this.blocks.findIndex(function (item) {
                return item.id === block.id;
            });

            this.blocks.splice(index, 1);
        }
    }
});