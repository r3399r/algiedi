export enum Page {
  Home = '/',
  AboutUs = '/about-us',
  Faq = '/faq',
  ContatUs = '/contact-us',
  Explore = '/explore',
  Login = '/auth/login',
  Register = '/auth/register',
  Confirmation = '/auth/confirmation',
  Verify = '/auth/verify',
  Questionnaire = '/auth/questionnaire',
  Forget = '/auth/forget',
  ForgetReset = '/auth/forget/reset',
  Overall = '/overall',
  Profile = '/profile',
  Project = '/project',
  Upload = '/upload',
}

// pages with sideMenu
export const DashboardPage = [Page.Overall, Page.Profile, Page.Upload, Page.Project];
