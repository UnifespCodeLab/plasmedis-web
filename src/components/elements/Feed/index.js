import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isNull} from 'lodash';
import {Spinner, Box, useDisclosure} from '@chakra-ui/react';
import Postagem from '../Postagem';
import PostViewModal from '../ModalPostagem';
import * as User from '../../../domain/usuarios';

const Feed = ({
  value,
  user,
  canVerifyPost,
  fetchComments,
  onCreateComment,
  onToggleSelo,
  fetchNextPage,
  hasMorePosts,
} = {}) => {
  const loaderRef = useRef(null);
  const [loadMore, setLoadMore] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedPost, setSelectedPost] = useState(null);

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
  }, [value, loaderRef, fetchNextPage]);

  if (isNull(value)) {
    return (
      <Box w="100%" textAlign="center" mt={5}>
        <Spinner colorScheme="primary" />
      </Box>
    );
  }

  const handlePostClick = (postagem) => {
    setSelectedPost(postagem);
    onOpen();
  };

  return (
    <>
      {value.map((postagem, index) => {
        // Envolva cada postagem em um Box clicável
        const postContent = (
          <Postagem
            item={postagem}
            user={user}
            verifiable={canVerifyPost}
            fetchComments={fetchComments}
            onCreateComment={onCreateComment}
            onToggleSelo={onToggleSelo}
          />
        );

        if (index === value.length - 1 && hasMorePosts) {
          return (
            <div key={postagem.id} ref={loaderRef}>
              <Box onClick={() => handlePostClick(postagem)} cursor="pointer">
                {postContent}
              </Box>
              {loadMore && (
                <Box w="100%" textAlign="center" mt={5}>
                  <Spinner colorScheme="primary" />
                </Box>
              )}
            </div>
          );
        }
        return (
          <Box
            key={postagem.id}
            onClick={() => handlePostClick(postagem)}
            cursor="pointer">
            {postContent}
          </Box>
        );
      })}

      {/* Renderiza o modal de visualização se houver uma postagem selecionada */}
      {selectedPost && (
        <PostViewModal
          isOpen={isOpen}
          onClose={() => {
            setSelectedPost(null);
            onClose();
          }}
          post={selectedPost}
          user={user}
          verifiable={canVerifyPost}
          fetchComments={fetchComments}
          onCreateComment={onCreateComment}
          onToggleSelo={onToggleSelo}
        />
      )}
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
  fetchNextPage: () => {},
  hasMorePosts: false,
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
  fetchNextPage: PropTypes.func,
  hasMorePosts: PropTypes.bool,
};

export default Feed;
