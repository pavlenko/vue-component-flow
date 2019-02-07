Vue.component('vf-paper', {
    template:
        '<div class="vf-paper">' +
        '    <svg class="vf-links">TODO</svg>' +
        '    <div class="vf-blocks">' +
        '        <vf-block v-for="block in blocks"' +
        '                  :key="block.id"' +
        '                  v-bind.sync="block"' +
        '                  @block-select="onBlockSelect(block)"' +
        '                  @block-update="onBlockUpdate(block)"' +
        '                  @block-remove="onBlockRemove(block)" />' +
        '    </div>' +
        '</div>',
    props: {
        scene: {
            type: Object,
            default: function () { return {blocks: [], links: []}; }
        }
    },
    data: function () {
        return {
            blocks: [],
            links: [],
        };
    },
    mounted: function () {
        document.documentElement.addEventListener('mousedown', this._onMouseDown = this.onMouseDown.bind(this), true);
        document.documentElement.addEventListener('mousemove', this._onMouseMove = this.onMouseMove.bind(this), true);
        document.documentElement.addEventListener('mouseup', this._onMouseUp = this.onMouseUp.bind(this), true);
        document.documentElement.addEventListener('wheel', this._onMouseWheel = this.onMouseWheel.bind(this), true);

        //this.centerX = this.$el.clientWidth / 2;
        //this.centerY = this.$el.clientHeight / 2;

        //this.importBlocksContent()
        //this.importScene()
    },
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
        },
        onMouseUp: function (e) {
            //TODO if dragging - update scene & reset dragging
            //TODO if linking - reset linking
        },
        onMouseWheel: function (e) {
            //TODO handle zooming with limits
        },
        // Custom listeners
        onLinkingStart: function () {
            //TODO save block, port and cursor data for source
        },
        onLinkingStop: function () {
            //TODO add temp link to links list if all ok
            //TODO update scene
            //TODO reset linking
        },
        onLinkingBreak: function () {
            //TODO ???... disallow to start linking from inputs
            //TODO update scene
        },
        onBlockSelect: function (block) { this.blockSelect(block.id); },
        onBlockUpdate: function (block) { this.sceneUpdate(); },
        onBlockRemove: function (block) { this.blockRemove(block.id); },
        // Instance methods
        sceneImport: function () {
            //TODO process blocks & links from scene object to internal blocks & links properties
            this.blocks = this.scene.blocks;
            this.links  = this.scene.links;
        },
        sceneExport: function () {
            //TODO process blocks & links internal properties to scene object blocks & links
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
        linkRemove: function (linkID) {
            this.links = this.links.filter(function (link) {
                return link.id !== linkID;
            })
        }
    }
});