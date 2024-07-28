import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import Modal from 'src/component/Modal';
import ModalConfirmLeave from 'src/component/ModalConfirmLeave';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import Textarea from 'src/component/Textarea';
import { Genre, Language, Theme } from 'src/constant/Property';
import { Info } from 'src/model/backend/entity/InfoEntity';
import { openFailSnackbar, setHasUnsavedChanges } from 'src/redux/uiSlice';
import { editById } from 'src/service/ExploreService';
import { matchHashtag } from 'src/service/ProjectService';

type Props = {
  open: boolean;
  handleClose: () => void;
  defaultInfo: Info;
  doRefresh: () => void;
};

const ModalEditor = ({ open, handleClose, defaultInfo, doRefresh }: Props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form, setForm] = useState<{
    name?: string;
    theme?: string;
    genre?: string;
    language?: string;
    caption?: string;
    description?: string;
  }>({});
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorTheme, setErrorTheme] = useState<boolean>(false);
  const [errorGenre, setErrorGenre] = useState<boolean>(false);
  const [errorLanguage, setErrorLanguage] = useState<boolean>(false);
  const hasChanged = useMemo(
    () =>
      (form.name && form.name !== defaultInfo.name) ||
      (form.description && form.description !== defaultInfo.description) ||
      (form.theme && form.theme !== defaultInfo.theme) ||
      (form.genre && form.genre !== defaultInfo.genre) ||
      (form.language && form.language !== defaultInfo.language) ||
      (form.caption && form.caption !== defaultInfo.caption.map((v) => `#${v.name}`).join(' ')),
    [form],
  );
  const subimttable = useMemo(() => {
    if (
      !form.name &&
      !form.description &&
      !form.theme &&
      !form.genre &&
      !form.language &&
      !form.caption
    )
      return false;
    if (errorTheme || errorGenre || errorLanguage) return false;

    return hasChanged;
  }, [form, errorTheme, errorGenre, errorLanguage, hasChanged]);

  useEffect(() => {
    if (hasChanged) dispatch(setHasUnsavedChanges(true));
    else dispatch(setHasUnsavedChanges(false));
  }, [hasChanged]);

  const onClose = () => {
    if (hasChanged) setOpenConfirm(true);
    else {
      handleClose();
      setForm({});
    }
  };

  const onSubmit = () => {
    if (id === undefined || !subimttable) return;
    editById(id, {
      name: form.name ?? defaultInfo.name ?? undefined,
      description: form.description ?? defaultInfo.description ?? undefined,
      theme: form.theme ?? defaultInfo.theme ?? undefined,
      genre: form.genre ?? defaultInfo.genre ?? undefined,
      language: form.language ?? defaultInfo.language ?? undefined,
      caption: matchHashtag(form.caption ?? ''),
    })
      .then(() => {
        handleClose();
        setForm({});
        doRefresh();
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <Modal open={open} handleClose={onClose}>
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            placeholder="Name of your creation"
            asterisked
            value={form.name ?? defaultInfo.name ?? ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            className="h-[240px]"
            label="Description"
            placeholder="Please describe your creation here"
            asterisked
            value={form.description ?? defaultInfo.description ?? ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <MultiSelect
            defaultValue={form.theme ?? defaultInfo.theme ?? undefined}
            label="Theme"
            onChange={(v) => {
              setForm({ ...form, theme: v });
              if (v.length === 0) setErrorTheme(true);
              else setErrorTheme(false);
            }}
            error={errorTheme}
            asterisked
          >
            {Theme.map((v, i) => (
              <MultiSelectOption key={i} value={v.name}>
                {v.name}
              </MultiSelectOption>
            ))}
          </MultiSelect>
          <MultiSelect
            defaultValue={form.genre ?? defaultInfo.genre ?? undefined}
            label="Genre"
            onChange={(v) => {
              setForm({ ...form, genre: v });
              if (v.length === 0) setErrorGenre(true);
              else setErrorGenre(false);
            }}
            error={errorGenre}
            asterisked
          >
            {Genre.map((v, i) => (
              <MultiSelectOption key={i} value={v.name}>
                {v.name}
              </MultiSelectOption>
            ))}
          </MultiSelect>
          <MultiSelect
            defaultValue={form.language ?? defaultInfo.language ?? undefined}
            label="Language"
            onChange={(v) => {
              setForm({ ...form, language: v });
              if (v.length === 0) setErrorLanguage(true);
              else setErrorLanguage(false);
            }}
            error={errorLanguage}
            asterisked
          >
            {Language.map((v, i) => (
              <MultiSelectOption key={i} value={v.name}>
                {v.name}
              </MultiSelectOption>
            ))}
          </MultiSelect>
          <Input
            label="Caption"
            placeholder="#some #caption"
            value={form.caption ?? defaultInfo.caption.map((v) => `#${v.name}`).join(' ')}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
          <div className="mt-10 text-right">
            <Button type="button" onClick={onSubmit} disabled={!subimttable}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
      <ModalConfirmLeave
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          handleClose();
          setForm({});
        }}
      />
    </>
  );
};

export default ModalEditor;
