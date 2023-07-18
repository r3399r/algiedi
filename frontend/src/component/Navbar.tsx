import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import Logo from 'src/image/logo.svg';
import { RootState } from 'src/redux/store';
import Button from './Button';
import NavbarDrawer from './NavbarDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mx-4">
        <img src={Logo} className="pt-2 cursor-pointer" onClick={() => navigate(Page.Home)} />
        <div className="hidden sm:flex items-center gap-10">
          <div
            className="hover:underline decoration-blue-300 cursor-pointer"
            onClick={() => navigate(Page.Explore)}
          >
            Explore
          </div>
          <div
            className="hover:underline decoration-blue-300 cursor-pointer"
            onClick={() => navigate(Page.AboutUs)}
          >
            About
          </div>
          <div
            className="hover:underline decoration-blue-300 cursor-pointer"
            onClick={() => navigate(Page.Faq)}
          >
            FAQ
          </div>
          <div
            className="hover:underline decoration-blue-300 cursor-pointer"
            onClick={() => navigate(Page.ContatUs)}
          >
            Contact Us
          </div>
          <Button onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}>Create Now</Button>
        </div>
        <div className="sm:hidden" onClick={() => setOpen(true)}>
          Menu
        </div>
      </div>
      <NavbarDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
