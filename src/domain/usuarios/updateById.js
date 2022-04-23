import {isEmpty, isNil} from 'lodash';
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
      hasAcceptedTerms,
      password,
      confirmationPassword,
      data,
    } = objectToSend;

    const obj = {
      type,
      active,
      username,
      email,
      name,
      has_accepted_terms: hasAcceptedTerms,
      password,
      confirmation_password: confirmationPassword,
      data,
    };

    await api.put(`users/${userId}`, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Informações Atualizadas!');
  } catch (e) {
    alert('Erro ao submeter informações');
  }
}
