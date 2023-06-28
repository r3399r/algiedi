import classNames from 'classnames';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { DetailedCreation, DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { startProject, updateCover, updateProject } from 'src/service/ProjectService';
import Initiator from './Initiator';
import Inspired from './Inspired';
import ModalStart from './ModalStart';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Prepare = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [mainTrack, setMainTrack] = useState<DetailedCreation>();
  const [mainLyrics, setMainLyrics] = useState<DetailedCreation>();
  const [inspiredList, setInspiredList] = useState<DetailedCreation[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('');
  const [editGenre, setEditGenre] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('');
  const [editCaption, setEditCaption] = useState<string>('');
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);

  const mainCreation = useMemo(() => mainLyrics || mainTrack, [mainLyrics, mainTrack]);

  useEffect(() => {
    if (project.mainTrack) setMainTrack(project.mainTrack);
    if (project.mainLyrics) setMainLyrics(project.mainLyrics);
    setInspiredList(project.inspiration);
  }, [project]);

  const onSave = () => {
    updateProject(project.id, {
      name: editName,
      description: editDescription,
      theme: editTheme,
      genre: editGenre,
      language: editLanguage,
      caption: editCaption,
    })
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onStart = () => {
    startProject(project.id)
      .then(() => {
        setIsStartModalOpen(false);
        doRefresh();
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (mainCreation === undefined || inspiredList === undefined) return <></>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-[#f2f2f2] rounded-xl p-5">
        <div className="flex gap-10">
          <div className="w-1/2">
            <div className="flex mb-2">
              <div className="w-1/2">
                {isEdit ? (
                  <input
                    className="w-full border-[1px] border-black px-2 rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  <div>{mainCreation.name}</div>
                )}
              </div>
              <div
                className={classNames('w-1/2', {
                  'cursor-pointer': mainCreation.userId === userId,
                })}
                onClick={() => coverInputRef.current?.click()}
              >
                {mainCreation.coverFileUrl ? (
                  <img src={mainCreation.coverFileUrl} />
                ) : (
                  <div className="bg-gray-400 h-8" />
                )}
              </div>
            </div>
            <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
              <div>
                <div className="flex justify-end">
                  {mainCreation.userId === userId && !isEdit && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setIsEdit(!isEdit);
                        setEditName(mainCreation.name);
                        setEditDescription(mainCreation.description);
                        setEditTheme(mainCreation.theme);
                        setEditGenre(mainCreation.genre);
                        setEditLanguage(mainCreation.language);
                        setEditCaption(mainCreation.caption);
                      }}
                    >
                      Edit
                    </div>
                  )}
                  {mainCreation.userId === userId && isEdit && (
                    <div className="flex gap-2">
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setIsEdit(!isEdit);
                        }}
                      >
                        Cancel
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setIsEdit(!isEdit);
                          onSave();
                        }}
                      >
                        Save
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {isEdit ? (
                    <textarea
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    <div className="whitespace-pre">{mainCreation.description}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Theme:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editTheme}
                      onChange={(e) => setEditTheme(e.target.value)}
                    />
                  ) : (
                    <div>{mainCreation.theme}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Genre:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editGenre}
                      onChange={(e) => setEditGenre(e.target.value)}
                    />
                  ) : (
                    <div>{mainCreation.genre}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Language:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                    />
                  ) : (
                    <div>{mainCreation.language}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Caption:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                    />
                  ) : (
                    <div>{mainCreation.caption}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Initiator track={mainTrack} lyrics={mainLyrics} doRefresh={doRefresh} />
            <Inspired mainCreation={mainCreation} creations={inspiredList} doRefresh={doRefresh} />
          </div>
        </div>
        <div className="text-right mt-4">
          <Button onClick={() => setIsStartModalOpen(true)}>Start Project</Button>
        </div>
      </div>
      {mainCreation.userId === userId && (
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
      <ModalStart
        open={isStartModalOpen}
        handleClose={() => setIsStartModalOpen(false)}
        onStart={onStart}
      />
    </>
  );
};

export default Prepare;
