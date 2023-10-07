import {get, has, isEmpty, isNil, isString} from 'lodash';
import api from '../../services/api';

// eslint-disable-next-line func-names
export default async function (token, ids) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  if (isNil(ids) || (isEmpty(ids) && isString(ids)))
    throw new Error('Ids das notificações não foram informados');

  const objToSend = {
    ids,
  };

  try {
    const response = await api.post(`/notifications/bulk-read`, objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(response, 'data')) return null;

    return get(response, 'data.message');
  } catch (error) {
    alert('Erro ao marcar notificações como lidas');
    return null;
  }
}
