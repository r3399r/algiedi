import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import { Page } from 'src/constant/Page';
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
import { RootState } from 'src/redux/store';

const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <div>
      <div className="px-4 sm:flex sm:items-center sm:justify-around sm:px-10">
        <div className="text-center sm:text-left">
          <div className="my-12 text-[40px] font-bold leading-[40px] xs:text-[60px] xs:leading-[60px]">
            GoTron,
            <br />
            create together
          </div>
          <Button
            className="text-2xl sm:mt-10"
            onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}
          >
            CREATE NOW
          </Button>
        </div>
        <div>
          <div className="sm:max-w-[800px]">
            <img src={PicHero} className="mx-auto" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-l from-[#fff8c4] to-[#00c3ff] py-36 text-center">
        <div className="mb-16 text-4xl font-bold text-white">Create Together</div>
        <div className="mx-4 rounded-3xl border-[1px] border-[#707070] bg-white p-3 xs:rounded-[80px] xs:p-12 sm:mx-auto sm:max-w-[990px]">
          <div className="flex flex-wrap items-center justify-between gap-1 xs:gap-4">
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
          <Button
            className="mt-12 text-2xl"
            onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}
          >
            {"LET'S CREATE"}
          </Button>
        </div>
      </div>
      <div className="bg-[#fafafa] px-4 py-[200px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-[40px] font-bold">Features (What we provide...)</div>
          <div className="flex flex-wrap gap-4 sm:gap-12">
            <div className="w-auto rounded-[19px] bg-white p-8 text-center sm:w-[calc((100%-100px)/3)]">
              <img src={IcFeature1} className="mx-auto" />
              <div className="my-4 text-2xl font-bold">Connect musicians</div>
              <div className="text-[14px]">
                Make new music connections to sparkle ideas and work on uploaded music projects
              </div>
            </div>
            <div className="w-auto rounded-[19px] bg-white p-8 text-center sm:w-[calc((100%-100px)/3)]">
              <img src={IcFeature2} className="mx-auto" />
              <div className="my-4 text-2xl font-bold">Promotion</div>
              <div className="text-[14px]">
                Promote original music in our community and to the general public with immersive
                experience
              </div>
            </div>
            <div className="w-auto rounded-[19px] bg-white p-8 text-center sm:w-[calc((100%-100px)/3)]">
              <img src={IcFeature3} className="mx-auto" />
              <div className="my-4 text-2xl font-bold">One click publish (coming soon)</div>
              <div className="text-[14px]">
                Publish on platform directly, selected song to post on Social Media and mint NFT
              </div>
            </div>
            <div className="w-auto rounded-[19px] bg-white p-8 text-center sm:w-[calc((100%-100px)/3)]">
              <img src={IcFeature4} className="mx-auto" />
              <div className="my-4 text-2xl font-bold">Royalty income (coming soon)</div>
              <div className="text-[14px]">
                Passive income from streaming platform plays / NFT sales
              </div>
            </div>
            <div className="w-auto rounded-[19px] bg-white p-8 text-center sm:w-[calc((100%-100px)/3)]">
              <img src={IcFeature5} className="mx-auto" />
              <div className="my-4 text-2xl font-bold">DAW on the go (coming soon)</div>
              <div className="text-[14px]">
                Mobile responsive real-time DAW allows music editing anywhere and anytime
              </div>
            </div>
            <div className="w-auto rounded-[19px] bg-white p-8 text-center sm:w-[calc((100%-100px)/3)]">
              <img src={IcFeature6} className="mx-auto" />
              <div className="my-4 text-2xl font-bold">Work with Professionals (coming soon)</div>
              <div className="text-[14px]">
                Work with professionals within the community to create quality music
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center px-4 py-[100px]">
        <div className="w-full sm:w-1/2">
          <img src={PicHero2} />
        </div>
        <div className="w-full sm:w-1/2 sm:p-16">
          <div className="mb-10 break-words text-3xl font-bold">
            Aaryn Cheung – Frontman from Charming Way
          </div>
          <div>
            {
              'Charming Way is a Hong Kong indie band that was formed in 2019. The band members include Aaryn Cheung on vocal and keyboard, KaLun Wong on guitar and synths, Ajax Li on bass guitar, and Terry Chan on drums. They are known for their classic rock & roll sound with a vintage vibe, which they achieved by fusing the sounds of British bands from the nineties with canto-style melodies. Their music is primarily in English, as they want their story and ideas to be understood by people all around the world.'
            }
            <br />
            <br />
            {
              "Charming Way's music is a reflection of their experiences growing up in British colony Hong Kong. They want to share their perspective on the city and its people through their music. Their songs are nostalgic yet fresh, and their sound is both unique and captivating."
            }
            <br />
            <br />
            {
              'The band has released several singles, including "Victoria" "EXIT" "Blue Moon Day" and "Fall Back to Bed" They have also performed at various music festivals and events in Hong Kong, including the EarUp Music Festival, Chill Club, and the West Kowloon Art Park Festival. Their music has garnered a loyal following in Hong Kong and beyond, and they are considered one of the most promising indie bands in the local music scene. With their talent and dedication to creating meaningful music, Charming Way is a band to watch out for.'
            }
          </div>
          <Button className="mt-[100px] text-2xl" onClick={() => navigate(Page.Explore)}>
            Explore
          </Button>
        </div>
      </div>
      <div className="mb-14 flex">
        <img className="w-1/2" src={PicHero3} />
        <img className="w-1/2" src={PicHero4} />
      </div>
    </div>
  );
};

export default Home;
