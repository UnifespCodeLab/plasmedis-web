import {isEmpty, isNil, isString} from 'lodash';
import api from '../../services/api';

export default async function (token, id, updatedComment) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  console.log('token is here: ', token);
  console.log('Id is here now: ', id);

  if (isNil(id) || (isEmpty(id) && isString(id)))
    throw new Error('ID do comentário não foi informado');

  const objToSend = {
    texto: updatedComment,
  };

  try {
    await api.patch(`/comments/${id}`, objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert(
      'Ocorreu um erro ao atualizar o comentário. Verifique com o administrador',
    );
  }
}
