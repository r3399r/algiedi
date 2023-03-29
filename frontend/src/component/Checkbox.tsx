import { InputHTMLAttributes } from 'react';

/**
 * usage example:
 *
 * const [state, setState] = useState({
 *   gilad: true,
 *   jason: false,
 *   antoine: false,
 * });
 * const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
 *   setState({ ...state, [event.target.name]: event.target.checked });
 * };
 * const { gilad, jason, antoine } = state;
 *
 *
 * <Checkbox checked={gilad} onChange={handleChange} name="gilad" label="Gilad" />
 * <Checkbox checked={jason} onChange={handleChange} name="jason" label="Jason" />
 * <Checkbox checked={antoine} onChange={handleChange} name="antoine" label="Antoine" />
 */

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = ({ label, disabled, ...props }: Props) => (
  <div className="flex w-fit items-center gap-2">
    <input id={label} disabled={disabled} {...props} type="checkbox" />
    {label && <label htmlFor={label}>{label}</label>}
  </div>
);

export default Checkbox;
