import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useHistory, Link} from 'react-router-dom';

// o componente Icon permite renderizar SVG fornecidos pela lib @mdi/js
import {Icon} from '@mdi/react';

import {mdiDeleteOutline, mdiPencil} from '@mdi/js';

import {Box} from '@chakra-ui/layout';
import {
  Flex,
  Select,
  IconButton,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';

import PageSelector from '../../components/elements/PageSelector';
import * as ManageCategories from '../../domain/categorias';
import * as ManageComments from '../../domain/comentarios';
import * as ManagePosts from '../../domain/postagens';
import {Context as AuthContext} from '../../components/stores/Auth';

toast.configure();

function Comments() {
  const {user, token} = useContext(AuthContext);
  const [pageMetadata, setPageMetadata] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [comments, setComments] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const {
    isOpen: removeCommentIsOpen,
    onOpen: removeCommentOnOpen,
    onClose: removeCommentOnClose,
  } = useDisclosure();
  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const [postAuthors, setPostAuthors] = useState({});
  const [loadingPostAuthor, setLoadingAuthor] = useState(true);

  const [postCategories, setPostCategories] = useState({});
  const [loadingPostCategory, setLoadingCategory] = useState(true);

  const [categories, setCategories] = useState(null);

  // ainda nao sei como usar
  const cancelRemoveRef = useRef();
  const cancelEditRef = useRef();
  const history = useHistory();

  const [newCommentBody, setNewCommentBody] = useState('');

  // uso essa hook para recuperar comentarios
  useEffect(() => {
    const fetchComments = async () => {
      const result = await ManageComments.getAll(token);

      if (result && Array.isArray(result)) setComments(result);
      else toast.error('Comentários não foram carregados corretamente.');
    };

    fetchComments();
    // o array de dependencias define quando o useEffect deve ser reexecutado,
    // ou seja, quando houver a montagem do componente ou token mudar
  }, [token]);

  // uso essa hook para remover comentários
  // (NESSE CASO EU NAO DEVO SEGUIR ASSIM, O CORRETO SEGUNDO A USERSTORY
  // É TROCAR O TEXTO DO CONTEÚDO PARA ALGO COMO "ESSA POSTAGEM FOI REMOVIDA",
  // NO LUGAR DO NOME DO USUARIO: "COMENTARIO REMOVIDO" OU "DESCONHECIDO")
  const removeComment = useCallback(
    async (id) => {
      try {
        const result = await ManageComments.delete(token, id);
        // removo do estado de comentários
        // o param list é uma variavel que representa o estado atual dos comentários
        setComments((list) => {
          return list.filter((comment) => comment.id !== id);
        });
      } catch (e) {
        toast.error(e.message);
      }

      setCommentToDelete(null);
    },
    [token],
  );

  const handleEditCommentChange = (event) => {
    setNewCommentBody(event.target.value);
  };

  const editComment = useCallback(
    async (id) => {
      try {
        const updatedComment = {
          body: newCommentBody,
        };
        console.log('ID here: ', id);
        console.log('updateComment here:', updatedComment);
        const result = await ManageComments.update(token, id, updatedComment);
        setComments((list) => {
          return list.map((item) => {
            if (item.id === id) {
              return {...item, body: newCommentBody};
            }
            return item;
          });
        });
      } catch (e) {
        toast.error(e.message);
      }
      setCommentToEdit(null);
    },
    [token, newCommentBody],
  );

  const postAuthor = useCallback(
    async (postId) => {
      try {
        const result = await ManagePosts.get(token, postId);
        return result.author.name;
      } catch (e) {
        toast.error(e.message);
        return null; // Retorna um valor padrão, como null ou uma string vazia
      }
    },
    [token],
  );

  useEffect(() => {
    // Espero os comments serem carregados
    if (!comments || comments.length === 0) return;

    const loadPostAuthors = async () => {
      const postIds = [...new Set(comments.map((comment) => comment.post))]; // Remove duplicatas
      const authors = await Promise.all(
        postIds.map(async (postId) => {
          const author = await postAuthor(postId);
          return {postId, author};
        }),
      );

      const authorMap = authors.reduce((acc, {postId, author}) => {
        acc[postId] = author;
        return acc;
      }, {});

      setPostAuthors(authorMap);
      setLoadingAuthor(false);
    };

    loadPostAuthors();
  }, [comments, postAuthor]);

  const postCategory = useCallback(
    async (postId) => {
      try {
        const result = await ManagePosts.get(token, postId);
        return result.category.name;
      } catch (e) {
        toast.error(e.message);
        return null; // Retorna um valor padrão, como null ou uma string vazia
      }
    },
    [token],
  );

  useEffect(() => {
    // Espero os comments serem carregados
    if (!comments || comments.length === 0) return;

    const loadPostCategories = async () => {
      const postIds = [...new Set(comments.map((comment) => comment.post))]; // Remove duplicatas
      const categs = await Promise.all(
        postIds.map(async (postId) => {
          const category = await postCategory(postId);
          return {postId, category};
        }),
      );

      const categoryMap = categs.reduce((acc, {postId, category}) => {
        acc[postId] = category;
        return acc;
      }, {});

      setPostCategories(categoryMap);
      setLoadingCategory(false);
    };

    loadPostCategories();
  }, [comments, postCategory]);

  // uso essa hook para filtrar comentários
  return (
    <>
      <Box px={{base: 0, lg: 6}}>
        <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
          Gerenciar Comentários
        </Text>
        <Flex direction="row" mb={4} alignItems="center" justifyContent="right">
          <Text mr={4}>Número de comentários</Text>
          <Select
            width={90}
            value={limit}
            onChange={(event) => {
              setLimit(event.target.value);
              setPage(1);
            }}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
        </Flex>
        <Box
          bg={{base: 'white', lg: 'white'}}
          color={{base: 'white', lg: 'white'}}
          boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
          <Table variant="striped" color="black" colorScheme="blackAlpha">
            <Thead>
              <Tr bg="primary.600">
                <Th color="white">Autor</Th>
                <Th color="white">Autor do post</Th>
                <Th color="white">Categoria</Th>
                <Th color="white">Horário</Th>
                <Th color="white">Postagem</Th>
                <Th color="white">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {comments &&
                comments.map((comment) => (
                  <Tr key={comment.id}>
                    <Td>{comment.author.name}</Td>
                    {/* post é o id do post desse comentário */}
                    <Td>
                      {loadingPostAuthor
                        ? 'Carregando...'
                        : postAuthors[comment.post]
                        ? postAuthors[comment.post]
                        : 'Autor não encontrado'}
                    </Td>
                    <Td>
                      {loadingPostCategory
                        ? 'Carregando...'
                        : postCategories[comment.post]
                        ? postCategories[comment.post]
                        : 'Categoria não encontrada'}
                    </Td>
                    <Td>{comment.dateTime.toString()}</Td>
                    <Td>{comment.body}</Td>
                    <Td>
                      <IconButton
                        aria-label="Editar comentário"
                        title="Editar comentário"
                        cursor="pointer"
                        onClick={() => {
                          setCommentToEdit(comment.id);
                          editOnOpen();
                        }}
                        size={1}
                        icon={<Icon size={1} path={mdiPencil} />}
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Deletar comentário"
                        title="Deletar comentário"
                        cursor="pointer"
                        onClick={() => {
                          setCommentToDelete(comment.id);
                          removeCommentOnOpen();
                        }}
                        size={1}
                        icon={<Icon size={1} path={mdiDeleteOutline} />}
                        variant="ghost"
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
        {/* <PageSelector onChangePage={setPage} /> */}
      </Box>

      {/* SUGESTÃO: ESTOU USANDO UM UNICO ESTADO PARA EDITAR E REMOVER
      COMENTÁRIOS, SUGIRO USAR DOIS ESTADOS, ENTÃO UM ISOPEN E UM
      ONCLOSE DIFERENTES PARA OS DOIS DIALOGS */}
      <AlertDialog
        isOpen={removeCommentIsOpen}
        leastDestructiveRef={cancelRemoveRef}
        onClose={removeCommentOnClose}
        motionPreset="slideInBottom">
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar Comentário
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja realmente deletar o comentário?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                mr={2}
                ref={cancelRemoveRef}
                onClick={() => {
                  setCommentToDelete(null);
                  removeCommentOnClose();
                }}>
                Cancelar
              </Button>
              <Button
                colorScheme="primary"
                onClick={() => {
                  removeComment(commentToDelete);
                  removeCommentOnClose();
                }}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={editIsOpen}
        leastDestructiveRef={cancelEditRef}
        onClose={editOnClose}
        motionPreset="slideInBottom">
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Editar comentário
            </AlertDialogHeader>
            <AlertDialogBody>
              <Textarea
                value={newCommentBody}
                onChange={handleEditCommentChange}
                placeholder="Edite o comentário aqui"
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                mr={2}
                ref={cancelEditRef}
                onClick={() => {
                  setCommentToEdit(null);
                  editOnClose();
                }}>
                Cancelar
              </Button>
              <Button
                colorScheme="primary"
                onClick={() => {
                  editComment(commentToEdit);
                  editOnClose();
                }}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Comments;
