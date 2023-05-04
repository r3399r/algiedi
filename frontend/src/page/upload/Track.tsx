import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import Input from 'src/component/Input';
import Textarea from 'src/component/Textarea';
import { UploadTrackForm } from 'src/model/Form';

const Track = () => {
  const [checkOriginal, setCheckOriginal] = useState<boolean>(true);
  const [checkInspiration, setCheckInspiration] = useState<boolean>(false);
  const trackInputRef = useRef<HTMLInputElement>(null);
  const tabInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [trackFile, setTrackFile] = useState<File>();
  const [tabFile, setTabFile] = useState<File>();
  const [coverFile, setCoverFile] = useState<File>();
  const methods = useForm<UploadTrackForm>();

  const onSubmit = (data: UploadTrackForm) => {
    console.log(data);
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
            <Textarea className="h-[240px]" label="Song Description" required />
          </div>
          <div className="w-2/5">
            <FormInput name="theme" className="mb-4" label="Theme" required />
            <FormInput name="genre" className="mb-4" label="Genre" required />
            <FormInput name="language" className="mb-4" label="Language" required />
            <FormInput name="caption" label="Caption" required />
          </div>
        </div>
        <div className="flex gap-6 mt-10">
          <div className="w-3/5">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="*Select a file (mp3. or wav.)"
                divClassName="w-3/5"
                value={trackFile?.name ?? ''}
                onClick={() => trackInputRef.current?.click()}
              />
              <Button onClick={() => trackInputRef.current?.click()}>Browse...</Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Select a 30 src. tab file (pdf.)"
                divClassName="w-3/5"
                value={tabFile?.name ?? ''}
                onClick={() => tabInputRef.current?.click()}
              />
              <Button onClick={() => tabInputRef.current?.click()}>Browse...</Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Select a cover photo (jpg.)"
                divClassName="w-3/5"
                value={coverFile?.name ?? ''}
                onClick={() => coverInputRef.current?.click()}
              />
              <Button onClick={() => coverInputRef.current?.click()}>Browse...</Button>
            </div>
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
          if (e.target.files && e.target.files.length === 1) setTrackFile(e.target.files[0]);
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
        accept="image/png,image/jpeg"
        multiple={false}
      />
    </>
  );
};

export default Track;
