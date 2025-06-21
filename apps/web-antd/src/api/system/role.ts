import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getUserRole() {
  return requestClient.get('/system/role/user');
}

export async function getRoleList(params: Recordable<number | string>) {
  return requestClient.get('/system/role', {
    params,
  });
}

export async function createRole(data: Recordable<any>) {
  return requestClient.post('/system/role', data);
}

export async function updateRole(id: number, data: Recordable<any>) {
  return requestClient.put(`/system/role/${id}`, data);
}

export async function deleteRole(id: number) {
  return requestClient.delete(`/system/role/${id}`);
}
