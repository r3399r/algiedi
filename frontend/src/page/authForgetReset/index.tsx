import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import Input from 'src/component/Input';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import { ResetPasswordForm } from 'src/model/Form';
import { openSuccessSnackbar } from 'src/redux/uiSlice';
import { confirmForgot } from 'src/service/AuthService';

const AuthForgetReset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery<{ email: string; code: string }>();
  const methods = useForm<ResetPasswordForm>();

  useEffect(() => {
    if (query.email.length === 0 || query.code.length === 0) navigate(Page.Home);
  }, [query]);

  const onSubmit = (data: ResetPasswordForm) => {
    if (data.password !== data.confirmPassword)
      methods.setError(
        'confirmPassword',
        { message: 'It should be as same as Password' },
        { shouldFocus: true },
      );
    else
      confirmForgot(query.email, data.password, query.code).then(() => {
        dispatch(openSuccessSnackbar('Password Reset Successfully'));
        navigate(Page.Login);
      });
  };

  return (
    <div className="mt-16">
      <Form
        methods={methods}
        onSubmit={onSubmit}
        className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12"
      >
        <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Reset password</div>
        <div className="text-[#2d2d2d] text-center">Please enter your new password.</div>
        <Input value={query.email} className="mt-5" appearance="underline" />
        <FormInput
          name="password"
          className="mt-5"
          placeholder="Password"
          type="password"
          appearance="underline"
          required
        />
        <FormInput
          name="confirmPassword"
          className="mt-5"
          placeholder="Confirm Password"
          type="password"
          appearance="underline"
          required
        />
        <div className="text-center mt-10">
          <Button type="submit">Reset</Button>
        </div>
      </Form>
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthForgetReset;
