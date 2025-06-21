import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getLogList(params: Recordable<any>) {
  return requestClient.get('/system/log', {
    params,
  });
}
