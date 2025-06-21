import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getUserList(params: Recordable<number | string>) {
  return requestClient.get('/system/user', {
    params,
  });
}

export async function createUser(data: Recordable<any>) {
  return requestClient.post('/system/user', data);
}

export async function updateUser(id: number, data: Recordable<any>) {
  return requestClient.put(`/system/user/${id}`, data);
}

export async function updateUserStatus(id: number, isActive: boolean) {
  return requestClient.put(`/system/user/${id}/active`, {
    isActive,
  });
}

export async function deleteUser(id: number) {
  return requestClient.delete(`/system/user/${id}`);
}
