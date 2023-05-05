import { Controller, useFormContext } from 'react-hook-form';
import Textarea, { Props as TextareaProps } from './Textarea';

/**
 * This component should be put inside Form component:
 * <Form methods={methods} onSubmit={onSubmit}>
 *   <FormTextarea name="a" />
 * </Form>
 * */

type Props = TextareaProps & {
  name: string;
  required?: boolean;
};

const FormTextarea = ({ name, required = false, defaultValue, ...props }: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ''}
      rules={{ required }}
      render={({ field }) => (
        <Textarea
          {...field}
          {...props}
          error={errors[name]?.message?.toString() || !!errors[name]}
        />
      )}
    />
  );
};

export default FormTextarea;
