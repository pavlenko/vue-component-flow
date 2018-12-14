<template>
    <div>
        <flow-node v-for="(node, name) in nodes"></flow-node>
        <flow-line v-for="(line, name) in lines"></flow-line>
    </div>
</template>

<script>
    import FlowNode from './Node.vue'
    import FlowLine from './Line.vue'

    export default {
        name: 'FlowDiagram',
        props: {
            type: {
                type: String
            },
            name: {
                type: String
            },
            label: {
                type: String
            }
        },
        components: {FlowNode, FlowLine},
        computed: {
            nodes() {
                return {};
            },
            lines() {
                return {};
            }
        }
    }
</script>