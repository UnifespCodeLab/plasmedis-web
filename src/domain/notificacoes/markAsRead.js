import {get, has, isEmpty, isNil, isString} from 'lodash';
import api from '../../services/api';

// eslint-disable-next-line func-names
export default async function (token, id) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  if (isNil(id) || (isEmpty(id) && isString(id)))
    throw new Error('Id da notificação não foi informado');

  try {
    const response = await api.put(`/notifications/${id}/read`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(response, 'data')) return null;

    return get(response, 'data.message');
  } catch (error) {
    alert('Erro ao marcar notificação como lida');
    return null;
  }
}
