import type { Recordable } from '@vben/types';

import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

export function getMenuTypeOptions() {
  return [
    { color: 'processing', label: '菜单', value: 1 },
    { color: 'success', label: '按钮', value: 2 },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn,
): VxeTableGridOptions['columns'] {
  return [
    {
      align: 'left',
      field: 'title',
      fixed: 'left',
      slots: { default: 'title' },
      title: '名称',
      treeNode: true,
      width: 300,
    },
    {
      align: 'center',
      cellRender: { name: 'CellTag', options: getMenuTypeOptions() },
      field: 'menuType',
      title: '类型',
      width: 150,
    },
    {
      field: 'permission',
      title: '权限',
      width: 300,
    },
    {
      align: 'left',
      field: 'path',
      title: '路径',
      width: 200,
    },
    {
      align: 'center',
      field: 'sort',
      title: '排序',
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增下级',
            permission: 'menu.create',
            show: (row: Recordable<any>) => row.menuType === 1,
          },
          {
            code: 'edit',
            text: '编辑',
            permission: 'menu.update',
            show: (row: Recordable<any>) => !row.isSystem,
          },
          {
            code: 'delete',
            text: '删除',
            permission: 'menu.delete',
            show: (row: Recordable<any>) => !row.isSystem,
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: '操作',
    },
  ];
}
