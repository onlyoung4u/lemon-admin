<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

import { useVbenForm, z } from '#/adapter/form';
import { createMenu, getMenuList, updateMenu } from '#/api/system/menu';

import { getMenuTypeOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();
const menuTree = ref<Recordable<any>[]>([]);
const formData = ref<Recordable<any>>();
const isEdit = computed(() => !!formData.value?.id);
const schema: VbenFormSchema[] = [
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getMenuTypeOptions(),
      optionType: 'button',
      disabled: true,
    },
    defaultValue: 1,
    fieldName: 'menuType',
    formItemClass: 'col-span-2 md:col-span-2',
    label: '类型',
  },
  {
    component: 'TreeSelect',
    componentProps: {
      treeData: menuTree,
      class: 'w-full',
      filterTreeNode(input: string, node: Recordable<any>) {
        if (!input || input.length === 0) {
          return true;
        }
        const title: string = node.meta?.title ?? '';
        if (!title) return false;
        return title.includes(input);
      },
      getPopupContainer,
      fieldNames: { children: 'children', label: 'title', value: 'id' },
      showSearch: true,
      treeDefaultExpandAll: true,
      placeholder: '请选择',
      disabled: isEdit,
      async onChange(value: number) {
        let menuType = 1;
        if (value) {
          const selectedNode = getNodeById(value);
          if (selectedNode) {
            const hasChildren =
              selectedNode.children && selectedNode.children.length > 0;
            if (!hasChildren) menuType = 2;
          }
        }

        await formApi.setFieldValue('menuType', menuType);
      },
    },
    fieldName: 'parentId',
    label: '上级菜单',
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '名称',
    rules: z
      .string()
      .min(2, '名称不能少于2个字符')
      .max(30, '名称不能超过30个字符'),
  },
  {
    component: 'Input',
    fieldName: 'permission',
    label: '权限',
    rules: z
      .string()
      .min(2, '权限不能少于2个字符')
      .max(20, '权限不能超过20个字符'),
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 100,
      precision: 0,
    },
    fieldName: 'sort',
    label: '排序',
    rules: z.number().min(0, '排序不能小于0').max(100, '排序不能大于100'),
  },
  {
    component: 'Input',
    dependencies: {
      show: (values) => values.menuType === 1,
      triggerFields: ['menuType'],
    },
    fieldName: 'path',
    label: '路径',
    rules: z
      .string()
      .min(2, '路径不能少于2个字符')
      .max(20, '路径不能超过20个字符')
      .refine((value: string) => {
        return value.startsWith('/');
      }, '路径必须以/开头'),
  },
  {
    component: 'IconPicker',
    componentProps: {
      prefix: 'carbon',
    },
    dependencies: {
      show: (values) => values.menuType === 1,
      triggerFields: ['menuType'],
    },
    fieldName: 'icon',
    label: '图标',
  },
  {
    component: 'Input',
    dependencies: {
      show: (values) => values.menuType === 1,
      triggerFields: ['menuType'],
    },
    fieldName: 'link',
    label: '链接',
    rules: z
      .string()
      .refine((value) => {
        return !value || z.string().url().safeParse(value).success;
      }, '链接格式不正确')
      .optional(),
  },
];

const breakpoints = useBreakpoints(breakpointsTailwind);
const isHorizontal = computed(() => breakpoints.greaterOrEqual('md').value);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

function getNodeById(id: number): null | Recordable<any> {
  if (!id || !menuTree.value || menuTree.value.length === 0) {
    return null;
  }

  function findNodeRecursive(nodes: Recordable<any>[]): null | Recordable<any> {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (
        node.children &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        const found = findNodeRecursive(node.children);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  return findNodeRecursive(menuTree.value);
}

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      menuTree.value = await getMenuList(false);
      const data = drawerApi.getData<Recordable<number | string>>();
      if (data.id) {
        formData.value = data;
        formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    drawerApi.lock();
    const data = await formApi.getValues<Recordable<number | string>>();
    try {
      await (formData.value?.id
        ? updateMenu(formData.value.id, data)
        : createMenu(data));
      drawerApi.close();
      emit('success');
    } finally {
      drawerApi.unlock();
    }
  }
}
const getDrawerTitle = computed(() =>
  formData.value?.id ? '编辑菜单' : '添加菜单',
);
</script>

<template>
  <Drawer class="w-full max-w-[800px]" :title="getDrawerTitle">
    <Form class="mx-4" :layout="isHorizontal ? 'horizontal' : 'vertical'" />
  </Drawer>
</template>
