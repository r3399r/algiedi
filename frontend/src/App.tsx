import { useLocation } from 'react-router-dom';
import Navbar from './component/Navbar';
import SideMenu from './component/SideMenu';
import { DashboardPage } from './constant/Page';
import AppRoutes from './Routes';

const App = () => {
  const location = useLocation();
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
