import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import FormTextarea from 'src/component/FormTextarea';
import Input from 'src/component/Input';
import { UploadLyricsForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { uploadLyrics } from 'src/service/UploadUsService';

const Lyrics = () => {
  const dispatch = useDispatch();
  const [checkOriginal, setCheckOriginal] = useState<boolean>(true);
  const [checkInspiration, setCheckInspiration] = useState<boolean>(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File>();
  const methods = useForm<UploadLyricsForm>();

  const onSubmit = (data: UploadLyricsForm) => {
    uploadLyrics(data, coverFile ?? null)
      .then(() => dispatch(openSuccessSnackbar('Uploaded Successfully')))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex gap-6">
          <div className="w-3/5">
            <FormInput
              name="name"
              divClassName="mb-4"
              placeholder="Name of your creation"
              required
            />
            <FormTextarea
              name="description"
              className="h-[100px]"
              label="Song Description"
              required
            />
            <FormTextarea name="lyrics" className="h-[140px]" label="Lyrics" required />
          </div>
          <div className="w-2/5">
            <FormInput name="theme" className="mb-4" label="Theme" required />
            <FormInput name="genre" className="mb-4" label="Genre" required />
            <FormInput name="language" className="mb-4" label="Language" required />
            <FormInput name="caption" label="Caption" required />
          </div>
        </div>
        <div className="flex gap-6 mt-10">
          <div className="flex items-center gap-2 mb-4 w-3/5">
            <Input
              placeholder="Select a cover photo (jpg.)"
              divClassName="w-3/5"
              value={coverFile?.name ?? ''}
              onClick={() => coverInputRef.current?.click()}
            />
            <Button onClick={() => coverInputRef.current?.click()}>Browse...</Button>
          </div>
          <div className="w-2/5">
            <Checkbox
              label="Originals"
              checked={checkOriginal}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setCheckOriginal(event.target.checked);
                setCheckInspiration(!event.target.checked);
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
