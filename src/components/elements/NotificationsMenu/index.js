import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {get, isNull} from 'lodash';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {MdNotifications, MdSettings} from 'react-icons/md';
import {IoCheckmark} from 'react-icons/io5';

import {NOTIFICATION_ACTION_TYPES} from '../../../utils/notifications/constants';

const NotificationsMenu = ({
  items,
  onMarkAsRead,
  fetchNextPage,
  hasMoreNotifications,
  selectCategory,
}) => {
  const loaderRef = useRef(null);
  const [loadMore, setLoadMore] = useState(true);

  const getNotificationAction = (notification) => {
    switch (notification.action.id) {
      case NOTIFICATION_ACTION_TYPES.NO_ACTION:
        break;
      case NOTIFICATION_ACTION_TYPES.SELECT_CATEGORY:
        selectCategory(notification.action.object_id);
        break;
      case NOTIFICATION_ACTION_TYPES.SELECT_POST:
        // TODO: criar essa visualização
        alert(`Selecionar post ${notification.action.object_id}`);
        break;
      case NOTIFICATION_ACTION_TYPES.OPEN_POSTS_MANAGEMENT:
        // TODO: criar essa visualização
        window.location = '/admin/controle-de-postagens';
        break;
      case NOTIFICATION_ACTION_TYPES.OPEN_PROFILE:
        window.location = '/perfil';
        break;
      case NOTIFICATION_ACTION_TYPES.OPEN_USER_CONTROL:
        // TODO: adicionar visualização com filtro
        // window.location = '/admin/controle-de-usuarios?filtro=';
        window.location = '/admin/controle-de-usuarios';
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadMore(true);
          fetchNextPage();
          setLoadMore(false);
        }
      },
      {threshold: 1},
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [items, loaderRef]);

  if (isNull(items)) {
    return (
      <Box w="100%" textAlign="center" mt={5}>
        <Spinner colorScheme="primary" />
      </Box>
    );
  }

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
                  hidden={!items.some((item) => !item.read)}
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
                onMarkAsRead(items.map((item) => item.id));
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
        <Box maxHeight="40vh" overflowY="scroll">
          {items.map((notification, index) => {
            if (index === items.length - 1 && hasMoreNotifications) {
              return (
                <div key={notification.id} ref={loaderRef}>
                  <MenuItem
                    fontWeight={!notification.read ? 'bold' : 'normal'}
                    fontSize="sm"
                    whiteSpace="initial"
                    _hover={{bg: 'light.300'}}
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id);
                      getNotificationAction(notification);
                    }}>
                    <Stack spacing={{base: 0, lg: 0.5}}>
                      <Text>{notification.content}</Text>
                      <Text fontSize="xs" color="gray">
                        {notification.created_date.fromNow()}
                      </Text>
                    </Stack>
                  </MenuItem>
                  {loadMore && (
                    <Box w="100%" textAlign="center" mt={5}>
                      <Spinner colorScheme="primary" />
                    </Box>
                  )}
                </div>
              );
            }
            return (
              <MenuItem
                key={notification.id}
                fontWeight={!notification.read ? 'bold' : 'normal'}
                fontSize="sm"
                whiteSpace="initial"
                _hover={{bg: 'light.300'}}
                onClick={() => {
                  if (!notification.read) onMarkAsRead(notification.id);
                  getNotificationAction(notification);
                }}>
                <Stack spacing={{base: 0, lg: 0.5}}>
                  <Text>{notification.content}</Text>
                  <Text fontSize="xs" color="gray">
                    {notification.created_date.fromNow()}
                  </Text>
                </Stack>
              </MenuItem>
            );
          })}
        </Box>
      </MenuList>
    </Menu>
  );
};

NotificationsMenu.displayName = 'NotificationsMenu';
NotificationsMenu.defaultProps = {
  items: [],
  onMarkAsRead: () => {},
  fetchNextPage: () => {},
  hasMoreNotifications: false,
  selectCategory: () => {},
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
  onMarkAsRead: PropTypes.func,
  fetchNextPage: PropTypes.func,
  hasMoreNotifications: PropTypes.bool,
  selectCategory: PropTypes.func,
};

export default NotificationsMenu;
