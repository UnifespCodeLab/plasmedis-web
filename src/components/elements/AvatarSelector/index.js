import React, {useContext, useState} from 'react';
import {
  Text,
  Box,
  Avatar,
  HStack,
  VStack,
  SimpleGrid,
  Flex,
  Button,
  Input,
  Image,
} from '@chakra-ui/react';
import {get} from 'lodash';
import {PropTypes} from '../../../domain/usuarios';

import {Context as AuthContext} from '../../stores/Auth';

const AvatarSelector = () => {
  const {token, hasData, setHasData, user} = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(user);

  const presetAvatars = [
    'https://cdn.discordapp.com/embed/avatars/0.png',
    'https://cdn.discordapp.com/embed/avatars/1.png',
    'https://cdn.discordapp.com/embed/avatars/2.png',
    'https://cdn.discordapp.com/embed/avatars/3.png',
    'https://cdn.discordapp.com/embed/avatars/4.png',
    'https://cdn.discordapp.com/embed/avatars/5.png',
    'https://cdn.discordapp.com/embed/avatars/6.png',
    'https://cdn.discordapp.com/embed/avatars/6.png',
    'https://cdn.discordapp.com/embed/avatars/6.png',
  ];

  const presetAvatarsElement = presetAvatars.map((presetAvatar, index) => (
    <Avatar
      onClick={() => handleClickAvatar(index)}
      key={index}
      size="xl"
      src={presetAvatar}
      _hover={{
        cursor: 'pointer',
        transform: 'scale(1.1)',
        transition: 'all 0.2s ease',
      }}
    />
  ));

  function handleClickAvatar(index) {
    console.log(index);
  }

  function handleClickRemoveAvatar() {
    console.log('remove avatar');
  }

  function handleClickAddAvatar() {
    console.log('add avatar');
  }

  {
    /*
    How to create a Upload file on react:
    https://www.youtube.com/watch?v=pWd6Enu2Pjs&t=562s
    */
  }
  {
    /*
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    };
    */
  }

  function handleFileChange(event) {
    console.log('File change');
  }

  {
    /* Checa se o avatar é disponível para usar, 
    retornado pelo back (provavelmente) 
  */
  }

  function checkAvatarValidation() {}

  return (
    <>
      <Box>
        {/* File Input */}
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          display="none"
          id="file-upload"
        />
        {/* Custom Button */}
        <Button
          as="label"
          htmlFor="file-upload"
          colorScheme="primary"
          cursor="pointer">
          Adicionar imagem do computador
        </Button>
        {/* Image Preview */}
        {imagePreview && (
          <Box mt={4}>
            <Image
              src={imagePreview}
              alt="Preview"
              boxSize="150px"
              borderRadius="md"
            />
          </Box>
        )}
      </Box>

      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontWeight={500}>Seu avatar</Text>
          <HStack spacing={8} py={2} align="center">
            <Avatar
              key={user.id}
              size="xl"
              name={get(user, 'name', '???')}
              src={get(user, 'avatar', '???')}
            />
            <VStack spacing={3} width="170px">
              <Button
                width="100%"
                colorScheme="blackAlpha"
                onClick={() => handleClickAddAvatar()}>
                Adicionar avatar
              </Button>
              <Button
                width="100%"
                colorScheme="blackAlpha"
                onClick={() => handleClickRemoveAvatar()}>
                Remover avatar
              </Button>
            </VStack>
          </HStack>
        </Box>

        {/* Ajustar o espa'camento dos avatares padrao */}
        <Box>
          <Text fontWeight={500}>Avatares padrão</Text>
          <Flex minChildWidth="100px" flexWrap="wrap" gap={6} py={2}>
            {presetAvatarsElement}
          </Flex>
        </Box>

        <Box>
          <Button
            disabled={checkAvatarValidation}
            colorScheme="primary"
            type="submit"
            onClick={() => handleClickAddAvatar()}
            isLoading={loading}>
            Salvar
          </Button>
        </Box>
      </VStack>
    </>
  );
};

export default AvatarSelector;
