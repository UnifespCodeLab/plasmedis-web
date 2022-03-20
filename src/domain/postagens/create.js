import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function create(token, newPostagem, currentUserId) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const {title, category, description} = newPostagem;

  const objToSend = {
    texto: description,
    titulo: title,
    categoria: category || 0,
  };

  try {
    await api.post('posts', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert('Ocorreu um erro ao criar a postagem. Verifique com o administrador');
  }
}
