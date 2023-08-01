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
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
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
      confirmForgot(query.email, data.password, query.code)
        .then(() => {
          dispatch(openSuccessSnackbar('Password Reset Successfully'));
          navigate(Page.Login);
        })
        .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div className="mt-16">
      <Form
        methods={methods}
        onSubmit={onSubmit}
        className="mx-auto max-w-[1000px] rounded-[30px] bg-[#f5f5f5] p-12"
      >
        <div className="text-center text-[40px] font-bold text-[#8ea1d0]">Reset password</div>
        <div className="text-center text-[#2d2d2d]">Please enter your new password.</div>
        <div className="mt-5">
          <Input value={query.email} label="Email" />
        </div>
        <div className="mt-5">
          <FormInput name="password" label="Password" type="password" required />
        </div>
        <div className="mt-5">
          <FormInput name="confirmPassword" label="Confirm Password" type="password" required />
        </div>
        <div className="mt-10 text-center">
          <Button type="submit">Reset</Button>
        </div>
      </Form>
      <div className="mx-auto max-w-[630px] py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthForgetReset;
