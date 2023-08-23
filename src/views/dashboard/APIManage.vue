<template>
  <div class="box">
    <VueFlow  class="basicflow" :class="{ dark }" v-model="elements" :default-edge-options="{ type: 'smoothstep' }"
      :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4" fit-view-on-init @nodeClick="nodeClickHandler">
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />

      <template #node-custom="{ data }">
        <div class="api-root">API管理</div>
        <Handle id="a" type="source" :position="Position.Right" :style="sourceHandleStyleA" />
      </template>

      <MiniMap />

      <Controls />
      <Panel position="top-right" class="controls">
        <el-input prefix-icon="Search" placeholder="搜索" style="display: inline; width: 150px;"></el-input>
        <el-select prefix-icon="Sort" placeholder="排序方式" style="display: inline; width: 100px;">
          <el-option>时间正序</el-option>
          <el-option>时间倒序</el-option>
          <el-option>名称正序</el-option>
          <el-option>名称倒序</el-option>
        </el-select>
        <button style="background-color: #113285; color: white" title="Reset Transform" @click="resetTransform">
          <svg width="16" height="16" viewBox="0 0 32 32">
            <path fill="#FFFFFB"
              d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z" />
          </svg>
        </button>

        <button style="background-color: #6f3381" title="Shuffle Node Positions" @click="updatePos">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#FFFFFB"
              d="M14 20v-2h2.6l-3.2-3.2l1.425-1.425L18 16.55V14h2v6Zm-8.6 0L4 18.6L16.6 6H14V4h6v6h-2V7.4Zm3.775-9.425L4 5.4L5.4 4l5.175 5.175Z" />
          </svg>
        </button>

        <button :style="{ backgroundColor: dark ? '#FFFFFB' : '#292524', color: dark ? '#292524' : '#FFFFFB' }"
          @click="toggleClass">
          <template v-if="dark">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#292524"
                d="M12 17q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM2 13q-.425 0-.712-.288Q1 12.425 1 12t.288-.713Q1.575 11 2 11h2q.425 0 .713.287Q5 11.575 5 12t-.287.712Q4.425 13 4 13Zm18 0q-.425 0-.712-.288Q19 12.425 19 12t.288-.713Q19.575 11 20 11h2q.425 0 .712.287q.288.288.288.713t-.288.712Q22.425 13 22 13Zm-8-8q-.425 0-.712-.288Q11 4.425 11 4V2q0-.425.288-.713Q11.575 1 12 1t.713.287Q13 1.575 13 2v2q0 .425-.287.712Q12.425 5 12 5Zm0 18q-.425 0-.712-.288Q11 22.425 11 22v-2q0-.425.288-.712Q11.575 19 12 19t.713.288Q13 19.575 13 20v2q0 .425-.287.712Q12.425 23 12 23ZM5.65 7.05L4.575 6q-.3-.275-.288-.7q.013-.425.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7q0 .4-.275.7q-.275.3-.687.287q-.413-.012-.713-.287ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712q0-.413.275-.688q.275-.3.688-.287q.412.012.712.287L19.425 18q.3.275.288.7q-.013.425-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.287-.688q.012-.412.287-.712L18 4.575q.275-.3.7-.288q.425.013.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275q-.4 0-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.713-.275q.412 0 .687.275q.3.275.288.688q-.013.412-.288.712L6 19.425q-.275.3-.7.287q-.425-.012-.725-.287Z" />
            </svg>
          </template>

          <template v-else>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#FFFFFB"
                d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025q.337.025.662.075q-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613q1.15-.612 1.875-1.637q.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Z" />
            </svg>
          </template>
        </button>

        <button title="Log `toObject`" @click="logToObject">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#292524"
              d="M20 19V7H4v12h16m0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16m-7 14v-2h5v2h-5m-3.42-4L5.57 9H8.4l3.3 3.3c.39.39.39 1.03 0 1.42L8.42 17H5.59l3.99-4Z" />
          </svg>
        </button>

        <button title="Log `toObject`" @click="logToObject">
          <svg width="16" viewBox="0 0 24 24" t="1690534723157" class="icon">
            <text font-size="2em" x="0" y="22">开</text>
          </svg>
        </button>

        <button title="Log `toObject`" @click="logToObject">
          <svg width="16" height="16" viewBox="0 0 24 24" t="1690534723157" class="icon">
            <text font-size="2em" x="0" y="22">关</text>
          </svg>
        </button>
      </Panel>
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, toRefs, watch } from 'vue';
import { Panel, VueFlow, isNode, useVueFlow, MarkerType, Position, Handle } from '@vue-flow/core'
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { ipcRenderer } from "electron";
import { useApiStore } from '@/stores';

const props = defineProps({
  workspacePath: {
    type: String,
    required: true, // 必传
  },
});

const { workspacePath } = toRefs(props);

const apiStore = useApiStore();

const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject, fitView } = useVueFlow()


const originData = ref([] as any);
// 高：60, 间距：100
const elements = ref([] as any);
onMounted(async () => {
  refresh();
});

const refresh = async () => {
  originData.value = ipcRenderer.sendSync('file:getApiList', workspacePath.value);
  console.log(originData.value);
  await nextTick();
  iniData();
  doLayout();
};

watch(() => apiStore.needRefresh, (newVal:any) => {
  console.log('apiStore.needRefresh: ', newVal);
  if (newVal) {
    setTimeout(() => {
      refresh();
    apiStore.setNeedRefresh(false);
  }, 400);
  }
}, { deep: true });

