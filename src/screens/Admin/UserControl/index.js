import {get} from 'lodash';
import React, {useContext, useState, useEffect} from 'react';
import {toast} from 'react-toastify';

import {
  Box,
  Button,
  Input,
  InputGroup,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  Thead,
  Select,
} from '@chakra-ui/react';

import {Flex} from '@chakra-ui/layout';
import {useHistory} from 'react-router-dom';
import * as S from './styles';

import {
  getAll,
  getByEmailOrUsername,
  updateById,
} from '../../../domain/usuarios';

import * as Privilegio from '../../../domain/privilegios';
import {Context as AuthContext} from '../../../components/stores/Auth';

const UserControl = () => {
  const {user, token} = useContext(AuthContext);
  const history = useHistory();

  const [users, setUsers] = useState(null);
  const [typeData, setTypeData] = useState(null);

  const [emailFilter, setEmailFilter] = useState(null);
  const [usernameFilter, setUsernameFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      // eslint-disable-next-line no-shadow
      const users = getAll(token);
      const types = await Privilegio.getAll(token);

      setTypeData(types);

      const result = (await users).users;
      formatUsers(result);
    };

    fetch();
  }, []);

  useEffect(() => {
    const canEditUsers = [1, 2];

    if (!canEditUsers.includes(user.type)) {
      history.push('/');
    }
  }, []);

  const updateUserStatus = async (target, userId) => {
    switch (target.value) {
      case 'ativar':
        await updateById(token, userId, {active: true});
        break;

      case 'inativar':
        await updateById(token, userId, {active: false});
        break;

      default:
        break;
    }
  };

  const formatUsers = (listUsers) => {
    const formattedUsers = listUsers.map((item) => ({
      ...item,
      typeName: typeData.find((type) => type.id === item.type)?.type ?? '???',
    }));

    setUsers(formattedUsers);
  };

  const filterUsers = async () => {
    setLoading(true);
    try {
      const result = await getByEmailOrUsername(
        token,
        emailFilter,
        usernameFilter,
      );

      formatUsers(result.users);
    } catch (error) {
      toast.error('Erro ao pesquisar usuários');
      console.log(error);
    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      filterUsers();
    }
  };

  return (
    <S.Wrapper px={{base: 0, lg: 4}}>
      <S.Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
        Controle de usuários
      </S.Text>

      <Flex direction="row" mb={4} alignItems="center">
        <Input
          color="#000"
          type="text"
          width="50%"
          mr={4}
          placeholder="Filtrar por email"
          value={emailFilter}
          onInput={(event) => setEmailFilter(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <S.Text color="#2f7384" mr={4}>
          e/ou
        </S.Text>
        <Input
          color="#000"
          type="text"
          width="50%"
          mr={4}
          placeholder="Filtrar pelo nome de usuário"
          value={usernameFilter}
          onInput={(event) => setUsernameFilter(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          colorScheme="primary"
          isLoading={loading}
          onClick={() => filterUsers()}>
          Pesquisar
        </Button>
      </Flex>

      <Box
        borderRadius={10}
        bg={{base: 'white', lg: 'white'}}
        color={{base: 'white', lg: 'white'}}
        boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
        <Table variant="striped" color="black" colorScheme="blackAlpha">
          <Thead>
            <Tr bg="primary.600">
              <Th color="white">ID</Th>
              <Th color="white">Nome</Th>
              <Th color="white">Email</Th>
              <Th color="white">Privilégio</Th>
              <Th color="white">Situação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users &&
              users.map((currentUser) => (
                <Tr key={currentUser.id}>
                  <Td>{currentUser.id}</Td>
                  <Td>{currentUser.username}</Td>
                  <Td>{currentUser.email}</Td>
                  <Td>{currentUser.typeName}</Td>
                  <Td>
                    <Select
                      onChange={(e) =>
                        updateUserStatus(e.target, currentUser.id)
                      }
                      size="sm">
                      <option selected={!currentUser.active} value="inativar">
                        Inativo
                      </option>
                      <option selected={currentUser.active} value="ativar">
                        Ativo
                      </option>
                    </Select>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </S.Wrapper>
  );
};

export default UserControl;
