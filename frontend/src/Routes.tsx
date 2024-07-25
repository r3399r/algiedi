import { useSelector } from 'react-redux';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout';
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
import ExploreUser from './page/exploreUser';
import ExploreUserDetail from './page/exploreUserDetail';
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

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        { path: Page.Home, element: <Home /> },
        { path: Page.AboutUs, element: <AboutUs /> },
        { path: Page.Faq, element: <Faq /> },
        { path: Page.ContatUs, element: <ContactUs /> },
        { path: Page.Explore, element: <Explore /> },
        { path: `${Page.Explore}/song`, element: <ExploreSong /> },
        { path: `${Page.Explore}/idea`, element: <ExploreIdea /> },
        { path: `${Page.Explore}/user`, element: <ExploreUser /> },
        { path: `${Page.Explore}/user/:id`, element: <ExploreUserDetail /> },
        { path: `${Page.Explore}/:id`, element: <ExploreDetail /> },
        { path: Page.Verify, element: <AuthVerify /> },
        ...(isLogin
          ? [
              { path: Page.Questionnaire, element: <AuthQuestionnaire /> },
              { path: Page.Overall, element: <Overall /> },
              { path: Page.Profile, element: <Profile /> },
              { path: Page.Project, element: <Project /> },
              { path: Page.Upload, element: <Upload /> },
              { path: Page.Notification, element: <Notification /> },
            ]
          : [
              { path: Page.Login, element: <AuthLogin /> },
              { path: Page.Register, element: <AuthRegister /> },
              { path: Page.Confirmation, element: <AuthConfirmation /> },
              { path: Page.Forget, element: <AuthForget /> },
              { path: Page.ForgetReset, element: <AuthForgetReset /> },
              {
                path: '*',
                element: <Navigate to={Page.Login} state={{ from: window.location.pathname }} />,
              },
            ]),
        { path: '/*', element: <Navigate to={Page.Home} /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
