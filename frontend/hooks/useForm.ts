import { useCallback, useMemo, useState } from 'react';
import { ZodError, ZodSchema } from 'zod';

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  handleChange: (
    field: keyof T
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (event: React.FormEvent) => void;
  resetForm: () => void;
  setValues: (values: T) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: keyof T) => {
      if (!validationSchema) return;

      try {
        validationSchema.parse(values);
        setErrors(prev => ({ ...prev, [field]: undefined }));
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldError = error.issues.find((err: any) =>
            err.path.includes(field as string)
          );
          if (fieldError) {
            setErrors(prev => ({ ...prev, [field]: fieldError.message }));
          }
        }
      }
    },
    [values, validationSchema]
  );

  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const formErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((err: any) => {
          const field = err.path[0] as keyof T;
          if (field) {
            formErrors[field] = err.message;
          }
        });
        setErrors(formErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [field]: value }));

      if (validateOnChange) {
        setTimeout(() => validateField(field), 0);
      }
    },
    [validateOnChange, validateField]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const handleChange = useCallback(
    (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, type, checked } = event.target;
      const fieldValue = type === 'checkbox' ? checked : value;
      setFieldValue(field, fieldValue);
    },
    [setFieldValue]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setFieldTouched(field, true);

      if (validateOnBlur) {
        validateField(field);
      }
    },
    [setFieldTouched, validateOnBlur, validateField]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const isFormValid = validateForm();
      if (!isFormValid) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Calcula isValid com base na validação do schema
  const isValid = useMemo(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      return true;
    } catch {
      return false;
    }
  }, [values, validationSchema]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
    validateField,
    validateForm,
  };
}
