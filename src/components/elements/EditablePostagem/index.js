import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {FormControl, FormLabel, Input, Select} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Textarea from '../Textarea';

const EditablePostagem = ({value, categories} = {}) => {
  return (
    value && (
      <div>
        <FormControl id="title">
          <FormLabel>Título</FormLabel>
          <Input
            colorScheme="primary"
            type="text"
            value={value.title}
            onChange={(event) => {
              value.title = event.target.value;
            }}
          />
          {/* <FormHelperText>Título da sua postagem.</FormHelperText> */}
        </FormControl>
        <FormControl id="description">
          <FormLabel>Descrição</FormLabel>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={(newValue) => {
              value.description = newValue;
            }}
          />
          {/* <FormHelperText>Título da sua postagem.</FormHelperText> */}
        </FormControl>

        <FormControl id="category">
          <FormLabel>Categoria</FormLabel>
          <Select
            colorScheme="primary"
            value={value.category}
            onChange={(event) => {
              value.category = event.target.value;
            }}>
            {categories.map((category) => {
              return (
                <option
                  selected={category.id === 0}
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </Select>
          {/* <FormHelperText>Título da sua postagem.</FormHelperText> */}
        </FormControl>
      </div>
    )
  );
};

EditablePostagem.displayName = 'EditablePostagem';
EditablePostagem.propTypes = {};

export default EditablePostagem;
