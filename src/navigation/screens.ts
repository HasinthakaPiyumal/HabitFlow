import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import Layout from '../screens/Home/Layout';
import OnBoarding from '../screens/OnBoarding/OnBoarding';

const screens = {
  OnBoarding,
  Register,
  Home: Layout,
  Login,
};

export default screens;
export type Screens = keyof typeof screens;
