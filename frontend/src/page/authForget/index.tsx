import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { ForgetPasswordForm } from 'src/model/Form';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { sendForgot } from 'src/service/AuthService';

const AuthForget = () => {
  const dispatch = useDispatch();
  const methods = useForm<ForgetPasswordForm>();
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const onSubmit = (data: ForgetPasswordForm) => {
    sendForgot(data.email)
      .then(() => setEmailSent(true))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (!emailSent)
    return (
      <div className="mt-16">
        <Form
          methods={methods}
          onSubmit={onSubmit}
          className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12"
        >
          <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Reset password</div>
          <div className="text-[#2d2d2d] text-center mb-5">
            Enter your email address, we will send you an email to reset the password.
          </div>
          <FormInput name="email" label="Email" required autoFocus />
          <div className="text-center mt-10">
            <Button type="submit">Send</Button>
          </div>
        </Form>
        <div className="max-w-[630px] mx-auto py-16">
          <Footer />
        </div>
      </div>
    );

  return (
    <div className="mt-16">
      <div className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12">
        <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Reset Password</div>
        <div className="text-[#2d2d2d] text-center">
          Please confirm the email sent to your email{' '}
          <span className="text-[#00c3ff]">{methods.getValues('email')}</span> for security
          consideration
        </div>
      </div>
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthForget;
