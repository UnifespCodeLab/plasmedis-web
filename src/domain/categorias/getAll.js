import {get, has, isEmpty, isNil} from 'lodash';

import api from '../../services/api';

export default async function getAll(token) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const categorias = await api.get('categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(categorias, 'data')) return null;

    return get(categorias, 'data.categories', []).map((categoria) => ({
      id: get(categoria, 'id'),
      name: get(categoria, 'name'),
      posts: get(categoria, 'posts'),
    }));
  } catch (error) {
    alert('Erro ao buscar as categorias');
    return null;
  }
}
