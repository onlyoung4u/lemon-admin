<script setup lang="ts">
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from '@wangeditor-next/editor';

import type { Recordable } from '@vben/types';

import { onBeforeUnmount, ref, shallowRef } from 'vue';

import { useAppConfig } from '@vben/hooks';
import { useAccessStore } from '@vben/stores';

import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { message } from 'ant-design-vue';

import '@wangeditor-next/editor/dist/css/style.css';

type InsertFnType = (url: string) => void;

interface Props {
  value?: string;
}

interface Emits {
  (e: 'update:value', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
});

const emit = defineEmits<Emits>();

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
const accessStore = useAccessStore();
const editorRef = shallowRef<IDomEditor | undefined>(undefined);

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) editor.destroy();
});

const toolbarConfig = ref<Partial<IToolbarConfig>>({
  excludeKeys: ['uploadVideo'],
});
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: `${apiURL}/upload`,
      fieldName: 'file',
      metaWithUrl: false,
      base64LimitSize: 0,
      headers: {
        // @ts-ignore
        Authorization: `Bearer ${accessStore.accessToken}`,
      },
      customInsert(res: Recordable<any>, insertFn: InsertFnType) {
        const { code, data } = res;
        if (code === 0) {
          insertFn(data.url);
        } else {
          message.error('上传失败');
        }
      },
    },
  },
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

const handleChange = (editor: IDomEditor) => {
  let value = editor.getHtml();
  if (value === '<p><br></p>') value = '';
  emit('update:value', value);
};
</script>

<template>
  <div class="wang-editor-container">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="default"
      style="border-bottom: 1px solid hsl(240deg 5.9% 90%)"
    />
    <Editor
      :default-config="editorConfig"
      mode="default"
      :model-value="props.value"
      style="height: 400px; overflow-y: hidden"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.wang-editor-container {
  border: 1px solid hsl(240deg 5.9% 90%);
}
</style>
