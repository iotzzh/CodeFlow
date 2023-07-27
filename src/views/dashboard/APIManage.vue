<template>
    <div class="box">
        <VueFlow
    v-model="elements"
    class="basicflow"
    :default-edge-options="{ type: 'smoothstep' }"
    :default-viewport="{ zoom: 1.5 }"
    :min-zoom="0.2"
    :max-zoom="4"
    fit-view-on-init
  >
    <Background pattern-color="#aaa" gap="8" />

    <MiniMap />

    <Controls />
  </VueFlow>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';  
import { Panel, VueFlow, isNode, useVueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { ipcRenderer } from "electron";

onMounted(() => {
    console.log('sendmessage');
    ipcRenderer.send('sendMessage', 'message');

    ipcRenderer.on('receiveMessage', (list:any) => {
      console.log('接收数据列表: ', 'list');
    });
});

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */
const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject } = useVueFlow()

/**
 * Our elements
 */
const elements = ref([
  { id: '1', type: 'input', label: 'API管理', position: { x: 0, y: 100 }, class: 'light' },
  { id: '2', label: 'API1', position: { x: 100, y: 200 }, class: 'light' },
//   { id: '2', type: 'output', label: 'Node 2', position: { x: 100, y: 100 }, class: 'light' },
//   { id: '3', label: 'Node 3', position: { x: 400, y: 100 }, class: 'light' },
//   { id: '4', label: 'Node 4', position: { x: 150, y: 200 }, class: 'light' },
//   { id: '5', type: 'output', label: 'Node 5', position: { x: 300, y: 300 }, class: 'light' },
//   { id: 'e1-2', source: '1', target: '2', animated: true },
//   { id: 'e1-3', label: 'edge with arrowhead', source: '1', target: '3', markerEnd: MarkerType.ArrowClosed },
//   {
//     id: 'e4-5',
//     type: 'step',
//     label: 'step-edge',
//     source: '4',
//     target: '5',
//     style: { stroke: 'orange' },
//     labelBgStyle: { fill: 'orange' },
//   },
//   { id: 'e3-4', type: 'smoothstep', label: 'smoothstep-edge', source: '3', target: '4' },
])

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when viewpane & nodes have visible dimensions
 */
onPaneReady(({ fitView }) => {
  fitView()
})

onNodeDragStop((e) => console.log('drag stop', e))

/**
 * onConnect is called when a new connection is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => addEdges(params))

const dark = ref(false)

/**
 * To update node properties you can simply use your elements v-model and mutate the elements directly
 * Changes should always be reflected on the graph reactively, without the need to overwrite the elements
 */
function updatePos() {
  return elements.value.forEach((el) => {
    if (isNode(el)) {
      el.position = {
        x: Math.random() * 400,
        y: Math.random() * 400,
      }
    }
  })
}

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  return console.log(toObject())
}

/**
 * Resets the current viewpane transformation (zoom & pan)
 */
function resetTransform() {
  return setTransform({ x: 0, y: 0, zoom: 1 })
}

function toggleClass() {
  return (dark.value = !dark.value)
}
</script>

<style>


.box {
    height: 100%;
    width: 100%;
}

</style>