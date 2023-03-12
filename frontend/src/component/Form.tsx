import { ReactNode } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

/**
 * type Form = { a: string, b: string }
 * const methods = useForm<Form>({ defaultValues: { a: 'test' } });
 * const onSubmit = (data: Form) => { ... };
 *
 * <Form methods={methods} onSubmit={onSubmit}>
 * ...
 * </Form>
 * */

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
};

const Form = <T extends FieldValues>({ methods, onSubmit, children, className }: Props<T>) => (
  <FormProvider {...methods}>
    <form className={className} onSubmit={methods.handleSubmit(onSubmit)}>
      {children}
    </form>
  </FormProvider>
);

export default Form;
