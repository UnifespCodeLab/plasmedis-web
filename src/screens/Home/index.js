import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {useLocation, useHistory} from 'react-router-dom';

import {
  Tabs,
  TabList,
  Tab,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';

import {Avatar} from '@chakra-ui/avatar';

import {Button} from '@chakra-ui/button';

import {get, isNull, set} from 'lodash';
import EditablePostagem from '../../components/elements/EditablePostagem';
import Feed from '../../components/elements/Feed';
import NotificationsMenu from '../../components/elements/NotificationsMenu';

import {Context as AuthContext} from '../../components/stores/Auth';

import {Wrapper} from './styles';

import * as Postagens from '../../domain/postagens';
import * as Categorias from '../../domain/categorias';
import * as Comentarios from '../../domain/comentarios';
import * as Notificacoes from '../../domain/notificacoes';

function Home() {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const filteredCategory = params.get('categoria');

  const [tabs, setTabs] = useState(['Feed', 'Recomendados']);

  const [tab, setTab] = useState(0);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [creatingPost, setCreatingPost] = useState(false);
  const {user, token} = useContext(AuthContext);

  const [categories, setCategories] = useState([]);

  const [posts, setPosts] = useState([]);
  const [newPostagem, setNewPostagem] = useState({});

  const [postsPage, setPostsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);

  // 1 = Admin
  // 2 = Moderador
  const canVerifyPostTypeIds = [1, 2];

  const fetchPosts = useCallback(async () => {
    let index = tab;

    if (filteredCategory) {
      const selectedTabIndex = tabs.indexOf(filteredCategory);
      if (selectedTabIndex !== -1) {
        index = selectedTabIndex;
        setTab(selectedTabIndex);
      }
    }

    let result = [];
    const limit = 5;
    if (index === 0 || index === 1)
      result = await Postagens.getAll(token, postsPage, limit, {
        recommended: tab === 1 ? true : null,
      });
    else {
      // FUTURE: como qualquer discussão de adição de novas categorias é pra próxima "sprint", no momento vai ficar meio hardcoded assim
      result = await Postagens.getAll(token, postsPage, limit, {
        category: categories.find((c) => c.name === tabs[index])?.id ?? null,
      });
    }

    if (isNull(result.posts)) return;

    setHasMorePosts(result.next !== '');

    setPosts([
      ...posts,
      ...result.posts.map((post) => {
        // HACK: a api nao envia nome de categoria/bairro, então isso é um workaround

        const category = categories.find((c) => c.id === post.category.id);
        post.category.name = get(category, 'name', '—');

        post.author.avatar = null;

        return post;
      }),
    ]);
  }, [tab, token, posts]);

  const fetchNotifications = async () => {
    const limit = 5;

    if (hasMoreNotifications) {
      const result = await Notificacoes.getByUser(
        token,
        user.id,
        notificationsPage,
        limit,
      );

      if (isNull(result)) return;

      setHasMoreNotifications(result.next !== '');

      if (hasMoreNotifications) setNotificationsPage(notificationsPage + 1);

      setNotifications([...notifications, ...result.notifications]);
    }
  };

  const onMarkNotificationsAsRead = async (ids) => {
    if (Array.isArray(ids) && ids.length > 0) {
      await Notificacoes.markAllAsRead(token, ids);
    } else {
      await Notificacoes.markAsRead(token, ids);
    }

    fetchNotifications();
  };

  useEffect(() => {
    // recuperando lista de categorias para tabs

    const fetchCategories = async () => {
      const result = await Categorias.getAll(token, 1, 50);

      if (isNull(result)) return;

      setCategories(result.categories);
      setTabs(
        ['Feed', 'Recomendados'].concat(
          result.categories
            .filter((category) => category.id !== 0)
            .map((category) => category.name),
        ),
      );
    };

    fetchCategories();
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (posts && posts.length === 0) fetchPosts();

    if (hasMorePosts) setPostsPage(postsPage + 1);
  }, [posts, hasMorePosts]);

  return (
    <>
      <Wrapper px={{base: 0, lg: 6}}>
        <Tabs
          className="tabs"
          isManual
          variant="unstyled"
          index={tab}
          onChange={(value) => {
            setTab(value);
            history.push(`?categoria=${tabs[value]}`);
          }}
          gridRow={{base: 1, lg: 2}}
          my={{base: 0, lg: 4}}>
          <TabList
            color={{base: 'light.300', lg: '#333'}}
            bg={{base: 'primary.600', lg: 'transparent'}}
            px={{base: 2, lg: 0}}
            pr={{base: 5, lg: 0}}
            maxWidth="100vw"
            overflowX="auto"
            style={{
              scrollbarWidth: 'thin',
            }}>
            {tabs.map((tabName, index) => (
              <Tab
                key={index}
                flex={{base: 1, lg: 1}}
                align="start"
                borderBottom={{
                  base: '5px solid var(--chakra-colors-primary-600)',
                  lg: 'none',
                }}
                borderRadius={{base: 0, lg: 10}}
                shadow={{base: 'none', lg: 'sm'}}
                mr={{base: 0, lg: 4}}
                bg={{base: 'none', lg: 'light.200'}}
                color={{base: 'none', lg: 'primary.700'}}
                fontWeight={{base: 400, lg: 600}}
                _selected={{
                  color: 'white',
                  bg: 'primary.600',
                  fontWeight: 600,
                  borderBottomColor: 'rgba(255, 255, 255, 0.9)',
                }}>
                {tabName}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <Box
          p={6}
          mb={6}
          borderRadius={{base: '0px', lg: '10px'}}
          shadow="md"
          bgColor="white">
          <Flex flexDirection="row" align="center">
            <Box mr={4}>
              <Avatar
                name={get(user, 'name', '???')}
                src={get(user, 'avatar', 'https://bit.ly/dan-abramov')}
              />
            </Box>
            <Button
              color="#606060"
              fontFamily="Nunito Sans"
              fontWeight="500"
              borderRadius="50px"
              w="100%"
              h="auto"
              display="inline-block"
              textAlign="left"
              p={3}
              pl={6}
              mr={4}
              onClick={onOpen}>
              No que você está pensando?{' '}
            </Button>
            <NotificationsMenu
              items={notifications}
              onMarkAsRead={onMarkNotificationsAsRead}
              fetchNextPage={fetchNotifications}
              hasMoreNotifications={hasMoreNotifications}
            />
          </Flex>
        </Box>

        <Feed
          user={user}
          canVerifyPost={canVerifyPostTypeIds.includes(user.type)}
          fetchComments={async (id, page) => {
            const limit = 2;
            const commentsPage = await Comentarios.getByPostId(
              token,
              id,
              page,
              limit,
            );
            return commentsPage;
          }}
          onCreateComment={(newComment, itemId) => {
            return Comentarios.create(token, newComment, itemId); // TODO: show error/success message
          }}
          onToggleSelo={(itemId) => {
            return Postagens.toggleSelo(token, itemId);
          }}
          value={posts}
          hasMorePosts={hasMorePosts}
          fetchNextPage={fetchPosts}
        />
      </Wrapper>

      {/* Modal de Criar Postagem */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Postagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <EditablePostagem value={newPostagem} categories={categories} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="primary"
              mr={3}
              disabled={creatingPost}
              onClick={() => {
                setCreatingPost(true);
                Postagens.create(token, newPostagem).then(() => {
                  onClose();
                  setCreatingPost(false);
                  setNewPostagem({});
                  fetchPosts();
                });
              }}>
              {/* TODO: show success/message error */}
              Criar
            </Button>
            <Button disabled={creatingPost} onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Home;
