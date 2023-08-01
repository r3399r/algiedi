import { ReactNode } from 'react';
import SelectContext from 'src/context/SelectContext';
import Checkbox from './Checkbox';
import ListItem from './ListItem';

/**
 * usage note:
 * this component is for MultiSelect component, please use this only with it.
 */

type Props = {
  value: string;
  children: ReactNode;
};

const MultiSelectOption = ({ value, children }: Props) => (
  <SelectContext.Consumer>
    {({ current, handleChange }) => (
      <ListItem
        onClick={() => handleChange(value)}
        focus={current.split(',').includes(value)}
        className="flex items-center gap-2"
      >
        <Checkbox checked={current.split(',').includes(value)} readOnly />
        <div>{children}</div>
      </ListItem>
    )}
  </SelectContext.Consumer>
);

export default MultiSelectOption;
