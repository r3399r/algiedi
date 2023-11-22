import { Popper } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cover from 'src/component/Cover';
import Input from 'src/component/Input';
import ListItem from 'src/component/ListItem';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getExploreSearch } from 'src/service/ExploreService';

type Props = {
  defaultKeyword?: string | null;
  onClick: (id: string) => void;
};

const InspirationAntocomplete = ({ defaultKeyword, onClick }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>(defaultKeyword ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<{ id: string; url: string | null; name: string | null }[]>();
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
          if (!unamounted)
            setItems(
              res.data.map((v) => {
                if ('avatarUrl' in v) return { id: v.id, url: v.avatarUrl, name: v.username };
                else return { id: v.id, url: v.info.coverFileUrl, name: v.info.name };
              }),
            );
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
      <div className="flex items-center" ref={ref}>
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
        <div className="rounded bg-[#fafafa] shadow-lg">
          {loading && <ListItem>Loading...</ListItem>}
          {items && items.length === 0 && <ListItem>(No creation found)</ListItem>}
          {items &&
            items.length > 0 &&
            items.map((v) => (
              <ListItem
                key={v.id}
                className="flex items-center gap-2"
                onClick={() => {
                  setKeyword(v.name ?? '');
                  onClick(v.id);
                }}
              >
                <Cover url={v.url} size={40} />
                <div>{v.name}</div>
              </ListItem>
            ))}
        </div>
      </Popper>
    </>
  );
};

export default InspirationAntocomplete;
