import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import IcLoginFacebook from 'src/image/ic-login-facebook.svg';
import IcLoginGoogle from 'src/image/ic-login-google.svg';
import { RegistrationForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { register } from 'src/service/AuthService';

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm<RegistrationForm>();

  const onSubmit = (data: RegistrationForm) => {
    if (data.password !== data.confirmPassword)
      methods.setError(
        'confirmPassword',
        { message: 'It should be as same as Password' },
        { shouldFocus: true },
      );
    else
      register(data)
        .then(() => {
          dispatch(openSuccessSnackbar('Register Successfully'));
          navigate(Page.Confirmation, { state: data });
        })
        .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div className="mt-16">
      <div className="mx-auto flex max-w-[1000px]">
        <div className="w-[400px] rounded-l-[30px] bg-[#2d2d2d] p-12">
          <div className="text-center text-[40px] font-bold text-white">Login</div>
          <div className="mt-10 text-center">
            <Button onClick={() => navigate(Page.Login)}>Login</Button>
          </div>
        </div>
        <Form
          methods={methods}
          onSubmit={onSubmit}
          className="w-[600px] rounded-r-[30px] bg-[#eaeaea] p-12"
        >
          <div className="mx-auto w-[400px]">
            <div className="text-center text-[40px] font-bold text-[#7ba0ff]">Create account</div>
            <div className="mt-6 flex items-center justify-around gap-4">
              <div className="flex cursor-pointer items-center gap-2 rounded-[30px] bg-white p-2 text-xs font-bold">
                <img src={IcLoginFacebook} />
                <div>Sign in with Facebook</div>
              </div>
              <div>OR</div>
              <div className="flex cursor-pointer items-center gap-2 rounded-[30px] bg-[#4c81e4] p-2 text-xs font-bold text-white">
                <img src={IcLoginGoogle} />
                <div>Sign in with Google</div>
              </div>
            </div>
            <div className="mt-5">
              <FormInput name="email" label="Email" required type="email" />
            </div>
            <div className="mt-5">
              <FormInput
                name="password"
                label="Password"
                type="password"
                required
                tooltip="At least 1 upper case charater, 1 lower case character, 1 number, and 8 characters"
              />
            </div>
            <div className="mt-5">
              <FormInput name="confirmPassword" label="Confirm Password" type="password" required />
            </div>
            <div className="mt-5">
              <FormInput name="userName" label="User Name" type="text" required />
            </div>
            <div className="mt-10 text-center">
              <Button type="submit">Sign up</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AuthRegister;
