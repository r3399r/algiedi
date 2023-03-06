import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import Logo from 'src/image/logo.svg';
import Button from './Button';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mx-4">
      <img src={Logo} className="pt-2 cursor-pointer" onClick={() => navigate(Page.Home)} />
      <div className="flex items-center gap-10">
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
        <Button appearance="border">CREATE NOW</Button>
      </div>
    </div>
  );
};

export default Navbar;
