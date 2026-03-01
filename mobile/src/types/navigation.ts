export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Grades: undefined;
  GPA: undefined;
  Analytics: undefined;
  Calendar: undefined;
  AI: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ClassDetail: { classId: string };
};
