import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import { Page } from 'src/constant/Page';
import { Genre, Instrument, Language, Role } from 'src/constant/Property';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { saveQuestionnaire } from 'src/service/AuthService';

const AuthQuestionnaire = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [start, setStart] = useState<boolean>(false);
  const [age, setAge] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [instrument, setInstrument] = useState<string>('');
  const [favoriate, setFavoriate] = useState<string>('');

  const onNext = () => {
    saveQuestionnaire({ age, region, role, language, instrument, favoriate })
      .then(() => navigate(Page.Profile))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div className="mt-16">
      <div className="mx-auto max-w-[1000px] rounded-[30px] bg-[#f5f5f5] p-12">
        <div className="text-center text-[40px] font-bold text-[#8ea1d0]">
          {"LET'S GET STARTED"}
        </div>
        {!start && (
          <div>
            <div className="text-center text-[#2d2d2d]">
              We want you to have a perfect GoTron music collaborate experience. Answer a few
              questions to enrich your profile and let musicians get to know you better.
            </div>
            <div className="mt-10 text-center">
              <Button onClick={() => setStart(true)}>{"Let's Do it"}</Button>
            </div>
          </div>
        )}
        {start && (
          <>
            <div className="flex flex-wrap gap-1">
              <span className="inline-flex items-center gap-2">
                I am <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />{' '}
                years old.
              </span>
              {age.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  I live in <Input value={region} onChange={(e) => setRegion(e.target.value)} />.
                </span>
              )}
              {region.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  I want to create music as a
                  <MultiSelect onChange={(v) => setRole(v)}>
                    {Role.map((v, i) => (
                      <MultiSelectOption key={i} value={v.name}>
                        <div className="text-[16px] font-bold">{v.name}</div>
                        {v.note && <div className="text-[12px] text-[#a7a7a7]">{v.note}</div>}
                      </MultiSelectOption>
                    ))}
                  </MultiSelect>
                </span>
              )}
              {role.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  in
                  <MultiSelect onChange={(v) => setLanguage(v)}>
                    {Language.map((v, i) => (
                      <MultiSelectOption key={i} value={v.name}>
                        {v.name}
                      </MultiSelectOption>
                    ))}
                  </MultiSelect>
                  .
                </span>
              )}
              {language.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  I am good at playing
                  <MultiSelect onChange={(v) => setInstrument(v)}>
                    {Instrument.map((v, i) => (
                      <MultiSelectOption key={i} value={v.name}>
                        {v.name}
                      </MultiSelectOption>
                    ))}
                  </MultiSelect>
                </span>
              )}
              {instrument.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  and I love
                  <MultiSelect onChange={(v) => setFavoriate(v)}>
                    {Genre.map((v, i) => (
                      <MultiSelectOption key={i} value={v.name}>
                        {v.name}
                      </MultiSelectOption>
                    ))}
                  </MultiSelect>
                  music.
                </span>
              )}
            </div>
            {favoriate.length > 0 && (
              <div className="mt-5 text-center">
                <Button onClick={onNext}>Go to Profile</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthQuestionnaire;
