import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import { ResetPasswordForm } from 'src/model/Form';
import { confirmForgot, sendForgot } from 'src/service/AuthService';

const AuthForget = () => {
  const navigate = useNavigate();
  const methods = useForm<ResetPasswordForm>();
  const [sent, setSent] = useState<boolean>(false);

  const onSubmit = (data: ResetPasswordForm) => {
    if (!sent) sendForgot(data.email).then(() => setSent(true));
    else confirmForgot(data.email, data.password, data.code).then(() => navigate(Page.Home));
  };

  return (
    <div className="mt-16">
      <Form
        methods={methods}
        onSubmit={onSubmit}
        className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12"
      >
        <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Reset password</div>
        <div className="text-[#2d2d2d] text-center">
          Enter your email address, we will send you an email to reset the password.
        </div>
        <FormInput
          name="email"
          className="mt-5"
          placeholder="Email"
          appearance="underline"
          required
        />
        {sent && (
          <FormInput
            name="code"
            className="mt-5"
            placeholder="code"
            appearance="underline"
            required
          />
        )}
        {sent && (
          <FormInput
            name="password"
            className="mt-5"
            placeholder="New Password"
            appearance="underline"
            required
            type="password"
          />
        )}
        <div className="text-center mt-10">
          <Button type="submit">{sent ? 'Reset Password' : 'Send'}</Button>
        </div>
      </Form>
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthForget;
