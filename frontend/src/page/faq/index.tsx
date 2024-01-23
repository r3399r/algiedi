import Button from 'src/component/Button';
import PicFaqBg from 'src/image/pic-faq-bg.png';
import Question from './Question';

const Faq = () => (
  <div>
    <div className="mx-10 mt-6 text-[50px] font-bold">Frequently Asked Questions</div>
    <div className="mx-10 mt-10 gap-8 sm:flex">
      <div className="border-t-2 border-t-black pt-2 text-[40px] font-bold text-[#707070] sm:w-1/3">
        General
      </div>
      <div className="sm:w-2/3">
        <Question
          question="What is an “original”?"
          answer="An “original” is your original musical idea uploaded to your dashboard. This will create a new project for other users to join as collaborative music creation."
        />
        <Question
          question="What is “inspired”?"
          answer="When you meet an exciting project on “Explore”, you can upload an “inspired” piece of music under that project."
        />
        <Question
          question="How do I join someone’s project?"
          answer="Once you have uploaded an “inspired” work, you request to join the project for remote music collaboration. Project owner will decide whether to accept your request to collaborate on the project."
        />
        <Question
          question="What if my request to join someone’s project is not approved?"
          answer="If in case you are not approved, your uploads will be transferred to exhibit _*(portfolio)*_ and still be visible to you."
        />
        <Question
          question="How do I edit my upload?"
          answer="If you have uploaded an “original” or “inspired”, you can edit your upload at “overall” in your dashboard. New edits will be visible at “Explore” when project is open for collaboration in our music production community. New edits will be private when collaboration has commenced until your music is officially published."
        />
        <Question
          question="How are collaborating music produced?"
          answer="At the current stage, project owner is responsible to mix and produce a final version of the music including, if applicable, vocal track for the lyrics and instrumental background track to be published in _*Explore Completed Project*_
          (Track — music in production
          Music — general term for all music and song)"
        />
        <Question
          question="Do I make any income from my published music?"
          answer="At the current stage of our music creation collaboration platform, we do not offer royalties to your published music. At our upcoming stage, we aim to split our income from streaming platforms like YouTube to eligible creators."
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
  </div>
);

export default Faq;
