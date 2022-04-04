import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';

import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react';

import {isArray, isNil} from 'lodash';
import Textarea from '../Textarea';

const CustomRadio = ({
  value,
  onChange: onChangeProp,
  custom,
  options,
  stackProps,
  optionProps,
  ...props
} = {}) => {
  const processedValue = useMemo(() => {
    if (isNil(value)) return value;

    const matchingOption = options.find((option) => option.value === value);
    if (!matchingOption) {
      return options.find((option) => option.custom).value;
    }

    return value;
  }, [value, options]);

  // CUSTOM
  const customOption = useMemo(() => {
    if (!custom) return undefined;

    return (options || []).find((option) => option.custom);
  }, [custom, options]);

  const isCustomSelected = useMemo(
    () => customOption?.value === value,
    [customOption, processedValue],
  );

  // VALUE
  const [radioValue, setRadioValue] = useState(value);
  const [customValue, setCustomValue] = useState(value);

  useEffect(() => {
    if (!custom) {
      if (value !== radioValue) setRadioValue(value);
    } else if (!isNil(value) && isArray(options)) {
      const matchingOption = options.find((option) => option.value === value);
      if (!matchingOption) {
        // custom value
        setCustomValue(value);
        setRadioValue(options.find((option) => option.custom).value);
      } else {
        setCustomValue(undefined);
        setRadioValue(value);
      }
    }
  }, [value, options, custom, radioValue]);

  const onRadioChange = useCallback(
    (newValue) => {
      setRadioValue(newValue);

      if (!onChangeProp) return;

      if (isCustomSelected) onChangeProp(customValue, true);
      onChangeProp(newValue, false);
    },
    [onChangeProp, isCustomSelected, customValue],
  );

  const onTextBlur = useCallback(
    (event) => {
      if (!onChangeProp) return;
      if (isCustomSelected) onChangeProp(event.target.value, true);
    },
    [isCustomSelected, onChangeProp],
  );

  return (
    <RadioGroup value={radioValue} onChange={onRadioChange} {...props}>
      <Stack spacing={8} {...(stackProps || {})} direction="row">
        {(options || []).map((option, index) => {
          return (
            <Radio
              key={index}
              value={option.value}
              // radio props
              {...optionProps}>
              <span style={{color: '#000'}}>{option.text || option.value}</span>
            </Radio>
          );
        })}
        {custom ? (
          <Input
            type="text"
            disabled={!isCustomSelected}
            placeholder={customOption.text || customOption.value}
            value={customValue || ''}
            onChange={(event) => setCustomValue(event.target.value)}
            onBlur={onTextBlur}
            // {...validationProps}
            // text props
            color="black"
            // maskChar={null}
            // as={!isNil(mask) ? InputMask : undefined}
            // {...inputProps}
            // placeholder={
            //   placeholder === undefined ? label : placeholder && placeholder
            // }
          />
        ) : null}
      </Stack>
    </RadioGroup>
  );
};

CustomRadio.displayName = 'CustomRadio';
CustomRadio.propTypes = {};

export default CustomRadio;
