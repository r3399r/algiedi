import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import { RegistrationForm, VerifyForm } from 'src/model/Form';
import { resendVerificationEmail, verify } from 'src/service/AuthService';

const AuthConfirmation = () => {
  const navigate = useNavigate();
  const methods = useForm<VerifyForm>();
  const location = useLocation();
  const state = location.state as RegistrationForm | null;

  useEffect(() => {
    if (state === null) navigate(-1);
  }, [state]);

  const onSubmit = (data: VerifyForm) => {
    if (state === null) return;
    verify(state.email, state.password, data.code).then(() =>
      navigate(Page.Questionnaire, { state }),
    );
  };

  const onResend = () => {
    if (state === null) return;
    resendVerificationEmail(state.email);
  };

  return (
    <div className="mt-16">
      <Form
        methods={methods}
        onSubmit={onSubmit}
        className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12"
      >
        <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Email Confirmation</div>
        <div className="text-[#2d2d2d] text-center">
          Please confirm the email sent to your email{' '}
          <span className="text-[#00c3ff]">{state?.email}</span> for security consideration
        </div>
        <div className="text-[#2d2d2d] flex justify-center gap-2">
          <div>Do not receive the Email?</div>
          <div className="text-[#00c3ff] cursor-pointer" onClick={onResend}>
            Re-send
          </div>
        </div>
        <FormInput name="code" className="mt-5" placeholder="code" appearance="underline" />
        <div className="text-center mt-10">
          <Button type="submit">Verify</Button>
        </div>
      </Form>
      <div className="max-w-[630px] mx-auto my-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthConfirmation;
