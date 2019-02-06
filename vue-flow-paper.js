Vue.component('vf-paper', {
    props: {
        scene: {
            type: Object,
            default: function () { return {blocks: [], links: [], container: {}}; }
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
            //TODO deselect all blocks
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
        onBlockSelect: function (block) {
            //TODO deselect blocks & select passed block
        },
        onBlockUpdate: function (block) {
            //TODO update scene
        },
        onBlockRemove: function (block) {
            //TODO remove any links connected to block
            //TODO update scene
        },
        // Instance methods
    }
});