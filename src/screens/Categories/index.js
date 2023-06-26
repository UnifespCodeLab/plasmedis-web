import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {useHistory, Link} from 'react-router-dom';

import {Icon} from '@mdi/react';
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
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';

import {mdiDeleteOutline} from '@mdi/js';
import PageSelector from '../../components/elements/PageSelector';
import * as Categorias from '../../domain/categorias';
import {Context as AuthContext} from '../../components/stores/Auth';

function Categories() {
  const {user, token} = useContext(AuthContext);
  const [pageMetadata, setPageMetadata] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categories, setCategories] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const cancelRef = useRef();
  const history = useHistory();

  useEffect(() => {
    const canEditCategoriesTypeIds = [1, 2];

    if (!canEditCategoriesTypeIds.includes(user.type)) {
      history.push('/');
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await Categorias.getAll(token, page, limit);
      setCategories(result.categories);
      setPageMetadata({
        count: result.count,
        current: result.current,
        limit: result.limit,
        next: result.next,
        previous: result.previous,
      });
    };

    fetchCategories();
  }, [token, page, limit]);

  const removeCategory = useCallback(
    async (id) => {
      try {
        await Categorias.deleteById(token, id);
        // delete from categories state
        setCategories((list) => {
          return list.filter((category) => category.id !== id);
        });
      } catch (e) {
        alert(e.message);
      }
      setCategoryToDelete(null);
    },
    [token],
  );

  return (
    <>
      <Box px={{base: 0, lg: 6}}>
        <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
          Gerenciar Categorias
        </Text>

        <Flex direction="row" mb={4} alignItems="center" justifyContent="right">
          <Text mr={4}>Número de registros</Text>
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
                <Th color="white">Nome</Th>
                <Th color="white">Número de Postagens</Th>
                <Th color="white">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories &&
                categories.map((category) => (
                  <Tr key={category.id}>
                    <Td>{category.name}</Td>
                    <Td color="primary.600">
                      <Link
                        to={`/?categoria=${category.name}`}
                        title="Filtrar posts">
                        {category.posts}
                      </Link>
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Deletar categoria"
                        title="Deletar categoria"
                        cursor="pointer"
                        onClick={() => {
                          setCategoryToDelete(category.id);
                          onOpen();
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
        <PageSelector metadata={pageMetadata} onChangePage={setPage} />
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom">
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar Categoria
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja realmente deletar a categoria?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                mr={2}
                ref={cancelRef}
                onClick={() => {
                  setCategoryToDelete(null);
                  onClose();
                }}>
                Cancelar
              </Button>
              <Button
                colorScheme="primary"
                onClick={() => {
                  removeCategory(categoryToDelete);
                  onClose();
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

export default Categories;
