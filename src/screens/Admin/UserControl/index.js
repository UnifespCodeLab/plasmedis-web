/* eslint-disable react/forbid-prop-types */
import {get, set, isEmpty, isNil} from 'lodash';

import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Input,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  Thead,
  Select,
  Icon,
  useDisclosure,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button';
import {useHistory} from 'react-router-dom';
import {Flex} from '@chakra-ui/layout';
import {MdEdit} from 'react-icons/md';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import * as S from './styles';

import Form from '../../../components/elements/Form';

import * as Usuarios from '../../../domain/usuarios';
import * as Privilegios from '../../../domain/privilegios';

import {Context as AuthContext} from '../../../components/stores/Auth';

const UserControl = () => {
  const {user, token} = useContext(AuthContext);
  const history = useHistory();

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [users, setUsers] = useState(null);
  const [typeData, setTypeData] = useState([]);

  const [emailFilter, setEmailFilter] = useState(null);
  const [usernameFilter, setUsernameFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  const [savingUser, setSavingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [checkingUsernameAvailability, setCheckingUsernameAvailability] =
    useState(false);
  const [usernameChecked, setUsernamedChecked] = useState(null);
  const latestCheckUniqueUsername = useRef(null);

  const selectUser = useCallback(
    (userRow) => {
      const fetchUserData = async () => {
        const result = await Usuarios.getById(token, userRow.id, true);

        const parsedResult = {
          index: userRow.index,
          ...result,
          created: {
            ...result.created,
            date: result.created.date.toDate(),
          },
          updated: {
            ...result.updated,
            date: result.updated.date.toDate(),
          },
          data: {
            ...result.data,
            nascimento: result.data.nascimento.isValid()
              ? result.data.nascimento.toDate()
              : undefined,
          },
        };

        setInputs(parsedResult);
        setSelectedUser(parsedResult);
      };

      fetchUserData();
    },
    [token],
  );

  // FORM UPKEEPING
  const schema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string()
        .required('O campo "Nome de Usuário" é obrigatório')
        .test(
          'checkUniqueUsername',
          <span>
            Esse nome de usuário <b>não</b> está disponível
          </span>,
          async (value) => {
            if (value === get(selectedUser, 'username')) return true;

            setCheckingUsernameAvailability(true);

            if (!isEmpty(value) && !isNil(value)) {
              try {
                await Usuarios.verifyUsername(token, value);

                setCheckingUsernameAvailability(false);
                setUsernamedChecked(value);
                latestCheckUniqueUsername.current = true;
                return true;
              } catch (error) {
                const {status} = error.response;
                if (status === 400) {
                  setUsernamedChecked(value);
                  setCheckingUsernameAvailability(false);
                  latestCheckUniqueUsername.current = true;
                  return false;
                }

                alert(
                  'Não foi possível verificar a disponibilidade do nome de usuário',
                ); // TODO: transformar em alert amigável

                setUsernamedChecked(value);
                setCheckingUsernameAvailability(false);
                latestCheckUniqueUsername.current = true;
                return true;
              }
            }

            setCheckingUsernameAvailability(false);
            return false;
          },
        ),
      email: Yup.string().email('Insira um e-mail válido'),
      name: Yup.string().required('O campo "Nome" é obrigatório'),
      data: Yup.object({
        genero: Yup.string().required('O campo "Gênero" é obrigatório'),
        nascimento: Yup.date().required(
          'O campo "Data de Nascimento" é obrigatório',
        ),
        area_atuacao: Yup.string().required(
          'O campo "Área de Atuação" é obrigatório',
        ),
        instituicao: Yup.string().required(
          'O campo "Instituição" é obrigatório',
        ),
        campus: Yup.string(),
        setor: Yup.string(),
        deficiencia: Yup.bool(),
        parente_com_tea: Yup.string(),
        freq_convivio_tea: Yup.string(),
        qtd_alunos_tea: Yup.number(),
        tempo_trabalho_tea: Yup.number(),
        qtd_pacientes_tea_ano: Yup.number(),
      }),
    });
  }, [selectedUser, token]);

  // FORM UPKEEPING
  const [errors, setErrors] = useState({});
  const setError = useCallback(
    (name, value) => {
      if (value === errors[name] || (isNil(value) && isNil(errors[name])))
        return;
      setErrors({...errors, [name]: value});
    },
    [setErrors, errors],
  );

  const [inputs, setInputs] = useState(null);
  const setInput = useCallback(
    (name, value) => {
      setInputs(set({...inputs}, name, value));
    },
    [setInputs, inputs],
  );

  const form = useMemo(
    () => [
      [
        {
          name: 'username',
          path: 'username',
          type: 'text',
          label: 'Nome de Usuário',
          helperText: (
            <>
              {checkingUsernameAvailability ? (
                <FormHelperText
                  display="flex"
                  flexDirection="row"
                  alignItems="center">
                  <Spinner size="xs" colorScheme="primary" mr={2} />
                  Verificando disponibilidade do nome de usuário
                </FormHelperText>
              ) : inputs?.username === usernameChecked ? (
                <FormHelperText color="green.700">
                  <Alert status="success">
                    <AlertIcon />
                    <AlertDescription>
                      Esse nome de usuário está disponível
                    </AlertDescription>
                  </Alert>
                </FormHelperText>
              ) : null}
            </>
          ),
        },
        {
          name: 'email',
          path: 'email',
          type: 'email',
          label: 'E-mail',
          helperStatus: 'warning',
          helperText:
            isNil(inputs?.email == null) || inputs?.emaill === ''
              ? 'Caso você não possua um e-mail cadastrado, qualquer pedido de mudança de senha será encaminhado para a moderação da plataforma.'
              : null,
        },
      ],
      {
        name: 'name',
        path: 'name',
        label: 'Nome',
        type: 'text',
        required: false,
      },
      {
        name: 'genero',
        path: 'data.genero',
        label: 'Gênero',
        type: 'radio',
        required: false,
        custom: 'Outro',
        options: [
          {
            value: 'Feminino',
            text: 'Feminino',
          },
          {
            value: 'Masculino',
            text: 'Masculino',
          },
        ],
      },
      {
        name: 'nascimento',
        path: 'data.nascimento',
        label: 'Data de Nascimento',
        type: 'date',
        required: false,
      },
      {
        name: 'area_atuacao',
        path: 'data.area_atuacao',
        label: 'Área de Atuação',
        type: 'radio',
        required: false,
        options: [
          {
            text: 'Professor',
            value: 'Professor',
          },
          {
            text: 'Professor Especialista em Inclusão Escolar',
            value: 'Especialista',
          },
          {
            text: 'Profissional de Clínica',
            value: 'Profissional',
          },
          {
            text: 'Profissional Especialista em Inclusão Escolar',
            value: 'Profissional Especialista',
          },
        ],
        stackProps: {
          alignItems: 'start',
        },
      },
      {
        name: 'instituicao',
        path: 'data.instituicao',
        label: 'Instituição',
        type: 'text',
        required: false,
      },
      [
        {
          name: 'campus',
          path: 'data.campus',
          label: 'Campus',
          type: 'text',
          required: false,
        },
        {
          name: 'setor',
          path: 'data.setor',
          label: 'Setor',
          type: 'text',
          required: false,
        },
      ],
      [
        {
          name: 'deficiencia',
          path: 'data.deficiencia',
          label: 'Possui Deficiência',
          type: 'check',
          required: false,
        },
        {
          name: 'parente_com_tea',
          path: 'data.parente_com_tea',
          label: 'Convive com Parente com TEA',
          type: 'check',
          required: false,
        },
      ],
      [
        {
          name: 'freq_convivio_tea',
          path: 'data.freq_convivio_tea',
          label: 'Frequência de Convívio TEA',
          type: 'text',
          required: false,
        },
        {
          name: 'qtd_alunos_tea',
          path: 'data.qtd_alunos_tea',
          label: 'Quantidade de Alunos TEA',
          type: 'numeric',
          required: false,
        },
      ],
      [
        {
          name: 'tempo_trabalho_tea',
          path: 'data.tempo_trabalho_tea',
          label: 'Tempo de Trabalho TEA em anos',
          type: 'numeric',
          required: false,
        },
        {
          name: 'qtd_pacientes_tea_ano',
          path: 'data.qtd_pacientes_tea_ano',
          label: 'Quantidade de Pacientes TEA/Ano',
          type: 'numeric',
          required: false,
        },
      ],
    ],
    [],
  );

  const handleChange = useCallback(
    (name, value, event, input) => setInput(input.path, value),
    [setInput],
  );

  const handleValidate = useCallback(
    async (name, value, event, input) => {
      try {
        await schema.validateAt(name, {[name]: value});
        setError(name, null);
      } catch (error) {
        setError(name, error.message);
      }
    },
    [schema, setError],
  );

  useEffect(() => {
    const fetch = async () => {
      // eslint-disable-next-line no-shadow
      const users = Usuarios.getAll(token);
      const types = await Privilegios.getAll(token);

      setTypeData(types);

      const result = (await users).users;

      // eslint-disable-next-line no-shadow
      result.map((user, index) => {
        user.index = index;
        user.typeName =
          types.find((type) => type.id === user.type)?.type ?? '???';
      });

      setUsers(result);
    };

    fetch();
  }, [token]);

  useEffect(() => {
    const canEditUsers = [1, 2];

    if (!canEditUsers.includes(user.type)) {
      history.push('/');
    }
  }, [history, user]);

  const updateUserStatus = useCallback(
    async (target, userId) => {
      switch (target.value) {
        case 'ativar':
          try {
            await Usuarios.updateById(token, userId, {active: true});
          } catch (error) {
            alert('Não foi possível salvar a alteração.');
          }
          break;

        case 'inativar':
          try {
            await Usuarios.updateById(token, userId, {active: false});
          } catch (error) {
            alert('Não foi possível salvar a alteração.');
          }
          break;

        default:
          break;
      }
    },
    [token],
  );

  const filterUsers = useCallback(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await Usuarios.getByEmailOrUsername(
          token,
          emailFilter,
          usernameFilter,
        );

        const filteredUsers = result.users.map((usuario, index) => {
          usuario.index = index;
          usuario.typeName =
            typeData.find((type) => type.id === usuario.type)?.type ?? '???';
          return usuario;
        });

        setUsers(filteredUsers);
      } catch (error) {
        toast.error('Erro ao pesquisar usuários');
        console.log(error);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [emailFilter, token, typeData, usernameFilter]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        filterUsers();
      }
    },
    [filterUsers],
  );

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
              <Th color="white">Ações</Th>
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
                  <Td>
                    <IconButton
                      onClick={(event) => {
                        selectUser(currentUser);
                        onOpen(event);
                      }}
                      size="sm"
                      colorScheme="primary"
                      icon={<Icon as={MdEdit} />}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de Editar Perfil */}
      {/* align-items: start;
    padding-top: 3.75rem;
    padding-bottom: 3.75rem; */}
      <Modal
        isOpen={isOpen}
        isCentered={false}
        size="6xl"
        onClose={(event) => {
          setSelectedUser(null);
          onClose(event);
        }}
        motionPreset="slideInBottom">
        <ModalOverlay />
        {selectedUser ? (
          <>
            <ModalContent>
              <ModalHeader>{selectedUser.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Form
                  inputs={form}
                  errors={errors}
                  value={inputs}
                  onChange={handleChange}
                  onValidate={handleValidate}
                  spacing={5}
                  noSubmit
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="primary"
                  mr={3}
                  disabled={savingUser}
                  onClick={() => {
                    setSavingUser(true);

                    Usuarios.updateById(token, selectedUser.id, inputs)
                      .then(() => {
                        setUsers(
                          users.map((_user) => {
                            if (_user.index === selectedUser.index)
                              return {
                                ...inputs,
                                index: selectedUser.index,
                                typeName:
                                  typeData.find((type) => type.id === user.type)
                                    ?.type ?? '???',
                              };
                            return _user;
                          }),
                        );
                        setSavingUser(false);
                        onClose();
                      })
                      .catch(() => {
                        alert('Não foi possível salvar as alterações.');
                        setSavingUser(false);
                        onClose();
                      });
                  }}>
                  {/* TODO: show success/message error */}
                  Salvar
                </Button>
                <Button disabled={savingUser} onClick={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </>
        ) : null}
      </Modal>
    </S.Wrapper>
  );
};

export default UserControl;
