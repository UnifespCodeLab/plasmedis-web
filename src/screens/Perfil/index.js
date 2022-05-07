/* eslint-disable no-alert */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  Text,
  Box,
  Stack,
  FormHelperText,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Tooltip,
} from '@chakra-ui/react';

import {get, isEmpty, isNil, pick, set} from 'lodash';
import * as Yup from 'yup';

import * as S from './styles';
import * as Usuario from '../../domain/usuarios';
import * as Privilegio from '../../domain/privilegios';

import {Context as AuthContext} from '../../components/stores/Auth';
import Form from '../../components/elements/Form';

const Perfil = (...props) => {
  const dataWarning = useRef(false);
  const {token, hasData, setHasData, user} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [typeData, setTypeData] = useState(null);

  const [checkingUsernameAvailability, setCheckingUsernameAvailability] =
    useState(false);
  const [usernameChecked, setUsernamedChecked] = useState(null);
  const latestCheckUniqueUsername = useRef(null);

  const savedCredentials = useRef({});

  const schema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('O campo "Nome" é obrigatório'),
      genero: Yup.string().required('O campo "Gênero" é obrigatório'),
      nascimento: Yup.date().required(
        'O campo "Data de Nascimento" é obrigatório',
      ),
      area_atuacao: Yup.string().required(
        'O campo "Área de Atuação" é obrigatório',
      ),
      instituicao: Yup.string().required('O campo "Instituição" é obrigatório'),
      campus: Yup.string(),
      setor: Yup.string(),
      deficiencia: Yup.bool(),
      parente_com_tea: Yup.string(),
      freq_convivio_tea: Yup.string(),
      qtd_alunos_tea: Yup.number(),
      tempo_trabalho_tea: Yup.number(),
      qtd_pacientes_tea_ano: Yup.number(),
    });
  }, []);

  const credentialSchema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string()
        .required('O Nome de Usuário é obrigatório')
        .test(
          'checkUniqueUsername',
          <span>
            Esse nome de usuário <b>não</b> está disponível
          </span>,
          async (value) => {
            if (value === get(savedCredentials.current, 'username'))
              return true;

            setCheckingUsernameAvailability(true);

            if (!isEmpty(value) && !isNil(value)) {
              try {
                const unique = await Usuario.verifyUsername(token, value);

                setCheckingUsernameAvailability(false);
                setUsernamedChecked(value);
                latestCheckUniqueUsername.current = unique;
                return unique;
              } catch {
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
      name: Yup.string().required('O Nome é obrigatório'),
      password: Yup.string().required('A Senha é obrigatória'),
      confirmation_password: Yup.string().required(
        'A Confirmação de Senha é obrigatória',
      ),
    });
  }, [token]);

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
  const [credentialErrors, setCredentialErrors] = useState({});
  const setCredentialError = useCallback(
    (name, value) => {
      if (
        value === credentialErrors[name] ||
        (isNil(value) && isNil(credentialErrors[name]))
      )
        return;
      setCredentialErrors({...credentialErrors, [name]: value});
    },
    [setCredentialErrors, credentialErrors],
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
        placeholder: 'Ex: UNIFESP',
        required: false,
      },
      [
        {
          name: 'campus',
          path: 'data.campus',
          label: 'Campus',
          type: 'text',
          placeholder: 'Ex: São José dos Campos',
          required: false,
        },
        {
          name: 'setor',
          path: 'data.setor',
          label: 'Setor',
          type: 'text',
          placeholder: 'Ex: setor...',
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
          label: 'Frequência de Convívio TEA por semana',
          type: 'numeric',
          placeholder: 'Ex: 2',
          required: false,
        },
        {
          name: 'qtd_alunos_tea',
          path: 'data.qtd_alunos_tea',
          label: 'Quantidade de Alunos TEA',
          placeholder: 'Ex: 2',
          type: 'numeric',
          required: false,
        },
      ],
      [
        {
          name: 'tempo_trabalho_tea',
          path: 'data.tempo_trabalho_tea',
          label: 'Tempo de Trabalho TEA',
          placeholder: 'Ex: 2',
          type: 'numeric',
          required: false,
        },
        {
          name: 'qtd_pacientes_tea_ano',
          path: 'data.qtd_pacientes_tea_ano',
          label: 'Quantidade de Pacientes TEA/Ano',
          placeholder: 'Ex: 1',
          type: 'numeric',
          required: false,
        },
      ],
    ],
    [],
  );

  const credentialForm = useMemo(
    () => [
      [
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
        {
          name: 'username',
          path: 'username',
          type: 'text',
          label: 'Nome de Usuário',
          placeholder: 'nome.sobrenome',
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
      ],
      [
        {
          name: 'password',
          path: 'password',
          type: 'password',
          label: 'Senha',
        },
        {
          name: 'confirmation_password',
          path: 'confirmation_password',
          type: 'password',
          label: 'Confirmação de Senha',
        },
      ],
    ],
    [checkingUsernameAvailability, inputs, usernameChecked],
  );

  const handleChange = useCallback(
    (name, value, event, input) => setInput(input.path, value),
    [setInput],
  );

  const handleValidate = useCallback(
    (preffix, _schema, _setError) => async (name, value, event, input) => {
      const prefixedName = preffix ? `${preffix}.${name}` : name;

      try {
        await _schema.validateAt(name, {[name]: value});
        _setError(prefixedName, null);
      } catch (error) {
        _setError(prefixedName, error.message);
      }
    },
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (isNil(token) || isEmpty(token)) return;

    if (!hasData && dataWarning.current === false) {
      alert(
        'Você deve terminar de preencher seu perfil para continuar usando a plataforma.',
      );
      dataWarning.current = true;
    }

    setLoading(true);

    const fetchPrivileges = async () => {
      const result = await Privilegio.getAll(token);

      setTypeData(result);
    };

    const fetchUserData = async () => {
      const result = await Usuario.getById(token, user.id, true);

      savedCredentials.current = pick(result, 'username', 'email');

      const parsedResult = {
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
      setLoading(false);
    };

    fetchPrivileges();
    fetchUserData();
  }, [token, setLoading, setTypeData, hasData, user.id, setInputs]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      let validationPromise = Promise.resolve({});
      if (inputs.username !== user.username || inputs.email !== user.email) {
        validationPromise = credentialSchema.validate(inputs, {
          abortEarly: false,
        });
      }

      validationPromise
        .then((credentials) => {
          schema
            .validate(
              {...(inputs?.data || {}), name: inputs.name},
              {abortEarly: false},
            )
            .then((data) => {
              const {name} = data;
              delete data.name;

              Usuario.updateById(token, user.id, {
                name,
                data,
                ...credentials,
              })
                .then(() => {
                  setHasData(true);
                  setErrors({});
                  setCredentialErrors({});

                  savedCredentials.current = pick(inputs, 'username', 'email');
                })
                .catch(() => {
                  alert('Não foi possível atualizar o perfil.'); // TODO: alert mais amigável com melhor descricao do erro
                });
            })
            .catch((err) => {
              setErrors(
                err.inner.reduce(
                  (obj, error) => ({
                    ...obj,
                    [error.path === 'name' ? 'name' : `data.${error.path}`]:
                      error.message,
                  }),
                  {},
                ),
              );
            });
        })
        .catch((err) => {
          setCredentialErrors(
            err.inner.reduce(
              (obj, error) => ({...obj, [error.path]: error.message}),
              {},
            ),
          );
        });
    },
    [inputs, user, credentialSchema, schema, token, setHasData],
  );

  return (
    <S.Wrapper px={{base: 0, lg: 6}}>
      <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
        Meu Perfil
      </Text>
      <Box
        borderRadius={10}
        bg={{base: 'white', lg: 'white'}}
        color={{base: 'white', lg: 'white'}}
        boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
        {!hasData ? (
          <Stack
            mx={6}
            my={5}
            spacing={4}
            align="flex-start"
            justify="center"
            direction="row">
            <Alert status="error">
              <AlertIcon />
              <AlertDescription color="red.700">
                É necessário que você preencha o complemento de dados abaixo
                para continuar usando a plataforma.
              </AlertDescription>
            </Alert>
          </Stack>
        ) : null}
        <Stack
          mx={5}
          my={5}
          spacing={4}
          align="flex-start"
          justify="center"
          direction="column">
          <S.Form
            // eslint-disable-next-line react/jsx-no-bind
            onSubmit={onSubmit}
            autoComplete="off">
            {typeData ? (
              <>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  py={5}
                  px={6}
                  mb={5}>
                  <Form
                    inputs={form}
                    errors={errors}
                    value={inputs}
                    onChange={handleChange}
                    onValidate={handleValidate('data', schema, setError)}
                    spacing={5}
                    noSubmit
                  />
                </Box>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  py={5}
                  px={6}
                  mb={5}>
                  <Alert status="info" mb={4}>
                    <AlertIcon />
                    <AlertDescription color="blue.700">
                      Para alterar qualquer informação abaixo será necessário
                      informar e confirmar a senha.
                    </AlertDescription>
                  </Alert>
                  <Form
                    inputs={credentialForm}
                    errors={credentialErrors}
                    value={inputs}
                    onChange={handleChange}
                    onValidate={handleValidate(
                      undefined,
                      credentialSchema,
                      setCredentialError,
                    )}
                    spacing={5}
                    noSubmit
                  />
                </Box>
              </>
            ) : !loading ? (
              <p style={{color: 'black', marginBottom: '1rem'}}>
                <i>Ocorreu um erro ao buscar dados na api</i>
              </p>
            ) : (
              ''
            )}
            <Tooltip
              isDisabled={!checkingUsernameAvailability}
              label="Verificando a disponibilidade do nome de usuário...">
              <span>
                <Button
                  disabled={checkingUsernameAvailability}
                  colorScheme="primary"
                  type="submit"
                  isLoading={loading}>
                  Salvar
                </Button>
              </span>
            </Tooltip>
          </S.Form>
        </Stack>
      </Box>
    </S.Wrapper>
  );
};

export default Perfil;
