var VueFlow = {
    portEdges: {
        EDGE_TOP:    'top',
        EDGE_RIGHT:  'right',
        EDGE_BOTTOM: 'bottom',
        EDGE_LEFT:   'left',
    },
    portTypes: {
        TYPE_I:  'i',
        TYPE_O:  'o',
        TYPE_IO: 'io'
    },
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
        },
        getEdgeCenter: function (element, edge, parent) {
            var bounding = VueFlow.utils.getElementBounding(element, parent);

            var x = null, y = null;
            switch (edge) {
                case VueFlow.portEdges.EDGE_TOP:
                    x = bounding.x0 + ((bounding.x1 - bounding.x0) / 2);
                    y = bounding.y0;
                    break;
                case VueFlow.portEdges.EDGE_RIGHT:
                    x = bounding.x1;
                    y = bounding.y0 + ((bounding.y1 - bounding.y0) / 2);
                    break;
                case VueFlow.portEdges.EDGE_BOTTOM:
                    x = bounding.x0 + ((bounding.x1 - bounding.x0) / 2);
                    y = bounding.y1;
                    break;
                case VueFlow.portEdges.EDGE_LEFT:
                    x = bounding.x0;
                    y = bounding.y0 + ((bounding.y1 - bounding.y0) / 2);
                    break;
            }

            return {x: x, y: y};
        },
        getElementBounding: function (element, parent) {
            var offsetX = window.pageXOffset;
            var offsetY = window.pageYOffset;

            var bounding1 = element.getBoundingClientRect();

            if (parent) {
                var bounding2 = parent.getBoundingClientRect();

                return {
                    x0: Math.round(bounding1.left - bounding2.left + offsetX),
                    y0: Math.round(bounding1.top - bounding2.top + offsetY),
                    x1: Math.round(bounding1.right - bounding2.left + offsetX),
                    y1: Math.round(bounding1.bottom - bounding2.top + offsetY),
                }
            } else {
                return {
                    x0: Math.round(bounding1.left + offsetX),
                    y0: Math.round(bounding1.top + offsetY),
                    x1: Math.round(bounding1.right + offsetX),
                    y1: Math.round(bounding1.bottom + offsetY),
                }
            }
        },
        getElementPosition: function (element) {
            var rect = element.getBoundingClientRect();

            return {
                y: Math.round(rect.top + window.pageYOffset),
                x: Math.round(rect.left + window.pageXOffset)
            }
        },
        getCursorPosition: function (event, element) {
            var cursorX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            var cursorY = event.pageY || event.clientY + document.documentElement.scrollTop;

            if (element) {
                var position = VueFlow.utils.getElementPosition(element);

                return {
                    x: cursorX - position.x,
                    y: cursorY - position.y
                }
            }

            return {x: cursorX, y: cursorY}
        }
    }
};

Vue.component('v-flow-line', {
    template:
        '<g class="v-flow-line">' +
        '    <path :d="d" stroke="#333" stroke-width="1" fill="none" />' +
        '    <a :transform="styles.deleteButton.transform" @click.prevent="$emit(\'linking-remove\')">' +
        '        <text text-anchor="middle" font-size="22">&times;</text>' +
        '    </a>' +
        '    <path d="M -1 -1 L 0 1 L 1 -1 z" stroke="#666" stroke-width="6" stroke-opacity="1" fill="none" :transform="styles.sourceArrow.transform" />' +
        '    <path d="M -1 -1 L 0 1 L 1 -1 z" stroke="#666" stroke-width="6" stroke-opacity="1" fill="none" :transform="styles.targetArrow.transform" />' +
        '</g>',
    props: {
        id:      String,
        sourceX: Number,
        sourceY: Number,
        targetX: Number,
        targetY: Number
    },
    computed: {
        d: function () {
            var sx = this.sourceX,
                sy = this.sourceY,
                tx = this.targetX,
                ty = this.targetY;

            return 'M ' + sx + ', ' + sy + ' C ' + sx + ', ' + sy + ', ' + tx + ', ' + ty + ', ' + tx + ', ' + ty;
        },
        styles: function () {
            var radians = -Math.atan2(this.targetX - this.sourceX, this.targetY - this.sourceY);
            var degrees = radians * 180 / Math.PI;

            var multiplierX = Math.abs(Math.sin(radians));
            var multiplierY = Math.abs(Math.cos(radians));

            var buttonPosition = {
                x: this.targetX - 16 * multiplierX,
                y: this.targetY - 16 * multiplierY
            };

            var sArrowPosition = {
                x: this.sourceX + 6 * multiplierX,
                y: this.sourceY + 6 * multiplierY
            };

            var tArrowPosition = {
                x: this.targetX - 6 * multiplierX,
                y: this.targetY - 6 * multiplierY
            };

            return {
                deleteButton: {
                    transform: 'translate(' + buttonPosition.x + ', ' + buttonPosition.y + ') rotate(' + degrees +')'
                },
                sourceArrow: {
                    transform: 'translate(' + sArrowPosition.x + ', ' + sArrowPosition.y + ') rotate(' + (degrees - 180) +')'
                },
                targetArrow: {
                    transform: 'translate(' + tArrowPosition.x + ', ' + tArrowPosition.y + ') rotate(' + degrees +')'
                }
            };
        }
    }
});

