import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import { Page } from 'src/constant/Page';
import PicAbout1 from 'src/image/pic-about-1.png';
import PicAbout2 from 'src/image/pic-about-2.png';
import { RootState } from 'src/redux/store';

const AboutUs = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <div>
      <div className="px-4 sm:flex sm:items-center sm:justify-around sm:gap-8">
        <div className="my-16 text-center sm:text-left">
          <div className="text-[98px] font-bold leading-[98px]">About us</div>
          <div className="mt-[80px] text-[70px] font-bold leading-[70px]">
            Inspire & Be Inspired
          </div>
          <div className="mt-16 text-[24px] leading-[24px]">
            Collaboration brings synergy, possibility ignites creativity
          </div>
        </div>
        <div className="sm:max-w-[800px]">
          <img src={PicAbout1} className="mx-auto" />
        </div>
      </div>
      <div className="px-4 sm:flex sm:items-center sm:justify-around sm:gap-8">
        <div className="my-16 text-center sm:order-last sm:text-left">
          <div className="mt-[80px] text-[70px] font-bold leading-[70px]">
            Revolutionize the musical industry
          </div>
          <div className="mt-16 text-[24px] leading-[24px]">
            Minimizing the barrier to music creation) to create a new music development
            collaboration ecosystem with everyone is being heard
          </div>
          <Button className="mt-16" onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}>
            {"LET'S CREATE"}
          </Button>
        </div>
        <div className="sm:max-w-[800px]">
          <img src={PicAbout2} className="mx-auto" />
        </div>
      </div>
      <div className="mx-4 mt-16">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-14 text-[70px] font-bold leading-[70px]">OUR STORY</div>
          <div>
            {
              "In GoTron, we all come together to revolutionize the conventional music development industry. To join hands of our talented musicians in the creation of quality musical pieces, Online. Music production is rolling in the hand of a niche circle. Music doesn't go far without connections. Song composers seek hard for suitable lyrics. Lyricists look forward to an inspiring music piece. Singers are eager to perform their own song. Without knowing each other, pleasant melody may become obsolete (be archived). Meaningful lyrics only be rewritten on existing songs. Great voice will only be heard in covers. Before, talented musicians do not come across each other. Now, GoTron merge them at the crossroad, to team up and create music online. We create a perfect convenient environment for musicians to achieve their dreams. Throughout the rise of social media, publicity is borderless, advertising without limit. GoTron partner (match) our musicians base on the obsession to the quality of music itself. Unlimited possible pairings inspire limitless (infinite) creativity. We empower every musician with passion and dreams in this cozy ecosystem. Bringing “YOU” to shine. Come and join the revolution with other talents and make yourselves heard."
            }
          </div>
          <div className="mt-10 text-center">
            <Button onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}>Join Us</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[630px] py-16">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
