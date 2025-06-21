<script setup lang="ts">
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, reactive, ref } from 'vue';

import { useVbenForm, useVbenModal, VbenButton, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { changePasswordApi } from '#/api';

defineOptions({
  name: 'ChangePasswordModal',
});

const emit = defineEmits<{
  submit: [];
}>();

const loading = ref(false);

const [Form, { resetForm, validate, getValues }] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: false,
      hideRequiredMark: true,
    },
    schema: computed((): VbenFormSchema[] => [
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: '请输入原密码',
        },
        fieldName: 'oldPassword',
        label: '原密码',
        rules: z.string().min(6, { message: '密码至少需要6位字符' }).max(16, {
          message: '密码长度不能超过16位',
        }),
      },
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: '请输入新密码',
        },
        fieldName: 'newPassword',
        label: '新密码',
        rules: z.string().min(6, { message: '密码至少需要6位字符' }).max(16, {
          message: '密码长度不能超过16位',
        }),
      },
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: '请重复输入新密码',
        },
        dependencies: {
          rules(values: any) {
            const { newPassword } = values;
            return z
              .string({ required_error: '请重复输入新密码' })
              .min(1, { message: '请重复输入新密码' })
              .refine((value: any) => value === newPassword, {
                message: '两次输入的密码不一致',
              });
          },
          triggerFields: ['newPassword'],
        },
        fieldName: 'confirmPassword',
        label: '重复新密码',
      },
    ]),
    showDefaultActions: false,
  }),
);

const [Modal] = useVbenModal({
  onConfirm() {
    handleSubmit();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      resetForm();
    }
  },
});

async function handleSubmit() {
  try {
    loading.value = true;
    const { valid } = await validate();
    const values = await getValues();
    if (valid) {
      await changePasswordApi({
        oldPassword: values?.oldPassword,
        newPassword: values?.newPassword,
      });

      message.success('密码修改成功');

      emit('submit');
    }
  } catch (error) {
    console.error('修改密码失败:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Modal :footer="false" :fullscreen-button="false" title="修改密码">
    <div class="p-6">
      <Form />
      <div class="mt-6 flex justify-end space-x-3">
        <VbenButton :loading="loading" @click="handleSubmit">
          确认修改
        </VbenButton>
      </div>
    </div>
  </Modal>
</template>
