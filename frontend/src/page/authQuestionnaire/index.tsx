import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Footer from 'src/component/Footer';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import { Page } from 'src/constant/Page';
import { RegistrationForm } from 'src/model/Form';
import { updateUserAttributes } from 'src/service/AuthService';

const AuthQuestionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RegistrationForm | null;
  const [start, setStart] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [instrument, setInstrument] = useState<string>('');
  const [favoriate, setFavoriate] = useState<string>('');

  const showNext = useMemo(
    () => role.length > 0 && language.length > 0 && instrument.length > 0 && favoriate.length > 0,
    [role, language, instrument, favoriate],
  );

  const onNext = () => {
    if (state === null) {
      navigate(-1);

      return;
    }
    updateUserAttributes({ role, language, instrument, favoriate }).then(() =>
      navigate(Page.Profile),
    );
  };

  return (
    <div className="mt-16">
      <div className="max-w-[1000px] mx-auto rounded-[30px] bg-[#f5f5f5] p-12">
        <div className="text-[#8ea1d0] font-bold text-[40px] text-center">
          {"LET'S GET STARTED"}
        </div>
        {!start && (
          <div>
            <div className="text-[#2d2d2d] text-center">
              We want you to have a perfect GoTron music collaborate experience. Answer a few
              questions to enrich your profile and let musicians get to know you better.
            </div>
            <div className="text-center mt-10">
              <Button onClick={() => setStart(true)}>{"Let's Do it"}</Button>
            </div>
          </div>
        )}
        {start && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              I want to create music as a
              <MultiSelect onChange={(v) => setRole(v)}>
                <MultiSelectOption value="Composer">
                  <div className="text-[16px] font-bold">Composer</div>
                  <div className="text-[12px] text-[#a7a7a7]">Upload audio melody tracks</div>
                </MultiSelectOption>
                <MultiSelectOption value="Lyrist">
                  <div className="text-[16px] font-bold">Lyrist</div>
                  <div className="text-[12px] text-[#a7a7a7]">Fill in lyrics for melodies</div>
                </MultiSelectOption>
                <MultiSelectOption value="Singer">
                  <div className="text-[16px] font-bold">Singer</div>
                  <div className="text-[12px] text-[#a7a7a7]">Record demo for songs</div>
                </MultiSelectOption>
                <MultiSelectOption value="Producer">
                  <div className="text-[16px] font-bold">Producer</div>
                  <div className="text-[12px] text-[#a7a7a7]">
                    Remaster songs to implement sophisticated music components
                  </div>
                </MultiSelectOption>
              </MultiSelect>
              in
              <MultiSelect onChange={(v) => setLanguage(v)}>
                <MultiSelectOption value="Cantonese">Cantonese</MultiSelectOption>
                <MultiSelectOption value="English">English</MultiSelectOption>
                <MultiSelectOption value="Mandarin">Mandarin</MultiSelectOption>
              </MultiSelect>
              . I am good at playing
              <MultiSelect onChange={(v) => setInstrument(v)}>
                <MultiSelectOption value="Piano">Piano</MultiSelectOption>
                <MultiSelectOption value="Drum">Drum</MultiSelectOption>
                <MultiSelectOption value="Guitar">Guitar</MultiSelectOption>
              </MultiSelect>
              and I love
              <MultiSelect onChange={(v) => setFavoriate(v)}>
                <MultiSelectOption value="Pop">Pop</MultiSelectOption>
                <MultiSelectOption value="Rock">Rock</MultiSelectOption>
                <MultiSelectOption value="Electronics">Electronics</MultiSelectOption>
              </MultiSelect>
              music.
            </div>
            <div className="text-center">
              <Button onClick={onNext} disabled={!showNext}>
                Go to Profile
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="max-w-[630px] mx-auto my-16">
        <Footer />
      </div>
    </div>
  );
};

export default AuthQuestionnaire;