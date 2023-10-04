import {get, has, isEmpty, isNil, isString} from 'lodash';
import moment from 'moment';
import stringify from '../../utils/stringify';

import api from '../../services/api';

// eslint-disable-next-line func-names
export default async function (token, id, page, limit) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  if (isNil(id) || (isEmpty(id) && isString(id)))
    throw new Error('Id do usuário não foi informado');

  const queryString = {};
  if (page != null) queryString.page = page;
  if (limit != null) queryString.limit = limit;

  try {
    const noitificationsPage = await api.get(
      `/notifications/user/${id}${stringify(queryString)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!has(noitificationsPage, 'data')) return null;

    return {
      notifications: get(noitificationsPage, 'data.notifications', []).map(
        (notification) => ({
          id: get(notification, 'id'),
          content: get(notification, 'content'),
          read: get(notification, 'read'),
          created_date: moment(`${get(notification, 'created_date')}Z`),
        }),
      ),
      count: get(noitificationsPage, 'data.count'),
      current: get(noitificationsPage, 'data.current'),
      limit: get(noitificationsPage, 'data.limit'),
      next: get(noitificationsPage, 'data.next'),
      previous: get(noitificationsPage, 'data.previous'),
    };
  } catch (error) {
    alert('Erro ao buscar notificações de usuário');
    return null;
  }
}
