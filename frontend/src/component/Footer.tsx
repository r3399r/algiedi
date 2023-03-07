import IcFacebook from 'src/image/ic-facebook.svg';
import IcLinkedIn from 'src/image/ic-linkedin.svg';
import IcTwitter from 'src/image/ic-twitter.svg';
import Divider from './Divider';

const Footer = () => (
  <>
    <Divider />
    <div className="text-center my-5">© Copyrights GoTron 2019</div>
    <div className="flex items-center justify-center gap-6">
      <div className="border-2 border-black rounded-full w-[34px] h-[34px] flex items-center justify-center cursor-pointer">
        <img src={IcTwitter} />
      </div>
      <div className="border-2 border-black rounded-full w-[34px] h-[34px] flex items-center justify-center cursor-pointer">
        <img src={IcFacebook} />
      </div>
      <div className="border-2 border-black rounded-full w-[34px] h-[34px] flex items-center justify-center cursor-pointer">
        <img src={IcLinkedIn} />
      </div>
    </div>
  </>
);

export default Footer;
