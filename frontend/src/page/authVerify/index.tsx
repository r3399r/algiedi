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
        navigate(Page.Questionnaire);
      })
      .catch((err) => {
        navigate(Page.Home);
        dispatch(openFailSnackbar(err));
      });
  }, [query]);

  return <div />;
};

export default AuthVerify;
