import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { verifyAccount } from 'src/service/AuthService';

const AuthVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery<{ email: string; code: string }>();

  useEffect(() => {
    if (query.email.length === 0 || query.code.length === 0) navigate(Page.Home);
    verifyAccount(decodeURIComponent(query.email), query.code)
      .then(() => {
        dispatch(openSuccessSnackbar('Verified successfully. Please login again'));
      })
      .catch((err) => {
        dispatch(openFailSnackbar(err));
      })
      .finally(() => {
        navigate(Page.Home);
      });
  }, [query]);

  return <div />;
};

export default AuthVerify;
