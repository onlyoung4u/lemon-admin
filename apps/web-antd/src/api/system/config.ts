import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getConfigList(params: Recordable<number | string>) {
  return requestClient.get('/system/config', {
    params,
  });
}

export async function getConfig(id: number | string) {
  return requestClient.get(`/system/config/${id}`);
}

export async function createConfig(data: Recordable<any>) {
  return requestClient.post('/system/config', data);
}

export async function updateConfig(id: number, data: Recordable<any>) {
  return requestClient.put(`/system/config/${id}`, data);
}

export async function deleteConfig(id: number) {
  return requestClient.delete(`/system/config/${id}`);
}
