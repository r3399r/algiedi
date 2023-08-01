import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import Input from 'src/component/Input';
import { DetailedProject } from 'src/model/backend/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
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
  const [name, setName] = useState<string>(project.name ?? '');
  const [description, setDescription] = useState<string>(project.description ?? '');
  const [theme, setTheme] = useState<string>(project.theme ?? '');
  const [genre, setGenre] = useState<string>(project.genre ?? '');
  const [language, setLanguage] = useState<string>(project.language ?? '');
  const [caption, setCaption] = useState<string>(project.caption ?? '');

  const onSave = () => {
    updateProject(project.id, {
      name,
      description,
      theme,
      genre,
      language,
      caption,
    })
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <Cover
          url={project.coverFileUrl}
          clickable={isOwner}
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
              <Button size="s" color="purple" onClick={() => setIsEdit(!isEdit)}>
                Edit
              </Button>
            )}
            {isEdit && (
              <div className="flex gap-2">
                <Button size="s" color="purple" onClick={() => setIsEdit(!isEdit)}>
                  Cancel
                </Button>
                <Button
                  size="s"
                  color="purple"
                  onClick={() => {
                    setIsEdit(!isEdit);
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
            <div className="whitespace-pre">{description}</div>
          )}
        </div>
        <div className="flex gap-1">
          <div className="w-[90px] font-bold">Theme</div>
          {isEdit ? (
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} />
          ) : (
            <div>{theme}</div>
          )}
        </div>
        <div className="flex gap-1">
          <div className="w-[90px] font-bold">Genre</div>
          {isEdit ? (
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} />
          ) : (
            <div>{genre}</div>
          )}
        </div>
        <div className="flex gap-1">
          <div className="w-[90px] font-bold">Language</div>
          {isEdit ? (
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} />
          ) : (
            <div>{language}</div>
          )}
        </div>
        <div className="flex gap-1">
          <div className="w-[90px] font-bold">Caption</div>
          {isEdit ? (
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
          ) : (
            <div>{caption}</div>
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
