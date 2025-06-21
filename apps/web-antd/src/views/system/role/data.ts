import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { formatDateTime } from '@vben/utils';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: '权限设置',
      modelPropName: 'modelValue',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
    },
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
      title: '角色名称',
      width: 200,
    },
    {
      field: 'creator.nickname',
      title: '创建人',
      minWidth: 200,
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
          nameTitle: '角色名称',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: '编辑',
            permission: 'role.update',
          },
          {
            code: 'delete',
            text: '删除',
            permission: 'role.delete',
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
