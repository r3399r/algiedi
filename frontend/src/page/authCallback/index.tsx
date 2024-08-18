import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { login2 } from 'src/service/AuthService';

const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { code, state } = useQuery();

  useEffect(() => {
    if (state !== sessionStorage.getItem('login-google-state')) navigate(Page.Login);
    else
      login2(code, `${window.location.origin}/auth/callback`)
        .then(() => {
          navigate(Page.Profile);
        })
        .catch((err) => {
          navigate(Page.Login);
          dispatch(openFailSnackbar(err));
        });
  }, [code, state]);

  return <div />;
};

export default AuthCallback;
