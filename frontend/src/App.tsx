import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './component/Navbar';
import SideMenu from './component/SideMenu';
import { DashboardPage, Page } from './constant/Page';
import AppRoutes from './Routes';
import { emitter } from './util/eventBus';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    emitter.on('auth-expired', () => navigate(Page.Login));
  }, []);

  const isDashboard =
    DashboardPage.find((value) => location.pathname.startsWith(value)) !== undefined;

  if (isDashboard)
    return (
      <div className="flex">
        <SideMenu />
        <div className="h-screen flex-1 overflow-y-auto bg-[#eaeaea]">
          <div className="mx-auto w-[85%] max-w-[1200px] pb-[90px] pt-[30px]">
            <AppRoutes />
          </div>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
};

export default App;
