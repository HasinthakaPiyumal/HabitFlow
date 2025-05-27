import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import AddNewHabit from '../screens/Home/AddNewHabit';
import Layout from '../screens/Home/Layout';
import Settings from '../screens/Home/Settings';
import OnBoarding from '../screens/OnBoarding/OnBoarding';

const screens = {
  OnBoarding,
  Register,
  Home: Layout,
  Login,
  NewHabit: AddNewHabit,
  Settings,
};

export default screens;
export type Screens = keyof typeof screens;
