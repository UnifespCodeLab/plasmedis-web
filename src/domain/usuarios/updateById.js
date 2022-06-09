/* eslint-disable camelcase */
import {isEmpty, isNil, get} from 'lodash';
import api from '../../services/api';

export default async function updateById(token, userId, objectToSend) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const {
      type,
      active,
      username,
      email,
      name,
      has_accepted_terms,
      current_password,
      password,
      confirmation_password,
      data,
    } = objectToSend;

    const obj = {
      type,
      active,
      username,
      email,
      name,
      has_accepted_terms,
      current_password,
      password,
      confirmation_password,
      data,
    };

    const response = await api.put(`users/${userId}`, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (get(response, 'data.success', false)) alert('Informações Atualizadas!');
    else alert(get(response, 'data.message', 'Erro ao submeter informações'));
  } catch (e) {
    alert('Erro ao submeter informações');
  }
}
