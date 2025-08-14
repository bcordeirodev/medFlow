'use client';

import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel,
  TextFieldProps,
  SelectProps,
  AutocompleteProps,
  SwitchProps,
} from '@mui/material';

export interface BaseFieldProps {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

// Text Field Component
interface TextFieldComponentProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  textFieldProps?: Partial<TextFieldProps>;
}

export const FormTextField: React.FC<TextFieldComponentProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  type = 'text',
  multiline = false,
  rows,
  placeholder,
  required = false,
  disabled = false,
  textFieldProps,
}) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      type={type}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      fullWidth
      variant="outlined"
      error={touched && !!error}
      helperText={touched && error ? error : helperText}
      {...textFieldProps}
    />
  );
};

// Select Field Component
interface SelectFieldProps extends BaseFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  selectProps?: Partial<SelectProps>;
}

export const FormSelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  options,
  required = false,
  disabled = false,
  selectProps,
}) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={touched && !!error}
      disabled={disabled}
    >
      <FormLabel required={required}>{label}</FormLabel>
      <Select
        name={name}
        value={value}
        onChange={e => onChange(e.target.value as string | number)}
        onBlur={onBlur}
        label={label}
        {...selectProps}
      >
        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(touched && error) || helperText ? (
        <FormHelperText>{touched && error ? error : helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

// Autocomplete Field Component
interface AutocompleteFieldProps<T> extends BaseFieldProps {
  value: T | null;
  onChange: (value: T | null) => void;
  onBlur?: () => void;
  options: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  loading?: boolean;
  freeSolo?: boolean;
  multiple?: boolean;
  autocompleteProps?: Partial<AutocompleteProps<T, boolean, boolean, boolean>>;
}

export const FormAutocompleteField = <T,>({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  loading = false,
  freeSolo = false,
  multiple = false,
  required = false,
  disabled = false,
  autocompleteProps,
}: AutocompleteFieldProps<T>) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel as any}
      isOptionEqualToValue={isOptionEqualToValue}
      value={value}
      onChange={(_, newValue) => onChange(newValue as T | null)}
      onBlur={onBlur}
      loading={loading}
      freeSolo={freeSolo}
      multiple={multiple as any}
      disabled={disabled}
      renderInput={params => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={touched && !!error}
          helperText={touched && error ? error : helperText}
          variant="outlined"
          fullWidth
        />
      )}
      {...autocompleteProps}
    />
  );
};

// Switch Field Component
interface SwitchFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  switchProps?: Partial<SwitchProps>;
}

export const FormSwitchField: React.FC<SwitchFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  required = false,
  disabled = false,
  switchProps,
}) => {
  return (
    <FormControl error={touched && !!error} disabled={disabled}>
      <FormControlLabel
        control={
          <Switch
            name={name}
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            onBlur={onBlur}
            required={required}
            {...switchProps}
          />
        }
        label={label}
      />
      {(touched && error) || helperText ? (
        <FormHelperText>{touched && error ? error : helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};
