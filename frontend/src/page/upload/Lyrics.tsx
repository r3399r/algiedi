import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Input from 'src/component/Input';
import { Page } from 'src/constant/Page';
import { GetExploreIdResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { reset, setInfo } from 'src/redux/uploadSlice';
import { uploadLyrics } from 'src/service/UploadService';
import InspirationAntocomplete from './InspirationAutocomplete';

type Props = {
  inspiration?: GetExploreIdResponse;
};

const Lyrics = ({ inspiration }: Props) => {
  const navigate = useNavigate();
  const info = useSelector((rootState: RootState) => rootState.upload);
  const dispatch = useDispatch();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [checkOriginal, setCheckOriginal] = useState<boolean>(!inspiration);
  const [checkInspiration, setCheckInspiration] = useState<boolean>(!!inspiration);
  const [coverFile, setCoverFile] = useState<File>();
  const [inspiredId, setInspiredId] = useState<string>(inspiration?.id ?? '');

  const onSubmit = () => {
    if (!info.theme || !info.genre || !info.language) {
      dispatch(setInfo({ errorTheme: true }));
      dispatch(setInfo({ errorGenre: true }));
      dispatch(setInfo({ errorLanguage: true }));

      return;
    }
    uploadLyrics(
      {
        name: info.name,
        description: info.description,
        lyrics: info.lyrics,
        theme: info.theme,
        genre: info.genre,
        language: info.language,
      },
      coverFile ?? null,
      checkInspiration ? inspiredId : null,
    )
      .then(() => {
        navigate(Page.Overall);
        dispatch(openSuccessSnackbar('Uploaded Successfully'));
        dispatch(reset());
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div>
        <div className="mt-10 flex gap-6">
          <div className="mb-4 flex w-3/5 items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Select a cover photo (jpg.)"
                value={coverFile?.name ?? ''}
                onClick={() => coverInputRef.current?.click()}
              />
            </div>
            <Button size="m" color="purple" onClick={() => coverInputRef.current?.click()}>
              Browse...
            </Button>
          </div>
          <div className="w-2/5">
            <Checkbox
              label="Originals"
              checked={checkOriginal}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setCheckOriginal(event.target.checked);
                setCheckInspiration(!event.target.checked);
                setInspiredId('');
              }}
            />
            <Checkbox
              label="Inspiration"
              checked={checkInspiration}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setCheckOriginal(!event.target.checked);
                setCheckInspiration(event.target.checked);
              }}
            />
            {checkInspiration && (
              <InspirationAntocomplete
                defaultKeyword={inspiration?.info.name}
                onClick={(id) => setInspiredId(id)}
              />
            )}
          </div>
        </div>
        <div className="mt-10 text-right">
          <Button type="button" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length === 1) setCoverFile(e.target.files[0]);
        }}
        ref={coverInputRef}
        className="hidden"
        accept="image/jpeg"
        multiple={false}
      />
    </>
  );
};

export default Lyrics;
