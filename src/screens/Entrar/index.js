import React, {useState, useContext} from 'react';
import {Form, Input} from '@rocketseat/unform';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';
import {Box} from '@chakra-ui/layout';
import {FormLabel, Button, Link} from '@chakra-ui/react';

import {conforms, has, omit} from 'lodash';
import {Container, Content, Logo, FormField} from './styles';
import {Context as AuthContext} from '../../components/stores/Auth';

import login from '../../domain/login';

const schema = Yup.object().shape({
  username: Yup.string().required('O nome de usuário é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

function Entrar({history} = {}) {
  const [loading, setLoading] = useState(false);
  const {setToken, setUser} = useContext(AuthContext);

  async function handleLogin(params) {
    try {
      setLoading(true);
      const {data} = await login(params);

      if (data.status === 1000) {
        if (has(data, 'token') && has(data, 'user')) {
          setToken(data.token);

          setUser({
            id: data.user.id,
            username: data.user.user_name,
            email: data.user.email,
            name: data.user.real_name,
            avatar: data.user.avatar ?? null,
            userType: data.user.user_type ?? 3,
            verified: data.user.verificado ?? false,
          });

          history.push({
            pathname: '/',
            state: data,
          });
        } else {
          toast.error('Login não retornou token ou usuário!');
        }
      } else {
        toast.error('Usuário ou senha incorretos!');
      }
    } catch (error) {
      toast.error('Erro interno!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Box
        p={['20px', '60px', '80px']}
        h="max-content"
        maxWidth="600px"
        w="90%"
        mt={20}
        borderRadius="10px"
        shadow="md"
        bgColor="white">
        <Logo>
          <h1>IBEApp</h1>
        </Logo>

        <Content>
          <Form schema={schema} onSubmit={handleLogin} autoComplete="off">
            <FormField>
              <FormLabel>Nome de Usuário</FormLabel>
              <Input
                name="username"
                type="text"
                placeholder="Seu nome de usuário"
              />
            </FormField>

            <FormField>
              <FormLabel>Senha</FormLabel>
              <Input name="password" type="password" placeholder="Sua senha" />
              <Link
                color="#31788A"
                fontWeight="bold"
                fontFamily="Nunito Sans"
                fontSize="18px"
                textAlign="right"
                mt="10px"
                href="/esqueci-minha-senha">
                Esqueceu a senha?
              </Link>
            </FormField>

            <Button
              color="#FFF"
              bgColor="#31788A"
              _hover={{bg: '#31788A'}}
              size="lg"
              mt={4}
              isLoading={loading}
              type="submit">
              Entrar
            </Button>
          </Form>
        </Content>
      </Box>
    </Container>
  );
}

export default Entrar;
