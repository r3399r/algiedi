import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Popper } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cover from 'src/component/Cover';
import Input from 'src/component/Input';
import ListItem from 'src/component/ListItem';
import { Type } from 'src/model/backend/constant/Creation';
import { ExploreCreation } from 'src/model/backend/Explore';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getExploreSearch } from 'src/service/UploadService';

type Props = {
  defaultKeyword?: string | null;
  onClick: (id: string) => void;
};

const InspirationAntocomplete = ({ defaultKeyword, onClick }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>(defaultKeyword ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ExploreCreation[]>();
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unamounted = false;
    setItems(undefined);
    if (keyword.length === 0) {
      setLoading(false);

      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      getExploreSearch(keyword)
        .then((res) => {
          if (!unamounted) setItems(res);
        })
        .catch((e) => dispatch(openFailSnackbar(e)))
        .finally(() => setLoading(false));
    }, 500);

    return () => {
      unamounted = true;
      clearTimeout(timer);
    };
  }, [keyword]);

  return (
    <>
      <div className="flex w-fit items-center" ref={ref}>
        <Input
          placeholder="Search"
          className="h-[40px]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 100);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      <Popper open={open} anchorEl={ref.current}>
        <div className="max-h-[400px] overflow-scroll rounded bg-[#fafafa] shadow-lg">
          {loading && <ListItem>Loading...</ListItem>}
          {items && items.length === 0 && <ListItem>(No creation found)</ListItem>}
          {items &&
            items.length > 0 &&
            items.map((v) => (
              <ListItem
                key={v.id}
                className="flex items-center gap-2"
                onClick={() => {
                  setKeyword(v.info.name ?? '');
                  onClick(v.id);
                }}
              >
                <Cover url={v.info.coverFileUrl} size={40} />
                <div className="font-bold">{v.info.name}</div>
                {v.type === Type.Track && <HistoryEduIcon className="text-red" fontSize="small" />}
                {v.type === Type.Lyrics && <MusicNoteIcon className="text-blue" fontSize="small" />}
                {v.type === Type.Song && <StarBorderIcon fontSize="small" />}
                <div>{`(${v.user.length > 0 ? v.user[0].username : ''}${
                  v.user.length > 1 ? ` & ${v.user.length - 1} others` : ''
                })`}</div>
              </ListItem>
            ))}
        </div>
      </Popper>
    </>
  );
};

export default InspirationAntocomplete;
