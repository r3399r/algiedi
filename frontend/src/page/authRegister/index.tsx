import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import IcLoginFacebook from 'src/image/ic-login-facebook.svg';
import IcLoginGoogle from 'src/image/ic-login-google.svg';
import { RegistrationForm } from 'src/model/Form';
import { register } from 'src/service/AuthService';

const AuthRegister = () => {
  const navigate = useNavigate();
  const methods = useForm<RegistrationForm>();

  const onSubmit = (data: RegistrationForm) => {
    register(data).then(() => {
      navigate(Page.Confirmation, { state: data });
    });
  };

  return (
    <div className="mt-16">
      <div className="max-w-[1000px] mx-auto flex">
        <div className="rounded-l-[30px] bg-[#2d2d2d] w-[400px] p-12">
          <div className="text-white font-bold text-[40px] text-center">Login</div>
          <div className="text-center mt-10">
            <Button onClick={() => navigate(Page.Login)}>Login</Button>
          </div>
        </div>
        <Form
          methods={methods}
          onSubmit={onSubmit}
          className="rounded-r-[30px] bg-[#eaeaea] w-[600px] p-12"
        >
          <div className="w-[400px] mx-auto">
            <div className="text-[#7ba0ff] font-bold text-[40px] text-center">Create account</div>
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
            <FormInput
              name="firstName"
              className="mt-5"
              placeholder="First name"
              type="text"
              appearance="underline"
            />
            <FormInput
              name="lastName"
              className="mt-5"
              placeholder="Last name"
              type="text"
              appearance="underline"
            />
            <div className="text-center mt-10">
              <Button type="submit">Sign up</Button>
            </div>
          </div>
        </Form>
      </div>
      <div className="max-w-[630px] mx-auto my-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthRegister;
