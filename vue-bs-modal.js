var VueBSModal = Vue.extend({
    template:
        '<div class="modal" v-on:click="$hide" style="display: block">' +
        '    <div class="modal-dialog">' +
        '        <div class="modal-content" v-on:click.stop>' +
        '            <v-bs-modal-header v-on:btn-close="$hide"/>' +
        '            <v-bs-modal-body />' +
        '            <v-bs-modal-footer v-on:btn-close="$hide" v-on:btn-apply="$save"/>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    components: {
        'v-bs-modal-header': {
            template:
                '<div class="modal-header">' +
                '    <button v-if="buttonClose.content"' +
                '            v-html="buttonClose.content"' +
                '            @click="$emit(\'btn-close\')"' +
                '            type="button"' +
                '            :class="buttonClose.class"' +
                '    />' +
                '    <h4 class="modal-title" v-html="title" />' +
                '</div>',
            props: {
                title: {
                    type: String
                },
                buttonClose: {
                    type:    Object,
                    default: function () { return {content: '<span aria-hidden="true">&times;</span>', class: 'close'}; }
                }
            }
        },
        'v-bs-modal-body': {
            template: '<div class="modal-body" v-html="content"></div>',
            props: {
                content: {type: String}
            }
        },
        'v-bs-modal-footer': {
            template:
                '<div class="modal-footer">' +
                '    <button v-if="buttonClose.content"' +
                '            v-on:click="$emit(\'btn-close\')"' +
                '            v-html="buttonClose.content"' +
                '            type="button"' +
                '            class="pull-right"' +
                '            :class="buttonClose.class"' +
                '    />' +
                '    <button v-if="buttonApply.content"' +
                '            v-on:click="$emit(\'btn-apply\')"' +
                '            v-html="buttonApply.content"' +
                '            type="button"' +
                '            class="pull-left"' +
                '            :class="buttonApply.class"' +
                '    />' +
                '</div>',
            props: {
                buttonApply: {type: Object, default: function () { return {content: 'OK', class: 'btn btn-primary'}; }},
                buttonClose: {type: Object, default: function () { return {content: 'Cancel', class: 'btn btn-default'}; }}
            }
        }
    },
    props: {
        backdrop: {
            type:    Boolean,
            default: true
        },
        data: {
            type:    Object,
            default: function () { return {}; }
        }
    },
    methods: {
        $show: function () {
            this.$mount();

            document.body.classList.add('modal-open');
            document.body.appendChild(this.$el);

            if (this.backdrop) {
                this.backdropEL = document.createElement('div');
                this.backdropEL.classList.add('modal-backdrop', 'in');
                document.body.appendChild(this.backdropEL);
            }
        },
        $hide: function (e) {
            this.$el.parentNode.removeChild(this.$el);

            if (this.backdropEL) {
                this.backdropEL.parentNode.removeChild(this.backdropEL);
            }

            document.body.classList.remove('modal-open');
        },
        $save: function () {
            this.$emit('update', Object.assign({}, this.data)).$hide();
        }
    }
});
