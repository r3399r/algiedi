import { Controller, useFormContext } from 'react-hook-form';
import Input, { Props as InputProps } from './Input';

/**
 * This component should be put inside Form component:
 * <Form methods={methods} onSubmit={onSubmit}>
 *   <FormInput name="a" />
 * </Form>
 * */

type Props = InputProps & {
  name: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
};

const FormInput = ({
  name,
  required = false,
  minLength,
  maxLength,
  defaultValue,
  ...props
}: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ''}
      rules={{ required, minLength, maxLength }}
      render={({ field }) => (
        <Input {...field} {...props} error={errors[name]?.message?.toString() || !!errors[name]} />
      )}
    />
  );
};

export default FormInput;
