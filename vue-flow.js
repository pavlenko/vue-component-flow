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
        getElementPosition2: function (element, parent) {
            var rect1 = element.getBoundingClientRect();

            if (parent) {
                var rect2 = parent.getBoundingClientRect();

                return {
                    y: Math.round((rect1.top - rect2.top) + window.pageYOffset),
                    x: Math.round((rect1.left - rect2.left) + window.pageXOffset)
                }
            }

            return {
                y: Math.round(rect1.top + window.pageYOffset),
                x: Math.round(rect1.left + window.pageXOffset)
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
