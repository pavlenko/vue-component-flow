var VueFlow = {
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
                    x: cursorX - position.left,
                    y: cursorY - position.top
                }
            }

            return {x: cursorX, y: cursorY}
        }
    }
};