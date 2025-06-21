<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createConfig, getConfig, updateConfig } from '#/api/system';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<Recordable<any>>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateConfig(id.value, values) : createConfig(values))
      .then(() => {
        message.success('操作成功');
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<Recordable<any>>();
      formApi.resetForm();
      if (data.id) {
        const res = await getConfig(data.id);
        formData.value = res;
        id.value = res.id;
        formApi.setValues(res);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id ? '编辑配置' : '添加配置';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
