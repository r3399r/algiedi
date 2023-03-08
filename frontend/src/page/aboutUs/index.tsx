import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import PicAbout1 from 'src/image/pic-about-1.png';
import PicAbout2 from 'src/image/pic-about-2.png';

const AboutUs = () => (
  <div>
    <div className="px-4 sm:flex sm:items-center sm:justify-around sm:gap-8">
      <div className="text-center my-16 sm:text-left">
        <div className="text-[98px] font-bold leading-[98px]">About us</div>
        <div className="text-[70px] font-bold leading-[70px] mt-[80px]">Inspire & Be Inspired</div>
        <div className="text-[24px] leading-[24px] mt-16">
          Collaboration brings synergy, possibility ignites creativity
        </div>
      </div>
      <div className="sm:max-w-[800px]">
        <img src={PicAbout1} className="mx-auto" />
      </div>
    </div>
    <div className="px-4 sm:flex sm:items-center sm:justify-around sm:gap-8">
      <div className="text-center my-16 sm:text-left sm:order-last">
        <div className="text-[70px] font-bold leading-[70px] mt-[80px]">
          Revolutionize the musical industry
        </div>
        <div className="text-[24px] leading-[24px] mt-16">
          Minimizing the barrier to music creation) to create a new music development collaboration
          ecosystem with everyone is being heard
        </div>
        <Button className="mt-16">{"LET'S CREATE"}</Button>
      </div>
      <div className="sm:max-w-[800px]">
        <img src={PicAbout2} className="mx-auto" />
      </div>
    </div>
    <div className="mt-16 mx-4">
      <div className="max-w-[900px] mx-auto">
        <div className="text-[70px] font-bold leading-[70px] mb-14">OUR STORY</div>
        <div>
          {
            "In GoTron, we all come together to revolutionize the conventional music development industry. To join hands of our talented musicians in the creation of quality musical pieces, Online. Music production is rolling in the hand of a niche circle. Music doesn't go far without connections. Song composers seek hard for suitable lyrics. Lyricists look forward to an inspiring music piece. Singers are eager to perform their own song. Without knowing each other, pleasant melody may become obsolete (be archived). Meaningful lyrics only be rewritten on existing songs. Great voice will only be heard in covers. Before, talented musicians do not come across each other. Now, GoTron merge them at the crossroad, to team up and create music online. We create a perfect convenient environment for musicians to achieve their dreams. Throughout the rise of social media, publicity is borderless, advertising without limit. GoTron partner (match) our musicians base on the obsession to the quality of music itself. Unlimited possible pairings inspire limitless (infinite) creativity. We empower every musician with passion and dreams in this cozy ecosystem. Bringing “YOU” to shine. Come and join the revolution with other talents and make yourselves heard."
          }
        </div>
        <div className="text-center mt-10">
          <Button>Join Us</Button>
        </div>
      </div>
    </div>
    <div className="max-w-[630px] mx-auto my-16">
      <Footer />
    </div>
  </div>
);

export default AboutUs;
