import { Autocomplete, TextField } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import FormTextarea from 'src/component/FormTextarea';
import Input from 'src/component/Input';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import { Genre, Language, Theme } from 'src/constant/Property';
import { DetailedCreation } from 'src/model/backend/Project';
import { UploadTrackForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { uploadTrack } from 'src/service/UploadService';

type Props = {
  defaultInspiredId?: string;
  inspiration: DetailedCreation[];
};

const Track = ({ defaultInspiredId, inspiration }: Props) => {
  const dispatch = useDispatch();
  const trackInputRef = useRef<HTMLInputElement>(null);
  const tabInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [checkOriginal, setCheckOriginal] = useState<boolean>(!defaultInspiredId);
  const [checkInspiration, setCheckInspiration] = useState<boolean>(!!defaultInspiredId);
  const [trackFile, setTrackFile] = useState<File>();
  const [tabFile, setTabFile] = useState<File>();
  const [coverFile, setCoverFile] = useState<File>();
  const [inspiredId, setInspiredId] = useState<string>(defaultInspiredId ?? '');
  const [errorTrackFile, setErrorTrackFile] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [language, setLanguage] = useState<string>();
  const [errorTheme, setErrorTheme] = useState<boolean>(false);
  const [errorGenre, setErrorGenre] = useState<boolean>(false);
  const [errorLanguage, setErrorLanguage] = useState<boolean>(false);
  const methods = useForm<UploadTrackForm>();

  const onSubmit = (data: UploadTrackForm) => {
    if (
      trackFile === undefined ||
      theme === undefined ||
      genre === undefined ||
      language === undefined
    ) {
      setErrorTrackFile(!trackFile);
      setErrorTheme(!theme);
      setErrorGenre(!genre);
      setErrorLanguage(!language);

      return;
    }
    uploadTrack(
      { ...data, theme, genre, language },
      { track: trackFile, tab: tabFile ?? null, cover: coverFile ?? null },
      checkInspiration ? inspiredId : null,
    )
      .then(() => dispatch(openSuccessSnackbar('Uploaded Successfully')))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex gap-6">
          <div className="flex w-3/5 flex-col gap-4">
            <FormInput name="name" label="Name" placeholder="Name of your creation" required />
            <FormTextarea name="description" className="h-[240px]" label="Description" required />
          </div>
          <div className="flex w-2/5 flex-col gap-4">
            <MultiSelect label="Theme" onChange={(v) => setTheme(v)} error={errorTheme}>
              {Theme.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
            <MultiSelect label="Genre" onChange={(v) => setGenre(v)} error={errorGenre}>
              {Genre.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
            <MultiSelect label="Language" onChange={(v) => setLanguage(v)} error={errorLanguage}>
              {Language.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
          </div>
        </div>
        <div className="mt-10 flex gap-6">
          <div className="w-3/5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder="*Select a file (mp3. or wav.)"
                  value={trackFile?.name ?? ''}
                  onClick={() => trackInputRef.current?.click()}
                  error={errorTrackFile}
                />
              </div>
              <Button size="m" color="purple" onClick={() => trackInputRef.current?.click()}>
                Browse...
              </Button>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Select a 30 sec. tab file (pdf.)"
                  value={tabFile?.name ?? ''}
                  onClick={() => tabInputRef.current?.click()}
                />
              </div>
              <Button size="m" color="purple" onClick={() => tabInputRef.current?.click()}>
                Browse...
              </Button>
            </div>
            <div className="flex items-center gap-2">
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
              <Autocomplete
                value={inspiration.find((v) => v.id === inspiredId)}
                onChange={(event, newValue) => {
                  setInspiredId(newValue?.id ?? '');
                }}
                options={inspiration}
                getOptionLabel={(option) =>
                  `${option.name} (${option.username ?? ''}, ${option.type})`
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.name} ({option.username}, {option.type})
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            )}
          </div>
        </div>
        <div className="mt-10 text-right">
          <Button type="submit">Submit</Button>
        </div>
      </Form>
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length === 1) setTrackFile(e.target.files[0]);
          setErrorTrackFile(false);
        }}
        ref={trackInputRef}
        className="hidden"
        accept="audio/vnd.wave,audio/mpeg"
        multiple={false}
      />
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length === 1) setTabFile(e.target.files[0]);
        }}
        ref={tabInputRef}
        className="hidden"
        accept="application/pdf"
        multiple={false}
      />
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

export default Track;
