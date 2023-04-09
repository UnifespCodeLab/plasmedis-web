import {get, has, isEmpty, isNil} from 'lodash';
import moment from 'moment';
import stringify from '../../utils/stringify';

import api from '../../services/api';

export default async function getAll(
  token,
  {recommended = null, category = null, neighborhood = null} = {},
) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const queryString = {};
  if (recommended != null) queryString.recommended = recommended;
  if (category != null) queryString.category = category;

  try {
    const posts = await api.get(`posts${stringify(queryString)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(posts, 'data')) return null;

    return get(posts, 'data.posts', []).map((post) => ({
      id: get(post, 'id'),
      title: get(post, 'titulo'),
      description: get(post, 'texto'),
      category: {
        id: get(post, 'categoria'),
        name: '<API NÃO ESTÁ ENVIANDO>',
      },
      author: {
        id: get(post, 'created.user'),
        name: get(post, 'created.name'),
        avatar: '<API NÃO ESTÁ ENVIANDO>',
      },
      dateTime: moment(`${get(post, 'created.date')}Z`),
      verified: get(post, 'selo'),
      comments: get(post, 'comments_count', 0),
    }));
  } catch (error) {
    alert('Erro ao buscar as postagens');
    return null;
  }
}
