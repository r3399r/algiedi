import SearchIcon from '@mui/icons-material/Search';
import { Popper } from '@mui/material';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getExploreSearch } from 'src/service/ExploreService';
import Cover from './Cover';
import Input from './Input';
import ListItem from './ListItem';
import Select from './Select';
import SelectOption from './SelectOption';

type Props = {
  className?: string;
};

const ExploreSearch = ({ className }: Props) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string>('');
  const [type, setType] = useState<string>('song');
  const [items, setItems] = useState<{ id: string; url: string | null; name: string | null }[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
      getExploreSearch(keyword, type)
        .then((res) => {
          if (!unamounted)
            setItems(
              res.map((v) => {
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
  }, [keyword, type]);

  useEffect(() => {
    if (items || loading) setOpen(true);
    else setOpen(false);
  }, [items, loading]);

  return (
    <div className={classNames('flex items-center gap-4 py-4', className)}>
      <form
        onBlur={() => {
          setTimeout(() => setOpen(false), 100);
        }}
        onFocus={() => setOpen(true)}
        onSubmit={(e) => {
          e.preventDefault();
          if (keyword.length === 0) return;
          let pathname = `${Page.Explore}/song`;
          let search = createSearchParams({ keyword }).toString();
          if (type === 'track' || type === 'lyrics') {
            pathname = `${Page.Explore}/idea`;
            search = createSearchParams({ keyword, tab: type }).toString();
          }
          if (type === 'user') pathname = `${Page.Explore}/user`;

          navigate({ pathname, search });
          setOpen(false);
        }}
      >
        <div className="flex items-center" ref={ref}>
          <SearchIcon />
          <Input
            placeholder="Search"
            className="h-[40px]"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Popper open={open} anchorEl={ref.current}>
          <div className="rounded bg-[#fafafa] shadow-lg">
            {loading && <ListItem>Loading...</ListItem>}
            {items && items.length === 0 && <ListItem>(No {type} found)</ListItem>}
            {items &&
              items.length > 0 &&
              items.map((v) => (
                <ListItem
                  key={v.id}
                  className="flex items-center gap-2"
                  onClick={() =>
                    navigate(
                      type === 'user' ? `${Page.Explore}/user/${v.id}` : `${Page.Explore}/${v.id}`,
                    )
                  }
                >
                  <Cover url={v.url} size={40} type={type === 'user' ? 'user' : 'creation'} />
                  <div>{v.name}</div>
                </ListItem>
              ))}
          </div>
        </Popper>
      </form>
      <Select defaultValue={type} onChange={(v) => setType(v)}>
        <SelectOption value="song">Song</SelectOption>
        <SelectOption value="track">Track</SelectOption>
        <SelectOption value="lyrics">Lyrics</SelectOption>
        <SelectOption value="user">User</SelectOption>
      </Select>
    </div>
  );
};

export default ExploreSearch;
