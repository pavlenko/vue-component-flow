Vue.component('vf-paper', {
    template:
        '<div class="vf-paper-container" style="width: 100%; overflow: auto; max-height: 500px;">' +
        '    <div class="vf-paper" ref="paper" :style="style">' +
        '        <svg class="vf-links" style="width: 100%; height: 100%">' +
        '            <v-flow-line v-for="link in lines" :key="link.id" v-bind.sync="link" @linking-remove="onLinkingRemove(link)"/>' +
        '        </svg>' +
        '        <vf-block ref="blocks"' +
        '                  v-for="block in blocks"' +
        '                  :key="block.id"' +
        '                  v-bind.sync="block"' +
        '                  @block-select="onBlockSelect(block)"' +
        '                  @block-update="onBlockUpdate(block)"' +
        '                  @block-remove="onBlockRemove(block)"' +
        '                  @linking-start="onLinkingStart"' +
        '                  @linking-stop="onLinkingStop"' +
        '        />' +
        '        <pre>{{ JSON.stringify(draggingLink, null, \'    \') }}</pre>' +
        '    </div>' +
        '</div>',
    props: {
        sizeW: String,
        sizeH: String,
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
            initialized: false,
            action: {
                dragging: null,
                linking:  false,
                panning:  false
            },
            blocks: [],
            links: [],
            draggingLink: null
        };
    },
    computed: {
        style: function () {
            var style = {width: this.sizeW, height: this.sizeH};

            if (!this.gridShow) {
                return style;
            }

            return Object.assign(style, {
                'background-color': this.gridColorBackground,
                'background-image': 'linear-gradient(90deg, ' + this.gridColorForeground + ' 1px, transparent 1px), linear-gradient(' + this.gridColorForeground + ' 1px, transparent 1px)',
                'background-size':  this.gridSize + 'px ' + this.gridSize + 'px',
            });
        },
        lines: function () {
            var lines = this.scene.links.map(function (link) {
                var sourceBlock = this.blockSearch(link.sourceBlock);
                var targetBlock = this.blockSearch(link.targetBlock);

                if (sourceBlock && targetBlock) {
                    var sourcePort = sourceBlock.portSearch(link.sourcePort);
                    var targetPort = targetBlock.portSearch(link.targetPort);

                    if (sourcePort && targetPort) {
                        var sourcePosition = VueFlow.utils.getEdgeCenter(sourcePort.$el, sourcePort.edge, this.$el);
                        var targetPosition = VueFlow.utils.getEdgeCenter(targetPort.$el, targetPort.edge, this.$el);

                        return {
                            id:      link.id,
                            sourceX: sourcePosition.x,
                            sourceY: sourcePosition.y,
                            targetX: targetPosition.x,
                            targetY: targetPosition.y,
                        };
                    }
                }

                return null;
            }.bind(this));

            lines = lines.filter(function (line) { return line !== null; });

            if (this.draggingLink) {
                lines.push({
                    id:      this.draggingLink.id,
                    sourceX: this.draggingLink.sourceX,
                    sourceY: this.draggingLink.sourceY,
                    targetX: this.draggingLink.targetX,
                    targetY: this.draggingLink.targetY,
                });
            }

            return lines;
        }
    },
    mounted: function () {
        document.documentElement.addEventListener('mousedown', this._onMouseDown = this.onMouseDown.bind(this), true);
        document.documentElement.addEventListener('mousemove', this._onMouseMove = this.onMouseMove.bind(this), true);
        document.documentElement.addEventListener('mouseup', this._onMouseUp = this.onMouseUp.bind(this), true);
        document.documentElement.addEventListener('wheel', this._onMouseWheel = this.onMouseWheel.bind(this), true);

        this.sceneImport();
    },
    updated: function () {
        if (!this.initialized) {
            this.$nextTick(function () {
                this.initialized = true;
                this.sceneUpdate();
            }.bind(this));
        }
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
            var target   = e.target || e.srcElement;
            var position = VueFlow.utils.getCursorPosition(e, this.$el);

            this.cursorPositionX = position.x;
            this.cursorPositionY = position.y;
            this.scrollPositionX = this.$el.scrollLeft;
            this.scrollPositionY = this.$el.scrollTop;

            if ((target === this.$el || target.matches('svg, svg *')) && e.which === 1) {
                this.action.panning = true;

                this.blockSelect(-1);

                if (e.preventDefault) e.preventDefault()
            }
        },
        onMouseMove: function (e) {
            var position = VueFlow.utils.getCursorPosition(e, this.$el);

            if (this.action.dragging && !this.action.linking) {
                var index = this.blocks.findIndex(function (block) {
                    return block.id === this.action.dragging;
                }.bind(this));

                if (index >= 0) {
                    var newX = VueFlow.utils.snapTo(position.x - this.cursorOffsetX + this.scrollPositionX, this.gridSize);
                    var newY = VueFlow.utils.snapTo(position.y - this.cursorOffsetY + this.scrollPositionY, this.gridSize);

                    this.$set(this.scene.blocks, index, Object.assign(this.scene.blocks[index], {x: newX, y: newY}));

                    this.sceneUpdate();
                }
            }

            if (this.action.linking && this.draggingLink) {
                this.draggingLink.targetX = position.x;
                this.draggingLink.targetY = position.y;
            }

            if (this.action.panning) {
                var scrollX = this.scrollPositionX + (this.cursorPositionX - position.x);
                var scrollY = this.scrollPositionY + (this.cursorPositionY - position.y);

                if (scrollX < 0 || scrollX > this.$el.scrollWidth - this.$el.clientWidth) {
                    this.cursorPositionX = position.x;
                } else {
                    this.$el.scrollLeft = scrollX;
                }

                if (scrollY < 0 || scrollY > this.$el.scrollHeight - this.$el.clientHeight) {
                    this.cursorPositionY = position.y
                } else {
                    this.$el.scrollTop = scrollY;
                }
            }
        },
        onMouseUp: function (e) {
            var target = e.target || e.srcElement;

            /*if (this.$el.contains(target)) {
                if (typeof target.className !== 'string' || target.className.indexOf('vf-port') < 0) {
                    this.draggingLink = null;
                }
            }*/

            this.action.dragging = null;
            this.action.linking  = false;
            this.action.panning  = false;
        },
        onMouseWheel: function (e) {},
        // Custom listeners
        onLinkingStart: function (e, blockID, portID) {
            this.action.linking = true;

            var block = this.blockSearch(blockID);
            if (block) {
                var port = block.portSearch(portID);
                if (port) {console.log(block, port);
                    var position = VueFlow.utils.getEdgeCenter(port.$el, port.edge, this.$el);

                    this.draggingLink = {
                        sourceX:     position.x,
                        sourceY:     position.y,
                        targetX:     position.x,
                        targetY:     position.y,
                        sourceBlock: blockID,
                        sourcePort:  portID,
                        targetBlock: null,
                        targetPort:  null
                    };
                }
            }
        },
        onLinkingStop: function (e, blockID, portID) {
            if (this.draggingLink) {
                var block = this.blockSearch(blockID);
                if (block && this.draggingLink.sourceBlock !== blockID) {
                    var port = block.portSearch(portID);
                    if (port && this.draggingLink.sourcePort !== portID) {
                        this.linkInsert(
                            this.draggingLink.sourceBlock,
                            this.draggingLink.sourcePort,
                            blockID,
                            portID
                        );
                    }
                }
            }

            this.draggingLink = null;
        },
        onLinkingRemove: function (link) { this.linkRemove(link.id); },
        onBlockSelect: function (block) { this.blockSelect(block.id); },
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
        blockSearch: function (blockID) {
            return this.$refs.blocks ? this.$refs.blocks.find(function (block) { return block.id === blockID; }) : null;
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
            this.action.dragging = blockID;

            var index = this.blocks.findIndex(function (block) { return block.id === blockID; });
            if (index >= 0) {
                var position1 = VueFlow.utils.getElementPosition(this.$refs.blocks[index].$el);
                var position2 = VueFlow.utils.getElementPosition(this.$el);

                this.cursorOffsetX = Math.abs(this.cursorPositionX - position2.x - position1.x);
                this.cursorOffsetY = Math.abs(this.cursorPositionY - position2.y - position1.y);
            }

            this.blocks.forEach(function (block) {
                block.selected = (block.id === blockID);
            });

            this.sceneUpdate();
        },
        blockRemove: function (blockID) {
            this.links.forEach(function (link) {
                if (link.sourceBlock === blockID || link.targetBlock === blockID) {
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
                id:          VueFlow.utils.generateUUID(),
                sourceBlock: sourceBlock,
                sourcePort:  sourcePort,
                targetBlock: targetBlock,
                targetPort:  targetPort
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
        scene: function () { this.sceneImport(); }
    }
});
