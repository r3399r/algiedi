import { DrawerProps as MuiDrawerProps } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

export type DrawerProps = MuiDrawerProps;

const Drawer = ({ onClose, anchor, open, children }: DrawerProps) => (
  <MuiDrawer anchor={anchor} open={open} onClose={onClose}>
    <div className="w-[270px] bg-white px-4 py-6">{children}</div>
  </MuiDrawer>
);

export default Drawer;
