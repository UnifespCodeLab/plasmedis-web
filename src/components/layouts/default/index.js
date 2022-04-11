import React, {useState, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Collapse,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

import {Button} from '@chakra-ui/button';

import {get} from 'lodash';
import Header from '../../elements/Header';

import {Container, Content, BoxAside} from './styles.js';
import Navigation from '../../elements/Navigation';
import Sidebar from '../../elements/Sidebar';

import {Context as AuthContext} from '../../stores/Auth';

const Default = ({children} = {}) => {
  const [menu, setMenu] = useState(false);
  const {user, hasAcceptedTerms, acceptTerms} = useContext(AuthContext);

  const onClose = useCallback(() => {
    acceptTerms(true);
  }, [acceptTerms]);

  return (
    <>
      <Container bg="#F0F6F8">
        {/* <NavBar /> */}
        <Header open={menu} onMenu={() => setMenu(!menu)}>
          <Collapse in={menu} animateOpacity>
            <Box
              bg={{base: 'primary.600', lg: 'white'}}
              color={{base: 'white', lg: 'primary.600'}}
              zIndex={9}
              // boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)"
            >
              <Box pb={6} flexBasis={{base: '100%', lg: 'none'}}>
                <Stack
                  spacing={1}
                  align="flex-start"
                  justify="center"
                  direction="column">
                  <Navigation user={user} />
                </Stack>
              </Box>
            </Box>
          </Collapse>
        </Header>
        <Content mt={{base: 0, lg: 2}} p={{base: 0, lg: 4}}>
          <BoxAside width="100%">
            <Sidebar
              name={get(user, 'name', '???')}
              avatar={get(user, 'avatar', 'https://bit.ly/dan-abramov')}>
              <Navigation user={user} />
            </Sidebar>
          </BoxAside>
          <Box width="100%">{children}</Box>
        </Content>
      </Container>

      {/* Modal de Termos de Uso */}
      <Modal
        isOpen={hasAcceptedTerms === false}
        isCentered
        motionPreset="slideInBottom"
        size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Termos de Uso</ModalHeader>
          <ModalBody pb={6}>
            <div>
              <p>
                Lorem amet cillum qui amet eiusmod velit adipisicing ut est
                culpa commodo. Velit est velit culpa elit deserunt nulla ullamco
                minim. Ea aliquip excepteur consectetur anim non ipsum veniam
                Lorem amet ullamco cupidatat id enim sit. Tempor culpa ad sint
                occaecat ad minim. Pariatur consequat duis nisi ullamco ea magna
                magna minim.
              </p>
              <br />

              <p>
                Aute culpa adipisicing qui consequat. Ipsum aute velit tempor
                labore in id pariatur aliquip. Sit anim ut aliquip aliqua do
                nisi fugiat nulla deserunt aute Lorem. Sint sit id exercitation
                commodo minim quis culpa ullamco ex est voluptate.
              </p>
              <br />

              <p>
                Sint excepteur esse cupidatat fugiat eiusmod duis deserunt
                mollit nostrud cupidatat dolore pariatur magna commodo. Enim
                deserunt sunt reprehenderit deserunt ad. Fugiat nostrud ad
                labore magna qui proident dolore consectetur amet id eiusmod
                laboris. Laboris id proident eu sit Lorem dolor nulla aliqua
                irure irure commodo dolore dolor. Nisi aliquip aliqua minim ad
                labore eu deserunt minim ipsum nisi. Sint magna aute tempor elit
                Lorem pariatur reprehenderit. Ad ad cupidatat cillum officia ea
                non in culpa ut.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" onClick={onClose}>
              Aceitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

Default.displayName = 'Default';
Default.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Default;
