import Button from 'src/component/Button';
import Footer from 'src/component/Footer';

const AuthQuestionnaire = () => (
  <div className="mt-16">
    <div className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12">
      <div className="text-[#8ea1d0] font-bold text-[40px] text-center">{"LET'S GET STARTED"}</div>
      <div className="text-[#2d2d2d] text-center">
        We want you to have a perfect GoTron music collaborate experience. Answer a few questions to
        enrich your profile and let musicians get to know you better.
      </div>
      <div className="text-center mt-10">
        <Button>{"Let's Do it"}</Button>
      </div>
    </div>
    <div className="max-w-[630px] mx-auto my-16">
      <Footer />
    </div>
  </div>
);

export default AuthQuestionnaire;
