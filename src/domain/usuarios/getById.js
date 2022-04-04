import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';
import stringify from '../../utils/stringify';

export default async function getById(token, userId, withData = false) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const queryString = {};
  if (withData) queryString.with_data = true;

  try {
    const response = await api.get(`users/${userId}${stringify(queryString)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (e) {
    alert('Erro ao encontar informações');
    return null;
  }
}
