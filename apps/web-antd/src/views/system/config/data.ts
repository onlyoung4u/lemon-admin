import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { formatDateTime } from '@vben/utils';

import { z } from '#/adapter/form';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '配置名称',
      rules: z
        .string()
        .min(2, '配置名称不能少于2位')
        .max(60, '配置名称不能大于60位'),
    },
    {
      component: 'Input',
      fieldName: 'key',
      label: '键名',
      rules: z.string().min(2, '键名不能少于2位').max(60, '键名不能大于60位'),
    },
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '启用',
        unCheckedChildren: '禁用',
      },
      fieldName: 'isActive',
      label: '状态',
      defaultValue: true,
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 10,
      },
      fieldName: 'value',
      label: '配置值',
      rules: 'required',
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 4,
      },
      fieldName: 'remark',
      label: '备注',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '配置名称',
    },
    {
      component: 'Input',
      fieldName: 'key',
      label: '键名',
    },
  ];
}

export function getStatusOptions() {
  return [
    { color: 'success', label: '启用', value: true },
    { color: 'error', label: '禁用', value: false },
  ];
}

export function useColumns<T = Recordable<number | string>>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 100,
    },
    {
      field: 'name',
      title: '配置名称',
      width: 200,
    },
    {
      field: 'key',
      title: '键名',
      width: 200,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getStatusOptions(),
      },
      field: 'isActive',
      title: '状态',
      width: 200,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 250,
      formatter: ({ cellValue }) => formatDateTime(cellValue),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '配置名称',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: '编辑',
            permission: 'config.update',
          },
          {
            code: 'delete',
            text: '删除',
            permission: 'config.delete',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      minWidth: 200,
    },
  ];
}
