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
import { DetailedCreation } from 'src/model/backend/Project';
import { UploadLyricsForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { uploadLyrics } from 'src/service/UploadService';

type Props = {
  defaultInspiredId?: string;
  inspiration: DetailedCreation[];
};

const Lyrics = ({ defaultInspiredId, inspiration }: Props) => {
  const dispatch = useDispatch();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [checkOriginal, setCheckOriginal] = useState<boolean>(!defaultInspiredId);
  const [checkInspiration, setCheckInspiration] = useState<boolean>(!!defaultInspiredId);
  const [coverFile, setCoverFile] = useState<File>();
  const [inspiredId, setInspiredId] = useState<string>(defaultInspiredId ?? '');
  const [theme, setTheme] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [language, setLanguage] = useState<string>();
  const [errorTheme, setErrorTheme] = useState<boolean>(false);
  const [errorGenre, setErrorGenre] = useState<boolean>(false);
  const [errorLanguage, setErrorLanguage] = useState<boolean>(false);
  const methods = useForm<UploadLyricsForm>();

  const onSubmit = (data: UploadLyricsForm) => {
    if (theme === undefined || genre === undefined || language === undefined) {
      setErrorTheme(!theme);
      setErrorGenre(!genre);
      setErrorLanguage(!language);

      return;
    }
    uploadLyrics(
      { ...data, theme, genre, language },
      coverFile ?? null,
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
            <FormTextarea name="description" className="h-[100px]" label="Description" required />
            <FormTextarea name="lyrics" className="h-[140px]" label="Lyrics" required />
          </div>
          <div className="w-2/5">
            <MultiSelect label="Theme" onChange={(v) => setTheme(v)} error={errorTheme}>
              <MultiSelectOption value="Romantic">Romantic</MultiSelectOption>
              <MultiSelectOption value="Relax">Relax</MultiSelectOption>
              <MultiSelectOption value="Deep Focus">Deep Focus</MultiSelectOption>
            </MultiSelect>
            <MultiSelect label="Genre" onChange={(v) => setGenre(v)} error={errorGenre}>
              <MultiSelectOption value="Pop">Pop</MultiSelectOption>
              <MultiSelectOption value="Rock">Rock</MultiSelectOption>
              <MultiSelectOption value="Electronics">Electronics</MultiSelectOption>
            </MultiSelect>
            <MultiSelect label="Language" onChange={(v) => setLanguage(v)} error={errorLanguage}>
              <MultiSelectOption value="Cantonese">Cantonese</MultiSelectOption>
              <MultiSelectOption value="English">English</MultiSelectOption>
              <MultiSelectOption value="Mandarin">Mandarin</MultiSelectOption>
            </MultiSelect>
          </div>
        </div>
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