Vue.component('v-flow-port', {
    template:
        '<div :class="\'v-flow-port v-flow-port-\' + edge" @mousedown="$emit(\'port-mouse-down\', $event)" @mouseup="$emit(\'port-mouse-up\', $event)" />',
    props: {
        id:   {type: String, required: true},
        edge: {type: String, required: true},
        type: {type: String, required: true}
    }
});

Vue.component('v-flow-block', {
    template:
        '<div class="v-flow-block" :class="{selected: selected}" :style="style" @mousedown="$emit(\'block-select\');">' +
        '    <div class="v-flow-block-ports-top" v-if="_ports.top.length">' +
        '        <div class="v-flow-block-port" v-for="port in _ports.top" :key="port.id">' +
        '            <v-flow-port ref="ports"' +
        '                         v-bind.sync="port"' +
        '                         @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                         @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
        '        </div>' +
        '    </div>' +
        '    <div class="v-flow-block-body-wrapper">' +
        '        <div class="v-flow-block-body">' +
        '            <div class="v-flow-block-ports-left" v-if="_ports.left.length">' +
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
        '            <div class="v-flow-block-ports-right" v-if="_ports.right.length">' +
        '                <div v-for="port in _ports.right" :key="port.id">' +
        '                    <v-flow-port ref="ports"' +
        '                                 v-bind.sync="port"' +
        '                                 @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                                 @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="v-flow-block-ports-bottom" v-if="_ports.bottom.length">' +
        '        <div class="v-flow-block-port" v-for="port in _ports.bottom" :key="port.id">' +
        '            <v-flow-port ref="ports"' +
        '                         v-bind.sync="port"' +
        '                         @port-mouse-down="onPortMouseDown($event, id, port.id)"' +
        '                         @port-mouse-up="onPortMouseUp($event, id, port.id)"/>' +
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

Vue.component('v-flow-paper', {
    template:
        '<div class="v-flow-paper-container" :style="styles.wrapper">' +
        '    <div class="v-flow-paper" ref="paper" :style="styles.paper">' +
        '        <svg class="v-flow-links">' +
        '            <v-flow-line v-for="link in lines" :key="link.id" v-bind.sync="link" @linking-remove="onLinkingRemove(link)"/>' +
        '        </svg>' +
        '        <v-flow-block ref="blocks"' +
        '                      v-for="block in blocks"' +
        '                      :key="block.id"' +
        '                      v-bind.sync="block"' +
        '                      @block-select="onBlockSelect(block)"' +
        '                      @block-update="onBlockUpdate(block)"' +
        '                      @block-remove="onBlockRemove(block)"' +
        '                      @linking-start="onLinkingStart"' +
        '                      @linking-stop="onLinkingStop"' +
        '        />' +
        '    </div>' +
        '</div>',
    props: {
        sizeW:    {type: String, default: '2000px'},
        sizeH:    {type: String, default: '1000px'},
        maxW:     {type: String, default: '100%'},
        maxH:     {type: String, default: '400px'},
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
        styles: function () {
            var paperStyle = {'width': this.sizeW, 'height': this.sizeH};

            if (this.gridShow) {
                Object.assign(paperStyle, {
                    'background-color': this.gridColorBackground,
                    'background-image': 'linear-gradient(90deg, ' + this.gridColorForeground + ' 1px, transparent 1px), linear-gradient(' + this.gridColorForeground + ' 1px, transparent 1px)',
                    'background-size':  this.gridSize + 'px ' + this.gridSize + 'px',
                });
            }

            return {
                wrapper: {
                    'max-width':  this.maxW,
                    'max-height': this.maxH
                },
                paper: paperStyle
            };
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
                    var newX = position.x - this.cursorOffsetX + this.scrollPositionX;
                    var newY = position.y - this.cursorOffsetY + this.scrollPositionY;

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

            if (this.action.dragging && !this.action.linking) {
                var position = VueFlow.utils.getCursorPosition(e, this.$el);

                var index = this.blocks.findIndex(function (block) {
                    return block.id === this.action.dragging;
                }.bind(this));

                if (index >= 0) {
                    var newX = VueFlow.utils.snapTo(position.x - this.cursorOffsetX + this.scrollPositionX, this.gridSize);
                    var newY = VueFlow.utils.snapTo(position.y - this.cursorOffsetY + this.scrollPositionY, this.gridSize);

                    this.$set(this.scene.blocks, index, Object.assign(this.scene.blocks[index], {x: newX, y: newY}));

                    this.$nextTick(function () {
                        this.sceneUpdate();
                    });
                }
            }

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

            var block = this.blockSearch(blockID);
            if (block) {
                var position = VueFlow.utils.getElementPosition(block.$el, this.$el);

                this.cursorOffsetX = Math.abs(this.cursorPositionX - position.x);
                this.cursorOffsetY = Math.abs(this.cursorPositionY - position.y);
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

