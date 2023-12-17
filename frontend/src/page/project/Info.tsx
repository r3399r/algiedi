import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import Input from 'src/component/Input';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import { Genre, Language, Theme } from 'src/constant/Property';
import { DetailedProject } from 'src/model/backend/Project';
import { openFailSnackbar, setProjectInfoIsEdit } from 'src/redux/uiSlice';
import { updateCover, updateProject } from 'src/service/ProjectService';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
  isOwner: boolean;
};

const Info = ({ project, doRefresh, isOwner }: Props) => {
  const dispatch = useDispatch();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [name, setName] = useState<string>(project.info.name ?? '');
  const [description, setDescription] = useState<string>(project.info.description ?? '');
  const [theme, setTheme] = useState<string>(project.info.theme ?? '');
  const [genre, setGenre] = useState<string>(project.info.genre ?? '');
  const [language, setLanguage] = useState<string>(project.info.language ?? '');
  const [errorTheme, setErrorTheme] = useState<boolean>(false);
  const [errorGenre, setErrorGenre] = useState<boolean>(false);
  const [errorLanguage, setErrorLanguage] = useState<boolean>(false);

  const setEditMode = (editing: boolean) => {
    setIsEdit(editing);
    dispatch(setProjectInfoIsEdit(editing));
  };

  const onSave = () => {
    if (theme === undefined || genre === undefined || language === undefined) {
      setErrorTheme(!theme);
      setErrorGenre(!genre);
      setErrorLanguage(!language);

      return;
    }
    updateProject(project.id, {
      name,
      description,
      theme,
      genre,
      language,
      caption: '',
    })
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <Cover
          url={project.info.coverFileUrl}
          clickable={isOwner && isEdit}
          onClick={() => coverInputRef.current?.click()}
        />
        <div className="flex-1 text-center">
          {isEdit ? (
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <div className="text-xl font-bold">{name}</div>
          )}
        </div>
      </div>
      <div className="mb-4 rounded-2xl border border-solid border-[#707070] bg-white p-4">
        {isOwner && (
          <div className="mb-2 flex justify-end">
            {!isEdit && (
              <Button size="s" color="purple" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
            {isEdit && (
              <div className="flex gap-2">
                <Button size="s" color="purple" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  size="s"
                  color="purple"
                  onClick={() => {
                    setEditMode(false);
                    onSave();
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="mb-2">
          {isEdit ? (
            <textarea
              className="w-full rounded border-[1px] border-black px-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <div className="whitespace-pre-line">{description}</div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[90px] font-bold">Theme</div>
          {isEdit ? (
            <MultiSelect defaultValue={theme} onChange={(v) => setTheme(v)} error={errorTheme}>
              {Theme.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
          ) : (
            <div>{theme}</div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[90px] font-bold">Genre</div>
          {isEdit ? (
            <MultiSelect defaultValue={genre} onChange={(v) => setGenre(v)} error={errorGenre}>
              {Genre.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
          ) : (
            <div>{genre}</div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[90px] font-bold">Language</div>
          {isEdit ? (
            <MultiSelect
              defaultValue={language}
              onChange={(v) => setLanguage(v)}
              error={errorLanguage}
            >
              {Language.map((v, i) => (
                <MultiSelectOption key={i} value={v.name}>
                  {v.name}
                </MultiSelectOption>
              ))}
            </MultiSelect>
          ) : (
            <div>{language}</div>
          )}
        </div>
      </div>
      {isOwner && (
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length === 1)
              updateCover(project, e.target.files[0]).then(doRefresh);
          }}
          ref={coverInputRef}
          className="hidden"
          accept="image/jpeg"
          multiple={false}
        />
      )}
    </>
  );
};

export default Info;
