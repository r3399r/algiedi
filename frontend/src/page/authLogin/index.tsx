import { Buffer } from 'buffer';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import IcLoginFacebook from 'src/image/ic-login-facebook.svg';
import IcLoginGoogle from 'src/image/ic-login-google.svg';
import { LoginForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { login } from 'src/service/AuthService';

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { code, state } = useQuery();
  const methods = useForm<LoginForm>();
  const location = useLocation();
  const redirect = location.state as { from: string; state: unknown } | undefined;

  useEffect(() => {
    if (code && state)
      fetch(`${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.REACT_APP_FEDERATED_CLIENT_ID}:${process.env.REACT_APP_FEDERATED_SECRET}`,
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.REACT_APP_FEDERATED_CLIENT_ID as string,
          code,
          redirect_uri: `${window.location.origin}/auth/login`,
        }),
      }).then(async (res) => console.log(await res.json()));
  }, [code, state]);

  const onSubmit = (data: LoginForm) => {
    login(data.email, data.password)
      .then((res) => {
        dispatch(openSuccessSnackbar('Login Successfully'));
        if (res !== 'ready') navigate(Page.Questionnaire);
        else {
          if (redirect) {
            navigate(redirect.from, { state: redirect.state });

            return;
          }
          navigate(Page.Profile);
        }
      })
      .catch((err) => {
        if (err === 'User is not confirmed.')
          navigate(Page.Confirmation, { state: { email: data.email } });
        dispatch(openFailSnackbar(err));
      });
  };

  return (
    <div className="mt-16">
      <div className="mx-auto flex max-w-[1000px]">
        <div className="w-[600px] rounded-l-[30px] bg-[#eaeaea] p-12">
          <Form methods={methods} onSubmit={onSubmit} className="mx-auto w-[400px]">
            <div className="text-center text-[40px] font-bold text-[#7ba0ff]">Login</div>
            <div className="mt-6 flex items-center justify-around gap-2">
              <a
                href={`${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_FEDERATED_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/login&state=12345&identity_provider=Facebook`}
                target="_self"
                rel="noreferrer"
              >
                <div className="flex cursor-pointer items-center gap-2 rounded-[30px] bg-white p-2 text-xs font-bold">
                  <img src={IcLoginFacebook} />
                  <div>Sign in with Facebook</div>
                </div>
              </a>
              <div>OR</div>
              <a
                href={`${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_FEDERATED_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/login&state=12345&identity_provider=Google`}
                target="_self"
                rel="noreferrer"
              >
                <div className="flex cursor-pointer items-center gap-2 rounded-[30px] bg-[#4c81e4] p-2 text-xs font-bold text-white">
                  <img src={IcLoginGoogle} />
                  <div>Sign in with Google</div>
                </div>
              </a>
            </div>
            <div className="mt-5">
              <FormInput name="email" label="Email" required autoFocus />
            </div>
            <div className="mt-5">
              <FormInput name="password" label="Password" type="password" required />
            </div>
            <div className="mt-5 flex justify-end text-[#7ba0ff]">
              <div className="cursor-pointer" onClick={() => navigate(Page.Forget)}>
                Forget Password?
              </div>
            </div>
            <div className="mt-10 text-center">
              <Button type="submit">Login</Button>
            </div>
          </Form>
        </div>
        <div className="w-[400px] rounded-r-[30px] bg-[#2d2d2d] p-12">
          <div className="text-center text-[40px] font-bold text-white">Create account</div>
          <div className="mt-10 text-center">
            <Button onClick={() => navigate(Page.Register)}>Sign up</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[630px] py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthLogin;
