import React from 'react';
import PropTypes from 'prop-types';
import {isNull} from 'lodash';

import {Spinner, Box} from '@chakra-ui/react';
import Postagem from '../Postagem';

import * as User from '../../../domain/usuarios';

const Feed = ({
  value,
  user,
  canVerifyPost,
  fetchComments,
  onCreateComment,
  onToggleSelo,
} = {}) => {
  if (isNull(value)) {
    return (
      <Box w="100%" textAlign="center" mt={5}>
        <Spinner colorScheme="primary" />
      </Box>
    );
  }

  return (
    <>
      {value.map((postagem) => (
        <Postagem
          key={postagem?.id}
          item={postagem}
          user={user}
          verifiable={canVerifyPost}
          fetchComments={fetchComments}
          onCreateComment={onCreateComment}
          onToggleSelo={onToggleSelo}
        />
      ))}
    </>
  );
};

Feed.displayName = 'Feed';
Feed.defaultProps = {
  value: [],
  user: User.PropTypes.UserDefault,
  canVerifyPost: false,
  fetchComments: async () => [],
  onCreateComment: () => {},
  onToggleSelo: () => {},
};
Feed.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      dateTime: PropTypes.object.isRequired, // TODO: invoke moment object type
    }),
  ),
  user: User.PropTypes.User,
  canVerifyPost: PropTypes.bool,
  fetchComments: PropTypes.func,
  onCreateComment: PropTypes.func,
  onToggleSelo: PropTypes.func,
};

export default Feed;
