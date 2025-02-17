import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import Postagem from '../Postagem';

const PostViewModal = ({
  isOpen,
  onClose,
  post, // Dados da postagem
  user,
  verifiable,
  fetchComments,
  onCreateComment,
  onToggleSelo,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{post.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Postagem
            item={post}
            user={user}
            verifiable={verifiable}
            fetchComments={fetchComments}
            onCreateComment={onCreateComment}
            onToggleSelo={onToggleSelo}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostViewModal;
