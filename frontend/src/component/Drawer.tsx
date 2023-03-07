import { DrawerProps as MuiDrawerProps } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

export type DrawerProps = MuiDrawerProps;

const Drawer = ({ onClose, anchor, open, children }: DrawerProps) => (
  <MuiDrawer anchor={anchor} open={open} onClose={onClose}>
    <div className="bg-white w-[270px] py-6 px-4">{children}</div>
  </MuiDrawer>
);

export default Drawer;
