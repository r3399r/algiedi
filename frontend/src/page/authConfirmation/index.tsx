import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import { ConfirmationForm, RegistrationForm } from 'src/model/Form';
import { verify } from 'src/service/AuthService';

const AuthConfirmation = () => {
  const navigate = useNavigate();
  const methods = useForm<ConfirmationForm>();
  const location = useLocation();
  const state = location.state as RegistrationForm | null;

  useEffect(() => {
    if (state === null) navigate(-1);
  }, [state]);

  const onSubmit = (data: ConfirmationForm) => {
    if (state === null) return;
    verify(state.email, data.code).then(() => navigate(Page.Home));
  };

  return (
    <div className="mt-16">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex">
          <div className="rounded-tl-[30px] bg-[#eaeaea] w-[500px] p-6">
            <div className="text-[#7ba0ff] font-bold text-[40px] text-center">Login</div>
          </div>
          <div className="rounded-tr-[30px] bg-[#2d2d2d] w-[500px] p-6">
            <div className="text-white font-bold text-[40px] text-center">Create account</div>
          </div>
        </div>
        <Form
          methods={methods}
          onSubmit={onSubmit}
          className="rounded-b-[30px] bg-[#f5f5f5] w-full p-12"
        >
          <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Email Confirmation</div>
          <div className="text-[#2d2d2d] text-center">
            Please confirm the email sent to your email{' '}
            <span className="text-[#00c3ff]">{state?.email}</span> for security consideration
          </div>
          <FormInput name="code" className="mt-5" placeholder="Code" appearance="underline" />
          <div className="text-center mt-10">
            <Button type="submit">Verify</Button>
          </div>
        </Form>
      </div>
      <div className="max-w-[630px] mx-auto my-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthConfirmation;
