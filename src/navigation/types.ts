import screens from './screens';

export type Screens = keyof typeof screens;
export type RootStackParamList = {
  [K in Screens]: undefined;
};
