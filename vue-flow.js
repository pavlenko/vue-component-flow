var VueFlow = {
    components: {},
    utils: {
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

VueFlow.components['vue-flow-block-item'] = Vue.component('vue-flow-block-item', {
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
        title: String
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
        '        <button type="button" v-on:click="remove">x</button>' +
        '    </div>' +
        '    <div class="vf-block-body"></div>' +
        '    <div class="vf-port-group vf-port-group-input">' +
        '        <div class="vf-port" v-for="(port, index) in ports(\'input\')" :class="{active: port.active}"></div>' +
        '    </div>' +
        '    <div class="vf-port-group vf-port-group-output">' +
        '        <div class="vf-port" v-for="(port, index) in ports(\'output\')" :class="{active: port.active}"></div>' +
        '    </div>' +
        '</div>',
    created: function () {
        this.mouseX = 0;
        this.mouseY = 0;

        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.linking  = false;
        this.dragging = false;
    },
    mounted: function () {
        document.documentElement.addEventListener('mousemove', this.handleMove, true);
        document.documentElement.addEventListener('mousedown', this.handleDown, true);
        document.documentElement.addEventListener('mouseup', this.handleUp, true);
    },
    beforeDestroy: function () {
        document.documentElement.removeEventListener('mousemove', this.handleMove, true);
        document.documentElement.removeEventListener('mousedown', this.handleDown, true);
        document.documentElement.removeEventListener('mouseup', this.handleUp, true);
    },
    methods: {
        handleMove: function (e) {
            this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
            this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;

            if (this.dragging && !this.linking) {
                let diffX = this.mouseX - this.lastMouseX;
                let diffY = this.mouseY - this.lastMouseY;

                this.lastMouseX = this.mouseX;
                this.lastMouseY = this.mouseY;

                this.moveWithDiff(diffX, diffY);

                this.hasDragged = true
            }
        },
        handleDown: function (e) {
            this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
            this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;

            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;

            const target = e.target || e.srcElement;
            if (this.$el.contains(target) && e.which === 1) {
                this.dragging = true;

                this.$emit('select');

                if (e.preventDefault) e.preventDefault()
            }
        },
        handleUp: function () {
            if (this.dragging) {
                this.dragging = false;

                if (this.hasDragged) {
                    //this.save();
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
        blocks: Array
    },
    template:
        '<div class="vf-paper">' +
        '    <vue-flow-block-item v-for="block in blocks"' +
        '                         :key="block.id"' +
        '                         v-bind.sync="block"' +
        '                         @select="blockSelect(block)"' +
        '                         @delete="blockDelete(block)" />' +
        '</div>',
    methods: {
        insert: function (type) {
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
        remove: function (blockID) {
            var index = this.blocks.findIndex(function (block) {
                return block.id === blockID;
            });

            this.blocks.splice(index, 1);
        }
    }
});