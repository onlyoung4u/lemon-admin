<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/system';

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
    (id.value ? updateUser(id.value, values) : createUser(values))
      .then(() => {
        message.success('操作成功');
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<Recordable<any>>();
      const isEditMode = !!data.id;

      // 更新表单schema，根据是否是编辑模式来设置password字段的验证规则
      formApi.updateSchema(useFormSchema(isEditMode));

      formApi.resetForm();
      if (data.id) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id ? '编辑用户' : '添加用户';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
