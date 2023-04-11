import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import IcLoginFacebook from 'src/image/ic-login-facebook.svg';
import IcLoginGoogle from 'src/image/ic-login-google.svg';
import { LoginForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { login } from 'src/service/AuthService';

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm<LoginForm>();
  const location = useLocation();
  const redirectPath = location.state as { from: string } | undefined;

  const onSubmit = (data: LoginForm) => {
    login(data.email, data.password)
      .then(() => {
        dispatch(openSuccessSnackbar('Login Successfully'));
        if (redirectPath) {
          navigate(redirectPath.from);

          return;
        }
        navigate(Page.Profile);
      })
      .catch((err) => {
        if (err === 'User is not confirmed.')
          navigate(Page.Confirmation, { state: { email: data.email } });
        dispatch(openFailSnackbar(err));
      });
  };

  return (
    <div className="mt-16">
      <div className="max-w-[1000px] mx-auto flex">
        <div className="rounded-l-[30px] bg-[#eaeaea] w-[600px] p-12">
          <Form methods={methods} onSubmit={onSubmit} className="w-[400px] mx-auto">
            <div className="text-[#7ba0ff] font-bold text-[40px] text-center">Login</div>
            <div className="flex gap-4 mt-6 items-center justify-around">
              <div className="bg-white rounded-[30px] text-xs font-bold flex p-2 gap-2 items-center cursor-pointer">
                <img src={IcLoginFacebook} />
                <div>Sign in with Facebook</div>
              </div>
              <div>OR</div>
              <div className="bg-[#4c81e4] text-white rounded-[30px] text-xs font-bold flex p-2 gap-2 items-center cursor-pointer">
                <img src={IcLoginGoogle} />
                <div>Sign in with Google</div>
              </div>
            </div>
            <FormInput name="email" className="mt-5" placeholder="Email" appearance="underline" />
            <FormInput
              name="password"
              className="mt-5"
              placeholder="Password"
              type="password"
              appearance="underline"
            />
            <div className="flex justify-end mt-5 text-[#7ba0ff]">
              <div className="cursor-pointer" onClick={() => navigate(Page.Forget)}>
                Forget Password?
              </div>
            </div>
            <div className="text-center mt-10">
              <Button>Login</Button>
            </div>
          </Form>
        </div>
        <div className="rounded-r-[30px] bg-[#2d2d2d] w-[400px] p-12">
          <div className="text-white font-bold text-[40px] text-center">Create account</div>
          <div className="text-center mt-10">
            <Button onClick={() => navigate(Page.Register)}>Sign up</Button>
          </div>
        </div>
      </div>
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthLogin;
