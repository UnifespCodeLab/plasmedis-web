import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function create(token, newNotificacao) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const {userId, content, actionType, actionObjectId} = newNotificacao;

  const objToSend = {
    user_id: userId,
    content,
    action_type: actionType,
    action_object_id: actionObjectId,
  };

  try {
    await api.post('notifications', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert(
      'Ocorreu um erro ao criar a notificacao. Verifique com o administrador',
    );
  }
}
