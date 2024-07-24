import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AudioBox from './component/AudioBox';
import Loader from './component/Loader';
import Navbar from './component/Navbar';
import SideMenu from './component/SideMenu';
import Snackbar from './component/Snackbar';
import SnackbarChat from './component/SnackbarChat';
import { DashboardPage, Page } from './constant/Page';
import { RootState } from './redux/store';
import { wsInit } from './service/AppService';
import { emitter } from './util/eventBus';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: userId } = useSelector((rootState: RootState) => rootState.me);

  useEffect(() => {
    emitter.on('auth-expired', () => navigate(Page.Login));
  }, []);

  useEffect(() => {
    wsInit();
  }, [userId]);

  const isDashboard =
    DashboardPage.find((value) => location.pathname.startsWith(value)) !== undefined;

  return (
    <>
      {!location.pathname.startsWith('/auth') && <AudioBox />}
      {isDashboard && (
        <>
          <div className="flex">
            <SideMenu />
            <div className="h-screen flex-1 overflow-y-auto bg-[#eaeaea]">
              <div className="mx-auto w-[85%] max-w-[1200px] pb-[90px] pt-[30px]">
                <Outlet />
              </div>
            </div>
          </div>
        </>
      )}
      {!isDashboard && (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
      <Loader />
      <Snackbar />
      <SnackbarChat />
    </>
  );
};

export default AppLayout;
