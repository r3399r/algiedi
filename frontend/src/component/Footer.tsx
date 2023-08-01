import IcFacebook from 'src/image/ic-facebook.svg';
import IcLinkedIn from 'src/image/ic-linkedin.svg';
import IcTwitter from 'src/image/ic-twitter.svg';
import Divider from './Divider';

const Footer = () => (
  <>
    <Divider />
    <div className="my-5 text-center">© Copyrights GoTron 2019</div>
    <div className="flex items-center justify-center gap-6">
      <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-black">
        <img src={IcTwitter} />
      </div>
      <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-black">
        <img src={IcFacebook} />
      </div>
      <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-black">
        <img src={IcLinkedIn} />
      </div>
    </div>
  </>
);

export default Footer;
