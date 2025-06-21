import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getUserMenu() {
  return requestClient.get('/system/menu/user');
}

export async function getMenuList(withButton: boolean = true) {
  return requestClient.get('/system/menu', {
    params: {
      withButton,
    },
  });
}

export async function createMenu(data: Recordable<any>) {
  return requestClient.post('/system/menu', data);
}

export async function updateMenu(id: number, data: Recordable<any>) {
  return requestClient.put(`/system/menu/${id}`, data);
}

export async function deleteMenu(id: number) {
  return requestClient.delete(`/system/menu/${id}`);
}
