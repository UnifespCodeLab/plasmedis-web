import React, {useContext, useState, useEffect, useCallback} from 'react';
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
} from '@chakra-ui/react';

import {mdiDeleteOutline} from '@mdi/js';
import PageSelector from '../../components/elements/PageSelector';
import * as Categorias from '../../domain/categorias';
import {Context as AuthContext} from '../../components/stores/Auth';

function Categories() {
  const {user, token} = useContext(AuthContext);
  const [pageMetadata, setPageMetadata] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const [categories, setCategories] = useState(null);
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
      } catch (e) {
        alert(e.message);
      }
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
            onChange={(event) => setLimit(event.target.value)}>
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
                        onClick={() => removeCategory(category.id)}
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
        <PageSelector metadata={pageMetadata} />
      </Box>
    </>
  );
}

export default Categories;
