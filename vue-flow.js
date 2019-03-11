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
        distance (x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        },
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