const iniData = () => {
  elements.value = [];
  const root = originData.value.find((x:any) => x.name === 'index.json');
  elements.value.push({ id: '0', type: 'custom', data: { route: root.data, type: 'file', fileName: 'index.json' }, label: 'API管理', position: { x: 0, y: 0 }, class: 'light', sourcePosition: Position.Right, targetPosition: Position.Left });
  for (let i = 0; i < originData.value.length; i++) {
    if (originData.value[i].name === 'index.json') continue;
    const id = originData.value[i].name;
    const label = originData.value[i].data.label || originData.value[i].data.name;
    elements.value.push({ id, label, position: { x: 200, y: 0 }, 
      data: { route: originData.value[i].data, type: 'file', fileName:  originData.value[i].name, fileData: originData.value[i].data }, class: 'light', sourcePosition: Position.Right, targetPosition: Position.Left });
    elements.value.push({ id: 'edge-' + `${originData.value[i].name}`, sourceHandle: 'a', source: '0', target: id, animated: true });

    for (let j = 0; j < originData.value[i].data.api.length; j++) {
      const subId = originData.value[i].data.api[j].name;
      const subLabel = originData.value[i].data.api[j].label || originData.value[i].data.api[j].name;
      elements.value.push({ 
          id: subId, 
          label: subLabel, 
          position: { x: 400, y: 0 }, 
          data: { route: originData.value[i].data.api[j], fileName: originData.value[i].name, type: 'api', fileData: originData.value[i].data },
          class: 'light', type: 'output', targetPosition: Position.Left });
      elements.value.push({ id: 'edge-' + subId , source: id, target: subId, animated: true, style: { stroke: '#10b981' } });

    }
  }
};


const doLayout = async () => {
  await nextTick();
  const LINE_HEIGHT = 50;
  const col2Edges = elements.value.filter((x:any) => x.source === '0');
  const col2Items = elements.value.filter((x:any) => col2Edges.find((y:any) => y.target === x.id));
  let y = 0;
  for (let i = 0; i < col2Items.length; i++) {
    if (col2Items[i].data.route.api.length > 0) {
      col2Items[i].position.y = y + LINE_HEIGHT * col2Items[i].data.route.api.length / 2 - 25;

      let y3 = y;
      const col3Edges = elements.value.filter((x:any) => x.source === col2Items[i].id);
        const col3Items = elements.value.filter((x:any) => col3Edges.find((y:any) => y.target === x.id));
        for (let k = 0; k < col3Items.length; k++) {
          col3Items[k].position.y = y3;
          y3 += LINE_HEIGHT;
        }

      y += LINE_HEIGHT * col2Items[i].data.route.api.length;
    } else {
      col2Items[i].position.y = y;
      y += LINE_HEIGHT;
    }
  }

  const rootNode = elements.value.find((x:any) => x.id === '0');
  rootNode.position.y = y / 2 - 50;

  fitView()
};


onPaneReady(({ fitView }) => {
  fitView()
})

const selectedNode = ref();

const appendChild = (node: any) => {
  const childs = node.data.data.api;
  if (childs.length % 2 === 0) {

    for (let i = 0; i < childs.length; i++) {
      const id = childs[i].name;
      const label = childs[i].label || childs[i].name;
      let yPosition = 0;
      const harfCount = childs.length / 2;

      if (i < harfCount) {
        yPosition = node.computedPosition.y - (i + 1) * 60;
      } else {
        yPosition = node.computedPosition.y + (i - 1) * 60;
      }
      elements.value.push({ id, label, position: { x: 400, y: yPosition }, class: 'light', type: 'output', targetPosition: Position.Left });
      elements.value.push({ id: node.id, source: node.id, target: id });

      //
    }
  } else {

  }
  fitView({ duration: 500, padding: 1.5 })
};

const nodeClickHandler = (props: any) => {
  // console.log('props: ', props);
  if (selectedNode?.value?.id === props?.node?.id) return;
  selectedNode.value = props.node;
  apiStore.setSelectedRoute(props.node.data);
};

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
  return elements.value.forEach((el: any) => {
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


const sourceHandleStyleA = computed(() => ({ backgroundColor: 'blue', filter: 'invert(100%)', top: '50%' }));
</script>

<style>
.box {
  height: 100%;
  width: 100%;
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.basicflow.dark {
  background: #57534e;
  color: #fffffb
}

.basicflow.dark .vue-flow__node {
  background: #292524;
  color: #fffffb
}

.basicflow.dark .vue-flow__controls .vue-flow__controls-button {
  background: #292524;
  fill: #fffffb;
  border-color: #fffffb
}

.basicflow.dark .vue-flow__edge-textbg {
  fill: #292524
}

.basicflow.dark .vue-flow__edge-text {
  fill: #fffffb
}

.basicflow .controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px
}

.basicflow .controls button {
  padding: 4px;
  border-radius: 5px;
  font-weight: 600;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .3);
  box-shadow: 0 5px 10px #0000004d;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center
}

.basicflow .controls button:hover {
  transform: scale(102%);
  transition: .25s all ease
}

.api-root {
  width: 120px; height: 40px; font-size: 14px; display: flex; align-items: center; justify-content: center; border-radius: 5px; background: linear-gradient(to right, transparent, lightBlue);
}

.vue-flow__node.selected {
  border: 1px solid #909090;
}
</style>