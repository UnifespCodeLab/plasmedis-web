import React, {useCallback, useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import {Flex} from '@chakra-ui/layout';
import {Button, IconButton} from '@chakra-ui/button';
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdFirstPage,
  MdLastPage,
} from 'react-icons/md';
import {Icon} from '@chakra-ui/react';

const PageSelector = ({metadata} = {}) => {
  return (
    <Flex mt={4} alignItems="center" justifyContent="center">
      <Flex p={{base: 3, lg: 3}} borderRadius="10px">
        {metadata.current - 1 > 1 ? (
          <>
            <IconButton
              backgroundColor="#F0F6F8"
              mr={2}
              icon={<Icon as={MdFirstPage} fontSize={25} />}
            />
            <IconButton
              backgroundColor="#F0F6F8"
              mr={2}
              icon={<Icon as={MdNavigateBefore} fontSize={25} />}
            />
            <Button backgroundColor="#F0F6F8" mr={2}>
              {metadata.current - 1}
            </Button>
          </>
        ) : metadata.previous ? (
          <>
            <IconButton
              backgroundColor="#F0F6F8"
              mr={2}
              icon={<Icon as={MdNavigateBefore} fontSize={25} />}
            />
            <Button backgroundColor="#F0F6F8" mr={2}>
              {metadata.current - 1}
            </Button>
          </>
        ) : (
          <></>
        )}
        <Button colorScheme="primary">{metadata.current}</Button>
        {metadata.current + 1 < metadata.count ? (
          <>
            <Button backgroundColor="#F0F6F8" ml={2}>
              {metadata.current + 1}
            </Button>
            <IconButton
              backgroundColor="#F0F6F8"
              ml={2}
              icon={<Icon as={MdNavigateNext} fontSize={25} />}
            />
            <IconButton
              backgroundColor="#F0F6F8"
              ml={2}
              icon={<Icon as={MdLastPage} fontSize={25} />}
            />
          </>
        ) : metadata.next ? (
          <>
            <Button backgroundColor="#F0F6F8" ml={2}>
              {metadata.current + 1}
            </Button>
            <IconButton
              backgroundColor="#F0F6F8"
              ml={2}
              icon={<Icon as={MdNavigateNext} fontSize={25} />}
            />
          </>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

PageSelector.displayName = 'PageSelector';
PageSelector.defaultProps = {
  metadata: {},
};
PageSelector.propTypes = {
  metadata: {
    count: PropTypes.number,
    current: PropTypes.number,
    next: PropTypes.string,
    previous: PropTypes.string,
  },
};

export default PageSelector;
