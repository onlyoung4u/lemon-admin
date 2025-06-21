<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { useAccess } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUser, getUserList, updateUserStatus } from '#/api';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { hasAccessByCodes } = useAccess();
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getUserList({
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
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<Recordable<any>>,
});

function onActionClick(e: OnActionClickParams<Recordable<any>>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

/**
 * 将Antd的Modal.confirm封装为promise，方便在异步函数中调用。
 * @param content 提示内容
 * @param title 提示标题
 */
function confirm(content: string, title: string) {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        reslove(true);
      },
      title,
    });
  });
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: boolean, row: Recordable<any>) {
  if (!hasAccessByCodes(['user.update'])) {
    message.error('无权限');
    return false;
  }

  try {
    await confirm(
      `你要将${row.username}的状态切换为 【${newStatus ? '启用' : '禁用'}】 吗？`,
      `切换状态`,
    );
    await updateUserStatus(row.id, newStatus);
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: Recordable<any>) {
  const data = {
    ...row,
    roles: row.roles.map((item: Recordable<any>) => item.id),
  };
  formDrawerApi.setData(data).open();
}

function onDelete(row: Recordable<any>) {
  const hideLoading = message.loading({
    content: `正在删除${row.username}`,
    duration: 0,
    key: 'action_process_msg',
  });
  deleteUser(row.id)
    .then(() => {
      message.success({
        content: `删除${row.username}成功`,
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button v-access:code="'user.create'" type="primary" @click="onCreate">
          <Plus class="size-5" />
          添加用户
        </Button>
      </template>
    </Grid>
  </Page>
</template>
