<script setup lang="ts">
import { ref } from 'vue';
import { decode as decodeBase64, encode as encodeBase64 } from '../../invokes/base64';
import HeaderBar from './header-bar.vue';

const text = ref('');
const result = ref('');

async function encode(): Promise<void> {
  result.value = await encodeBase64(text.value)
}

async function decode(): Promise<void> {
  result.value = await decodeBase64(text.value)
}
</script>

<template>
  <div class="base64-page">
    <HeaderBar />
    <div>
      <textarea v-model="text"></textarea>
    </div>
    <button type="button" @click="encode">编码</button>
    <button type="button" @click="decode">解码</button>
    <div>
      {{ result }}
    </div>
  </div>
</template>

<style scoped lang="less"></style>