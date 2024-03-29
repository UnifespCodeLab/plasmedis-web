import React from 'react';
import PropTypes from 'prop-types';

import {Box, Text} from '@chakra-ui/layout';
import {MdMenu, MdClose} from 'react-icons/md';

import Icon from '@chakra-ui/icon';
import {IconButton} from '@chakra-ui/button';
import {Wrapper, Container, ChildrenWrapper} from './styles';

const Header = ({children, open, onMenu} = {}) => (
  <>
    <Wrapper
      bg={{base: 'primary.600', lg: 'white'}}
      color={{base: 'white', lg: 'primary.600'}}>
      <Container className="TETSEEEE" py={4} px={{base: 6, lg: 4}}>
        <Text fontWeight="bold" fontSize="xl">
          TEApp
        </Text>

        <Box display={{base: 'block', lg: 'none'}}>
          <IconButton
            onClick={onMenu}
            colorScheme="white"
            variant="link"
            icon={<Icon fontSize="2xl" as={open ? MdClose : MdMenu} />}
          />
        </Box>
      </Container>
    </Wrapper>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </>
);

Header.displayName = 'Header';
Header.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onMenu: PropTypes.func,
};
Header.defaultProps = {
  children: null,
  open: false,
  onMenu: undefined,
};

export default Header;
