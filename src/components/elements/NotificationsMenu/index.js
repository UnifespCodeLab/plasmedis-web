import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarBadge,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {MdNotifications, MdSettings} from 'react-icons/md';
import {IoCheckmark} from 'react-icons/io5';

const NotificationsMenu = ({items}) => {
  return (
    <Menu>
      <Tooltip label="Notificações">
        <MenuButton
          borderRadius={20}
          // O certo aqui seria utilizar a prop as para passar o icone do botao, porem por algum motivo, ao utilizar ela
          // o intellisense do vscode quebra. Alem disso, esse codigo tambem gera um warning no console, que nao
          // impacta o funcionamento do codigo, mas se utilizasse o as, esse warning tambem apareceria.
          // as={IconButton}
        >
          <IconButton
            bg="transparent"
            icon={
              <Avatar
                _hover={{bg: 'light.300'}}
                bg={{base: 'none', lg: 'light.200'}}
                aria-label="Notificações"
                icon={<Icon fontSize="1.5em" as={MdNotifications} />}>
                <AvatarBadge
                  boxSize="1.1em"
                  bg="red.500"
                  hidden={!(items.length > 0)}
                />
              </Avatar>
            }
          />
        </MenuButton>
      </Tooltip>
      <MenuList pt={1} w={400}>
        <Flex justifyContent="space-between">
          <Text ml={2} fontSize={20} fontWeight="bold">
            Notificações
          </Text>
          <Flex alignItems="center" justifyContent="center">
            <Link
              fontSize={12}
              onClick={() => {
                alert('Marcar todas como lidas');
              }}>
              <Flex>
                <Icon
                  alignSelf="center"
                  mr={1}
                  fontSize="sm"
                  as={IoCheckmark}
                />
                <Text> Marcar todas como lidas</Text>
              </Flex>
            </Link>
            <Link
              ml={2}
              mr={1}
              fontSize={12}
              onClick={() => {
                // TODO: criar essa visualização
                alert('Abrir confiurações de notificações');
              }}>
              <Flex mr={1}>
                <Icon alignSelf="center" mr={1} fontSize="sm" as={MdSettings} />
                <Text>Configurações</Text>
              </Flex>
            </Link>
          </Flex>
        </Flex>
        <MenuDivider m={0} />
        {items.map((notification) => (
          <MenuItem
            key={notification.id}
            fontWeight={notification.read ? 'bold' : 'normal'}
            fontSize="sm"
            whiteSpace="initial"
            _hover={{bg: 'light.300'}}
            onClick={() => {
              // TODO: criar uma forma de identificar a ação da notificação
              alert('Ação da notificação');
            }}>
            {notification.content}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

NotificationsMenu.displayName = 'NotificationsMenu';
NotificationsMenu.defaultProps = {
  items: [],
};
NotificationsMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      created_date: PropTypes.object.isRequired,
      read: PropTypes.bool.isRequired,
    }),
  ),
};

export default NotificationsMenu;
