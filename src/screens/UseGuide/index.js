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
        color={{base: 'white', lg: 'white'}}
        boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
        <p>Teste</p>
      </Box>
    </S.Wrapper>
  );
};

export default UseGuide;
