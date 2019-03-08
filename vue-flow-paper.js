Vue.component('vf-paper', {
    template:
        '<div class="vf-paper" :style="style">' +
        '    <svg class="vf-links" style="width: 100%; height: 100%">' +
        '        <vf-link v-for="link in _links" :key="link.id" v-bind.sync="link" @linking-remove="onLinkingRemove(link)"/>' +
        '    </svg>' +
        '    <vf-block ref="blocks"' +
        '              v-for="block in blocks"' +
        '              :key="block.id"' +
        '              v-bind.sync="block"' +
        '              @block-select="onBlockSelect(block)"' +
        '              @block-update="onBlockUpdate(block)"' +
        '              @block-remove="onBlockRemove(block)"' +
        '              @linking-start="onLinkingStart(block, $event)"' +
        '              @linking-stop="onLinkingStop(block, $event)"' +
        '    />' +
        '    <pre>{{ JSON.stringify(draggingLink, null, \'    \') }}</pre>' +
        '</div>',
    props: {
        gridShow: Boolean,
        gridSize: {type: Number, default: 10, validator: function (value) { return value > 0; }},
        gridColorForeground: {type: String, default: 'rgba(102, 102, 102, 0.2)'},
        gridColorBackground: {type: String, default: '#ffffff'},
        scene: {
            type: Object,
            default: function () { return {blocks: [], links: []}; }
        }
    },
    data: function () {
        return {
            action: {
                linking: false,
                dragging: false
            },
            blocks: [],
            links: [],
            draggingLink: null
        };
    },
    computed: {
        style: function () {
            if (!this.gridShow) {
                return {};
            }

            return {
                'background-color': this.gridColorBackground,
                'background-image': 'linear-gradient(90deg, ' + this.gridColorForeground + ' 1px, transparent 1px), linear-gradient(' + this.gridColorForeground + ' 1px, transparent 1px)',
                'background-size':  this.gridSize + 'px ' + this.gridSize + 'px',
            }
        },
        _links: function () {
            //TODO do not use reference to dom elements, calculate coordinates based on config both for blocks & ports
            var links = [];

            this.scene.links.forEach(function (link) {
                links.push(link);
            });

            if (this.draggingLink) {
                links.push(this.draggingLink);
            }

            return links;
        }
    },
    mounted: function () {
        document.documentElement.addEventListener('mousedown', this._onMouseDown = this.onMouseDown.bind(this), true);
        document.documentElement.addEventListener('mousemove', this._onMouseMove = this.onMouseMove.bind(this), true);
        document.documentElement.addEventListener('mouseup', this._onMouseUp = this.onMouseUp.bind(this), true);
        document.documentElement.addEventListener('wheel', this._onMouseWheel = this.onMouseWheel.bind(this), true);

        //this.centerX = this.$el.clientWidth / 2;
        //this.centerY = this.$el.clientHeight / 2;

        //this.importBlocksContent()
        this.sceneImport();
    },
    updated: function () {},
    beforeDestroy: function () {
        document.documentElement.removeEventListener('mousedown', this._onMouseDown, true);
        document.documentElement.removeEventListener('mousemove', this._onMouseMove, true);
        document.documentElement.removeEventListener('mouseup', this._onMouseUp, true);
        document.documentElement.removeEventListener('wheel', this._onMouseWheel, true);
    },
    methods: {
        // Native listeners
        onMouseDown: function (e) {
            //TODO save initial dragging position
            var target = e.target || e.srcElement;

            if ((target === this.$el || target.matches('svg, svg *')) && e.which === 1) {
                //this.dragging = true

                var position = VueFlow.utils.getCursorPosition(e, this.$el);

                this.cursorPositionX = position.left;
                this.cursorPositionY = position.top;
                //let mouse = mouseHelper.getMousePosition(this.$el, e)
                //this.mouseX = mouse.x
                //this.mouseY = mouse.y

                //this.lastMouseX = this.mouseX
                //this.lastMouseY = this.mouseY

                this.blockSelect(-1);

                if (e.preventDefault) e.preventDefault()
            }
        },
        onMouseMove: function (e) {
            //TODO update center position via predefined top & left offsets if dragging
            //TODO update link if linking


            if (this.action.linking) {
                var position = VueFlow.utils.getCursorPosition(e, this.$el);

                this.draggingLink.targetX = position.x;
                this.draggingLink.targetY = position.y;
            }
        },
        onMouseUp: function (e) {
            //TODO if dragging - update scene & reset dragging
            //TODO if linking - reset linking
            var target = e.target || e.srcElement;

            if (this.$el.contains(target)) {
                if (typeof target.className !== 'string' || target.className.indexOf('vf-port') < 0) {
                    this.draggingLink = null;
                }
            }

            this.action.linking = false;
        },
        onMouseWheel: function (e) {
            //TODO handle zooming with limits
        },
        // Custom listeners
        onLinkingStart: function (block, e) {//TODO <-- pass block + port
            var position = VueFlow.utils.getCursorPosition(e, this.$el);

            this.action.linking = true;

            this.draggingLink = {
                id:      VueFlow.utils.generateUUID(),
                sourceX: position.x,
                sourceY: position.y,
                targetX: position.x,
                targetY: position.y
            };
        },
        onLinkingStop: function (block) {//TODO <-- pass block + port
            if (this.draggingLink) {
                /*const newLink = {
                    id: maxID + 1,
                    from: this.draggingLink.from,
                    to: index,
                };*/

                this.scene.links.push(this.draggingLink);
                this.sceneUpdate();
                //this.linkInsert();//TODO <-- use this
            }

            this.draggingLink = null;
        },
        onLinkingRemove: function (link) { this.linkRemove(link.id); },
        onBlockSelect: function (block) { this.blockSelect(block.id); },
        onBlockUpdate: function (block) { this.sceneUpdate(); },
        onBlockRemove: function (block) { this.blockRemove(block.id); },
        // Instance methods
        sceneImport: function () {
            this.blocks = this.scene.blocks;
            this.links  = this.scene.links;
        },
        sceneExport: function () {
            return {
                blocks: this.blocks,
                links:  this.links,
            };
        },
        sceneUpdate: function () {
            this.$emit('update:scene', this.sceneExport());
        },
        blockInsert: function (type) {
            //TODO create block from type factory
            this.blocks.push({
                id: VueFlow.utils.generateUUID(),
                x: 0,
                y: 0,
                selected: false
            });

            this.sceneUpdate();
        },
        blockSelect: function (blockID) {
            this.blocks.forEach(function (block) {
                block.selected = (block.id === blockID);
            });

            this.sceneUpdate();
        },
        blockRemove: function (blockID) {
            this.links.forEach(function (link) {
                if (link.sourceBlockID === blockID || link.targetBlockID === blockID) {
                    this.linkRemove(link.id);
                }
            }.bind(this));

            this.blocks = this.blocks.filter(function (block) {
                return block.id !== blockID;
            });

            this.sceneUpdate()
        },
        linkInsert: function (sourceBlock, sourcePort, targetBlock, targetPort) {
            this.links.push({
                id: VueFlow.utils.generateUUID(),
                sourceBlock: sourceBlock,
                sourcePort: sourcePort,
                targetBlock: targetBlock,
                targetPort: targetPort
            });

            this.sceneUpdate();
        },
        linkRemove: function (linkID) {
            this.links = this.links.filter(function (link) {
                return link.id !== linkID;
            });

            this.sceneUpdate();
        }
    },
    watch: {
        blocksContent () {
            this.importBlocksContent()
        },
        scene: function () { this.sceneImport(); }
    }
});
