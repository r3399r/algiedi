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
        <div className="flex-1 h-screen overflow-y-auto bg-[#eaeaea]">
          <div className="max-w-[1200px] w-[85%] pt-[30px] pb-[90px] mx-auto">
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
