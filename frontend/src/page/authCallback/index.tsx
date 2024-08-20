import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { loginByGoogle } from 'src/service/AuthService';

const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { code, state } = useQuery();

  useEffect(() => {
    if (state !== sessionStorage.getItem('login-google-state')) navigate(Page.Login);
    else
      loginByGoogle(code, `${window.location.origin}/auth/callback`)
        .then((res) => {
          dispatch(openSuccessSnackbar('Login Successfully'));
          if (res === false) navigate(Page.Questionnaire);
          else navigate(Page.Profile);
        })
        .catch((err) => {
          navigate(Page.Login);
          dispatch(openFailSnackbar(err));
        });
  }, [code, state]);

  return <div />;
};

export default AuthCallback;
