<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLogList } from '#/api';

import { useColumns, useGridFormSchema } from './data';

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getLogList({
            page: page.currentPage,
            limit: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
      search: true,
    },
  } as VxeTableGridOptions,
});
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="操作日志列表">
      <template #user="{ row }">
        <Tag v-if="row.userId === 0">未登录</Tag>
        <template v-else>
          <Tag color="orange"> ID:{{ row.userId }} </Tag>
          <Tag color="blue"> {{ row.nickname }}@{{ row.username }} </Tag>
        </template>
      </template>
    </Grid>
  </Page>
</template>
