import SearchIcon from '@mui/icons-material/Search';
import { Popper } from '@mui/material';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keyword.length === 0) return;
    const timer = setTimeout(() => {
      getExploreSearch(keyword, type).then((res) => {
        setItems(
          res.data.map((v) => {
            if ('avatarUrl' in v) return { id: v.id, url: v.avatarUrl, name: v.username };
            else return { id: v.id, url: v.info.coverFileUrl, name: v.info.name };
          }),
        );
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, type]);

  useEffect(() => {
    if (items && items.length > 0) setOpen(true);
    else setOpen(false);
  }, [items]);

  return (
    <div className={classNames('flex items-center gap-4 py-4', className)}>
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
          {items &&
            items.map((v) => (
              <ListItem
                key={v.id}
                className="flex items-center gap-2"
                onClick={() => navigate(`${Page.Explore}/${v.id}`)}
              >
                <Cover url={v.url} size={40} />
                <div>{v.name}</div>
              </ListItem>
            ))}
        </div>
      </Popper>
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
