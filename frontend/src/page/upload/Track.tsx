import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import FormTextarea from 'src/component/FormTextarea';
import Input from 'src/component/Input';
import { UploadTrackForm } from 'src/model/Form';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { uploadTrack } from 'src/service/UploadService';

const Track = () => {
  const dispatch = useDispatch();
  const trackInputRef = useRef<HTMLInputElement>(null);
  const tabInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [checkOriginal, setCheckOriginal] = useState<boolean>(true);
  const [checkInspiration, setCheckInspiration] = useState<boolean>(false);
  const [trackFile, setTrackFile] = useState<File>();
  const [tabFile, setTabFile] = useState<File>();
  const [coverFile, setCoverFile] = useState<File>();
  const [inspiredId, setInspiredId] = useState<string>('');
  const [errorTrackFile, setErrorTrackFile] = useState<boolean>(false);
  const methods = useForm<UploadTrackForm>();

  const onSubmit = (data: UploadTrackForm) => {
    if (trackFile === undefined) {
      setErrorTrackFile(true);

      return;
    }
    uploadTrack(
      data,
      checkOriginal,
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
          <div className="w-3/5">
            <FormInput
              name="name"
              divClassName="mb-4"
              placeholder="Name of your creation"
              required
            />
            <FormTextarea
              name="description"
              className="h-[240px]"
              label="Song Description"
              required
            />
          </div>
          <div className="w-2/5 flex flex-col gap-4">
            <FormInput name="theme" label="Theme" required />
            <FormInput name="genre" label="Genre" required />
            <FormInput name="language" label="Language" required />
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
                error={errorTrackFile}
              />
              <Button onClick={() => trackInputRef.current?.click()}>Browse...</Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Select a 30 sec. tab file (pdf.)"
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
              <Input value={inspiredId} onChange={(e) => setInspiredId(e.target.value)} />
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
