import { Navigate, Route, Routes } from "react-router-dom";
import { Page } from "./constant/Page";
import AboutUs from "./page/aboutUs";
import AuthLogin from "./page/authLogin";
import AuthRegister from "./page/authRegister";
import ContactUs from "./page/contactUs";
import Explore from "./page/explore";
import Faq from "./page/faq";
import Home from "./page/home";

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Home} element={<Home />} />
    <Route path={Page.AboutUs} element={<AboutUs />} />
    <Route path={Page.Faq} element={<Faq />} />
    <Route path={Page.ContatUs} element={<ContactUs />} />
    <Route path={Page.Explore} element={<Explore />} />
    <Route path={Page.Login} element={<AuthLogin />} />
    <Route path={Page.Register} element={<AuthRegister />} />
    <Route path="/*" element={<Navigate to={Page.Home} />} />
  </Routes>
);

export default AppRoutes;
