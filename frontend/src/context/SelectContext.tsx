import { createContext } from 'react';

type SelectContextType = { current: string; handleChange: (v: string) => void };
const SelectContext = createContext<SelectContextType>({
  current: '',
  handleChange: () => undefined,
});

export default SelectContext;
