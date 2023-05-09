import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import IcArrow from 'src/image/ic-arrow-r.svg';
import IcFeature1 from 'src/image/ic-feature-1.svg';
import IcFeature2 from 'src/image/ic-feature-2.svg';
import IcFeature3 from 'src/image/ic-feature-3.svg';
import IcFeature4 from 'src/image/ic-feature-4.svg';
import IcFeature5 from 'src/image/ic-feature-5.svg';
import IcFeature6 from 'src/image/ic-feature-6.svg';
import IcStep1 from 'src/image/ic-step-1.svg';
import IcStep2 from 'src/image/ic-step-2.svg';
import IcStep3 from 'src/image/ic-step-3.svg';
import IcStep4 from 'src/image/ic-step-4.svg';
import PicHero2 from 'src/image/pic-hero-2.png';
import PicHero3 from 'src/image/pic-hero-3.png';
import PicHero4 from 'src/image/pic-hero-4.png';
import PicHero from 'src/image/pic-hero.png';

const Home = () => (
  <div>
    <div className="px-4 sm:flex sm:items-center sm:justify-around sm:px-10">
      <div className="text-center sm:text-left">
        <div className="text-[40px] leading-[40px] xs:text-[60px] font-bold xs:leading-[60px] my-12">
          GoTron,
          <br />
          create together
        </div>
        <Button className="text-2xl sm:mt-10">CREATE NOW</Button>
      </div>
      <div>
        <div className="sm:max-w-[800px]">
          <img src={PicHero} className="mx-auto" />
        </div>
      </div>
    </div>
    <div className="py-36 bg-gradient-to-l from-[#fff8c4] to-[#00c3ff] text-center">
      <div className="text-white text-4xl font-bold mb-16">Create Together</div>
      <div className="bg-white p-3 xs:p-12 mx-4 sm:mx-auto sm:max-w-[990px] border-[1px] border-[#707070] rounded-3xl xs:rounded-[80px]">
        <div className="flex flex-wrap justify-between items-center gap-1 xs:gap-4">
          <div className="flex flex-col items-center gap-6">
            <div className="text-[20px] leading-[24px]">Share your Creation</div>
            <img src={IcStep1} />
          </div>
          <div>
            <img src={IcArrow} />
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="text-[20px] leading-[24px]">Inspire & Be Inspired</div>
            <img src={IcStep2} />
          </div>
          <div>
            <img src={IcArrow} />
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="text-[20px] leading-[24px]">Add partner</div>
            <img src={IcStep3} />
          </div>
          <div>
            <img src={IcArrow} />
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="text-[20px] leading-[24px]">Make music</div>
            <img src={IcStep4} />
          </div>
        </div>
        <Button className="px-auto mt-12 text-2xl">{"LET'S CREATE"}</Button>
      </div>
    </div>
    <div className="py-[200px] px-4 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-[40px] font-bold mb-16">Features (What we provide...)</div>
        <div className="flex flex-wrap gap-4 sm:gap-12">
          <div className="w-auto sm:w-[calc((100%-100px)/3)] rounded-[19px] bg-white text-center p-8">
            <img src={IcFeature1} className="mx-auto" />
            <div className="text-[35px] bold my-4">Great Quality</div>
            <div className="text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </div>
          </div>
          <div className="w-auto sm:w-[calc((100%-100px)/3)] rounded-[19px] bg-white text-center p-8">
            <img src={IcFeature2} className="mx-auto" />
            <div className="text-[35px] bold my-4">Great Quality</div>
            <div className="text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </div>
          </div>
          <div className="w-auto sm:w-[calc((100%-100px)/3)] rounded-[19px] bg-white text-center p-8">
            <img src={IcFeature3} className="mx-auto" />
            <div className="text-[35px] bold my-4">Great Quality</div>
            <div className="text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </div>
          </div>
          <div className="w-auto sm:w-[calc((100%-100px)/3)] rounded-[19px] bg-white text-center p-8">
            <img src={IcFeature4} className="mx-auto" />
            <div className="text-[35px] bold my-4">Great Quality</div>
            <div className="text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </div>
          </div>
          <div className="w-auto sm:w-[calc((100%-100px)/3)] rounded-[19px] bg-white text-center p-8">
            <img src={IcFeature5} className="mx-auto" />
            <div className="text-[35px] bold my-4">Great Quality</div>
            <div className="text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </div>
          </div>
          <div className="w-auto sm:w-[calc((100%-100px)/3)] rounded-[19px] bg-white text-center p-8">
            <img src={IcFeature6} className="mx-auto" />
            <div className="text-[35px] bold my-4">Great Quality</div>
            <div className="text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="py-[100px] px-4 flex items-center flex-wrap">
      <div className="w-full sm:w-1/2">
        <img src={PicHero2} />
      </div>
      <div className="w-full sm:w-1/2 sm:p-16">
        <div className="mb-10 text-[40px] font-bold break-words">Music/Lyrics/Artists</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad
        </div>
        <Button className="mt-[100px] text-2xl">Explore</Button>
      </div>
    </div>
    <div className="flex mb-14">
      <img className="w-1/2" src={PicHero3} />
      <img className="w-1/2" src={PicHero4} />
    </div>
    <div className="max-w-[630px] mx-auto mb-16">
      <Footer />
    </div>
  </div>
);

export default Home;
