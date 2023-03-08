import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import IcPlus from 'src/image/ic-plus.svg';
import PicFaqBg from 'src/image/pic-faq-bg.png';

const Faq = () => (
  <div>
    <div className="mx-10 mt-6 font-bold text-[50px]">Frequently Asked Questions</div>
    <div className="mx-10 sm:flex mt-10 gap-8">
      <div className="border-t-2 border-t-black sm:w-1/3 text-[#707070] pt-2 text-[40px] font-bold">
        General
      </div>
      <div className="sm:w-2/3">
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How does your service work?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How do I find a partner?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>Can I join multiple projects?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>Who can join GoTron?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How to track the order?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
      </div>
    </div>
    <div className="mx-10 sm:flex mt-10 gap-8">
      <div className="border-t-2 border-t-black sm:w-1/3 text-[#707070] pt-2 text-[40px] font-bold">
        Account
      </div>
      <div className="sm:w-2/3">
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How to sign up account?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How to reset password?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>Can I change my username?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How to change my profile picture?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
        <div className="border-t-2 border-t-black flex items-center justify-between h-[60px]">
          <div>How to track the order?</div>
          <div className="w-[35px]">
            <img src={IcPlus} />
          </div>
        </div>
      </div>
    </div>
    <div className="relative h-fit">
      <img src={PicFaqBg} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div>
          Still need help?
          <br />
          Feel free to contact us :)
        </div>
        <Button className="mt-2">Join Us</Button>
      </div>
    </div>
    <div className="max-w-[630px] mx-auto my-16">
      <Footer />
    </div>
  </div>
);

export default Faq;
