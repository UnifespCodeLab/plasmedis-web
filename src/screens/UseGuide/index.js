/* eslint-disable no-alert */
import React from 'react';
import {Text, Box} from '@chakra-ui/react';

import * as S from './styles';

const UseGuide = (...props) => {
  return (
    <S.Wrapper px={{base: 0, lg: 6}}>
      <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
        Guia de Uso
      </Text>
      <Box
        borderRadius={10}
        bg={{base: 'white', lg: 'white'}}
        color={{base: 'black', lg: 'black'}}
        padding={{base: '20px'}}
        boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
        <div>
          <p>
            Olá, integrantes da Comunidade Virtual de Aprendizagem TEA NO ENSINO
            SUPERIOR.
          </p>
          <br />

          <p>
            Esta comunidade tem como objetivo promover a integração entre
            professores universitários de alunos com TEA e especialistas em
            inclusão para o nível superior. Nesta comunidade os participantes
            podem interagir postando mensagens com tema especificamente
            relacionados a pessoas com TEA na fase adulta e que estejam cursando
            universidade. Aqui o integrante poderá postar mensagens, curtir e
            comentar as postagens de outros. Também será permitido desabafar
            sobre as dificuldades pessoais em lidar com o tema, bem como
            oferecer apoio.
          </p>
          <br />

          <p>
            As mensagens podem conter: informações, dúvidas, elogios, sugestões,
            dicas, publicações de eventos e outros assuntos referentes ao tema.
          </p>
          <br />

          <p>
            Nesta comunidade não é permitido postagens inadequadas, com teor
            ofensivo, incitação ao ódio, qualquer tipo de pornografia ou
            mensagem de duplo sentido, violência, aliciamento político, ou
            qualquer outro tipo de mensagem que cause constrangimento ou
            infrinja as leis. Não é permitido postar palavras de baixo calão,
            correntes, ativismo político e/ou religioso.
          </p>
          <br />

          <p>
            Caso uma das regras seja infringida, o conteúdo postado será
            removido, e a pessoa responsável pela postagem será advertida.
            Havendo reincidência, o integrante será excluído.
          </p>
          <br />

          <p>Papel dos participantes</p>
          <br />

          <p>
            Os professores serão os participantes da comunidade virtual de
            aprendizagem e poderão postar dúvidas, necessidades em relação ao
            tema e pedir ajuda.
          </p>
          <br />

          <p>
            Os especialistas serão os moderadores que terão como papel
            contribuir com conhecimento a respeito do tema Estudante com TEA no
            ensino superior. Os especialistas serão os responsáveis por
            responder as perguntas dos professores, bem como oferecer dicas
            relacionadas ao tema.
          </p>
          <br />

          <p>
            A mestranda deste objeto de estudo será a moderadora administradora
            responsável por cadastrar os usuários, estimular a interação da
            comunidade por meio de postagens. A moderadora administradora
            incentivará: os professores a compartilharem dúvidas e necessidades;
            e os especialistas a responderem as postagens dos professores.
          </p>
          <br />
        </div>
      </Box>
    </S.Wrapper>
  );
};

export default UseGuide;
