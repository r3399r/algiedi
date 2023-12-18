import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip as MuiTooltip } from '@mui/material';

type Props = { title: string };

const Tooltip = ({ title }: Props) => (
  <MuiTooltip title={title}>
    <InfoOutlinedIcon fontSize="small" />
  </MuiTooltip>
);

export default Tooltip;
