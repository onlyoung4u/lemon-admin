import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { formatDateTime } from '@vben/utils';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
      },
      fieldName: 'userId',
      label: '用户ID',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
      fieldName: 'method',
      label: '请求方式',
    },
    {
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      fieldName: 'startTime',
      label: '开始时间',
    },
    {
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      fieldName: 'endTime',
      label: '结束时间',
    },
  ];
}

export function getMethodOptions() {
  return [
    { color: 'default', label: 'GET', value: 'GET' },
    { color: '#2db7f5', label: 'POST', value: 'POST' },
    { color: '#87d068', label: 'PUT', value: 'PUT' },
    { color: '#f50', label: 'DELETE', value: 'DELETE' },
  ];
}

export function getStatusOptions() {
  return [
    { color: 'success', label: '成功', value: true },
    { color: 'error', label: '失败', value: false },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      align: 'left',
      field: 'userId',
      slots: { default: 'user' },
      title: '用户',
      width: 200,
    },
    {
      cellRender: { name: 'CellTag', options: getMethodOptions() },
      field: 'method',
      title: '请求方式',
      width: 100,
    },
    {
      align: 'left',
      field: 'description',
      title: '路由',
      width: 150,
    },
    {
      align: 'left',
      field: 'path',
      title: '路径',
      width: 200,
    },
    {
      field: 'ip',
      title: 'IP',
      width: 100,
    },
    {
      field: 'createdAt',
      title: '时间',
      width: 200,
      formatter: ({ cellValue }) => formatDateTime(cellValue),
    },
    {
      cellRender: { name: 'CellTag', options: getStatusOptions() },
      field: 'success',
      title: '状态',
      width: 100,
    },
    {
      align: 'left',
      field: 'body',
      title: '请求体',
      minWidth: 220,
    },
  ];
}
