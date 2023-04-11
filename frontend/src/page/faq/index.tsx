import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import PicFaqBg from 'src/image/pic-faq-bg.png';
import Question from './Question';

const Faq = () => (
  <div>
    <div className="mx-10 mt-6 font-bold text-[50px]">Frequently Asked Questions</div>
    <div className="mx-10 sm:flex mt-10 gap-8">
      <div className="border-t-2 border-t-black sm:w-1/3 text-[#707070] pt-2 text-[40px] font-bold">
        General
      </div>
      <div className="sm:w-2/3">
        <Question
          question={'How does your service work?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'How do I find a partner?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'Can I join multiple projects?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'Who can join GoTron?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'How to track the order?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
      </div>
    </div>
    <div className="mx-10 sm:flex mt-10 gap-8">
      <div className="border-t-2 border-t-black sm:w-1/3 text-[#707070] pt-2 text-[40px] font-bold">
        Account
      </div>
      <div className="sm:w-2/3">
        <Question
          question={'How to sign up account?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'How to reset password?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'Can I change my username?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'How to change my profile picture?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
        <Question
          question={'How to track the order?'}
          answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'}
        />
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
    <div className="max-w-[630px] mx-auto py-16">
      <Footer />
    </div>
  </div>
);

export default Faq;
