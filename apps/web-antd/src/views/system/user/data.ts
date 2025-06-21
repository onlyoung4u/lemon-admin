import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { formatDateTime } from '@vben/utils';

import { z } from '#/adapter/form';
import { getUserRole } from '#/api';

export function useFormSchema(isEdit = false): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      rules: z
        .string()
        .min(2, '名称不能少于2位')
        .max(10, '名称不能大于10位')
        .regex(/^[a-z0-9]+$/i, '只能输入数字和字母'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '名称',
      rules: z.string().min(2, '名称不能少于2位').max(10, '名称不能大于10位'),
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      rules: isEdit
        ? z
            .string()
            .min(6, '密码不能少于6位')
            .max(20, '密码不能大于20位')
            .optional()
        : z.string().min(6, '密码不能少于6位').max(20, '密码不能大于20位'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: getUserRole,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        mode: 'multiple',
      },
      fieldName: 'roles',
      label: '角色',
      rules: 'required',
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
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        precision: 0,
      },
      fieldName: 'userId',
      label: '用户ID',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '名称',
    },
  ];
}

export function useColumns<T = Recordable<number | string>>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 100,
    },
    {
      field: 'username',
      title: '用户名',
      width: 200,
    },
    {
      field: 'nickname',
      title: '名称',
      width: 200,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
        props: {
          checkedValue: true,
          unCheckedValue: false,
        },
      },
      field: 'isActive',
      title: '状态',
      width: 200,
    },
    {
      field: 'roles',
      title: '角色',
      minWidth: 200,
      formatter: ({ cellValue }) => {
        return cellValue.map((item: Recordable<any>) => item.name).join(',');
      },
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
          nameField: 'username',
          nameTitle: '用户名',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: '编辑',
            permission: 'user.update',
          },
          {
            code: 'delete',
            text: '删除',
            permission: 'user.delete',
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
