import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from 'src/component/Footer';
import { RegistrationForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { resendConfirmationEmail } from 'src/service/AuthService';

const AuthConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RegistrationForm | null;

  useEffect(() => {
    if (state === null) navigate(-1);
  }, [state]);

  const onResend = () => {
    if (state === null) return;
    resendConfirmationEmail(state.email)
      .then(() => dispatch(openSuccessSnackbar('Resent successfully')))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div className="mt-16">
      <div className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12">
        <div className="text-[#8ea1d0] font-bold text-[40px] text-center">Email Confirmation</div>
        <div className="text-[#2d2d2d] text-center">
          Please confirm the email sent to your email{' '}
          <span className="text-[#00c3ff]">{state?.email}</span> for security consideration
        </div>
        <div className="text-[#2d2d2d] flex justify-center items-center gap-2">
          <div>Do not receive the Email?</div>
          <div className="text-[#00c3ff] cursor-pointer" onClick={onResend}>
            Resend
          </div>
        </div>
      </div>
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthConfirmation;
