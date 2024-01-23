import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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
      <div className="mx-auto max-w-[1000px] rounded-[30px] bg-[#f5f5f5] p-12">
        <div className="text-center text-[40px] font-bold text-[#8ea1d0]">Email Confirmation</div>
        <div className="text-center text-[#2d2d2d]">
          Please confirm the email sent to your email{' '}
          <span className="text-[#00c3ff]">{state?.email}</span> for security consideration
        </div>
        <div className="flex items-center justify-center gap-2 text-[#2d2d2d]">
          <div>Do not receive the Email?</div>
          <div className="cursor-pointer text-[#00c3ff]" onClick={onResend}>
            Resend
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthConfirmation;
