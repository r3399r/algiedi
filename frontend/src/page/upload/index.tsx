import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Footer from 'src/component/Footer';
import Input from 'src/component/Input';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import Textarea from 'src/component/Textarea';
import { Genre, Language, Theme } from 'src/constant/Property';
import { GetExploreIdResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { setInfo } from 'src/redux/uploadSlice';
import Lyrics from './Lyrics';
import Track from './Track';

const Upload = () => {
  const info = useSelector((rootState: RootState) => rootState.upload);
  const dispatch = useDispatch();
  const [tab, setTab] = useState<'track' | 'lyrics'>('track');
  const state = useLocation().state as { inspiration: GetExploreIdResponse } | null;

  return (
    <>
      <div className="mb-10 text-[20px]">Upload</div>
      <div className="w-full rounded-xl bg-white p-8">
        <div className="mb-6 flex gap-4">
          <div
            className={classNames('cursor-pointer', {
              'border-b-[1px] border-b-purple text-purple': tab === 'track',
            })}
            onClick={() => setTab('track')}
          >
            Track
          </div>
          <div
            className={classNames('cursor-pointer', {
              'border-b-[1px] border-b-purple text-purple': tab === 'lyrics',
            })}
            onClick={() => setTab('lyrics')}
          >
            Lyrics
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex w-3/5 flex-col gap-4">
            <Input
              label="Name"
              placeholder="Name of your creation"
              asterisked
              value={info.name}
              onChange={(e) => dispatch(setInfo({ name: e.target.value }))}
            />
            <Textarea
              className="h-[240px]"
              label="Description"
              placeholder="Please describe your creation here"
              asterisked
              value={info.description}
              onChange={(e) => dispatch(setInfo({ description: e.target.value }))}
            />
            {tab === 'lyrics' && (
              <Textarea
                placeholder="Your lyrics"
                className="h-[140px]"
                label="Lyrics"
                asterisked
                value={info.lyrics}
                onChange={(e) => dispatch(setInfo({ lyrics: e.target.value }))}
              />
            )}
          </div>
          <div className="flex w-2/5 flex-col gap-4">
            <MultiSelect
              defaultValue={info.theme ?? undefined}
              label="Theme"
              onChange={(v) => dispatch(setInfo({ theme: v }))}
              error={info.errorTheme}
              asterisked
            >
              {Theme.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
            <MultiSelect
              defaultValue={info.genre ?? undefined}
              label="Genre"
              onChange={(v) => dispatch(setInfo({ genre: v }))}
              error={info.errorGenre}
              asterisked
            >
              {Genre.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
            <MultiSelect
              defaultValue={info.language ?? undefined}
              label="Language"
              onChange={(v) => dispatch(setInfo({ language: v }))}
              error={info.errorLanguage}
              asterisked
            >
              {Language.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
          </div>
        </div>
        <div>
          {tab === 'track' && <Track inspiration={state?.inspiration} />}
          {tab === 'lyrics' && <Lyrics inspiration={state?.inspiration} />}
        </div>
      </div>
      <div className="mx-auto max-w-[630px] py-16">
        <Footer />
      </div>
    </>
  );
};

export default Upload;
