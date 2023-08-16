import { useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Page } from './constant/Page';
import AboutUs from './page/aboutUs';
import AuthConfirmation from './page/authConfirmation';
import AuthForget from './page/authForget';
import AuthForgetReset from './page/authForgetReset';
import AuthLogin from './page/authLogin';
import AuthQuestionnaire from './page/authQuestionnaire';
import AuthRegister from './page/authRegister';
import AuthVerify from './page/authVerify';
import ContactUs from './page/contactUs';
import Explore from './page/explore';
import ExploreDetail from './page/exploreDetail';
import ExploreIdea from './page/exploreIdea';
import ExploreSong from './page/exploreSong';
import Faq from './page/faq';
import Home from './page/home';
import Notification from './page/notification';
import Overall from './page/overall';
import Profile from './page/profile';
import Project from './page/project';
import Upload from './page/upload';
import { RootState } from './redux/store';

const AppRoutes = () => {
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const location = useLocation();

  return (
    <Routes>
      <Route path={Page.Home} element={<Home />} />
      <Route path={Page.AboutUs} element={<AboutUs />} />
      <Route path={Page.Faq} element={<Faq />} />
      <Route path={Page.ContatUs} element={<ContactUs />} />
      <Route path={Page.Explore} element={<Explore />} />
      <Route path={`${Page.Explore}/song`} element={<ExploreSong />} />
      <Route path={`${Page.Explore}/idea`} element={<ExploreIdea />} />
      <Route path={`${Page.Explore}/:id`} element={<ExploreDetail />} />
      <Route path={Page.Verify} element={<AuthVerify />} />
      {!isLogin && (
        <>
          <Route path={Page.Login} element={<AuthLogin />} />
          <Route path={Page.Register} element={<AuthRegister />} />
          <Route path={Page.Confirmation} element={<AuthConfirmation />} />
          <Route path={Page.Forget} element={<AuthForget />} />
          <Route path={Page.ForgetReset} element={<AuthForgetReset />} />
          <Route
            path="*"
            element={<Navigate to={Page.Login} state={{ from: location.pathname }} />}
          />
        </>
      )}
      {isLogin && (
        <>
          <Route path={Page.Questionnaire} element={<AuthQuestionnaire />} />
          <Route path={Page.Overall} element={<Overall />} />
          <Route path={Page.Profile} element={<Profile />} />
          <Route path={Page.Project} element={<Project />} />
          <Route path={Page.Upload} element={<Upload />} />
          <Route path={Page.Notification} element={<Notification />} />
        </>
      )}
      <Route path="/*" element={<Navigate to={Page.Home} />} />
    </Routes>
  );
};

export default AppRoutes;
