import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppProvider, { AppContext } from './src/context/AppContext';
import defaultProfile from './src/images/default-profile.png';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import Home from './src/screens/Home';
import Explore from './src/screens/Explore';
import Add from './src/screens/Add';
import Bookmark from './src/screens/Bookmark';
import Profile from './src/screens/Profile';
import CreateAccount from './src/screens/CreateAccount';
import SignIn from './src/screens/SignIn';
import Recipe from './src/screens/Recipe';
import Search from './src/screens/Search';
import Collection from './src/screens/Collection';
import Edit from './src/screens/Edit';
import EditProfile from './src/screens/EditProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, size = 25 }) => (
  <MaterialCommunityIcon name={name} color={color} size={size} />
);

const CustomTabButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.customButton} onPress={onPress}>
    <View style={styles.innerButton}>{children}</View>
  </TouchableOpacity>
);

const HeaderTitle = ({ title }) => {
  const { user } = useContext(AppContext);
  const userName = user?.name ? user.name.split(' ')[0] : ', Selamat Datang!';

  return (
    <View style={styles.header}>
      <Image
        source={
          user?.image
            ? {
                uri: `https://recipe.keviniansyah.com/storage/${user.image}`,
              }
            : defaultProfile
        }
        style={styles.profileImage}
      />
      <Text style={styles.headerTitle}>
        {title === 'Home' ? `Halo ${userName}` : title}
      </Text>
    </View>
  );
};

const tabScreens = [
  {
    name: 'Beranda',
    component: Home,
    icon: 'home-outline',
    title: 'Home',
  },
  {
    name: 'Jelajahi',
    component: Explore,
    icon: 'book-outline',
    iconSize: 22,
  },
  {
    name: 'Resep Anda',
    component: Collection,
    icon: 'plus',
    customButton: true,
  },
  {
    name: 'Tersimpan',
    component: Bookmark,
    icon: 'bookmark-outline',
  },
  {
    name: 'Profil',
    component: Profile,
    icon: 'account-outline',
    iconSize: 26,
  },
];

const stackScreens = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
    options: { headerShown: false },
  },
  {
    name: 'OnboardingScreen',
    component: OnboardingScreen,
    options: { headerShown: false },
  },
  {
    name: 'CreateAccount',
    component: CreateAccount,
    options: { headerShown: false },
  },
  {
    name: 'SignIn',
    component: SignIn,
    options: { headerShown: false },
  },
  {
    name: 'Recipe',
    component: Recipe,
    options: {
      headerTitle: 'Detail',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: 'black',
    },
  },
  {
    name: 'Add',
    component: Add,
    options: {
      headerTitle: 'Tambah Resep',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: 'black',
    },
  },
  {
    name: 'Edit',
    component: Edit,
    options: {
      headerTitle: 'Edit Resep',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: 'black',
    },
  },
  {
    name: 'Search',
    component: Search,
    options: {
      headerTitle: 'Search',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: 'black',
    },
  },
  {
    name: 'EditProfile',
    component: EditProfile,
    options: {
      headerTitle: 'Edit Profil',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: 'black',
    },
  },
];

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#ff6b00',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarStyle: styles.tabBarStyle,
    }}
  >
    {tabScreens.map((screen) => (
      <Tab.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
        options={{
          headerTitle: () => (
            <HeaderTitle title={screen.title || screen.name} />
          ),
          tabBarIcon: ({ color }) =>
            screen.customButton ? (
              <TabIcon
                name={screen.icon}
                color="#ffffff"
                size={25}
                style={{ top: 6 }}
              />
            ) : (
              <TabIcon
                name={screen.icon}
                color={color}
                size={screen.iconSize || 25}
              />
            ),
          tabBarLabel: screen.customButton ? '' : undefined,
          tabBarButton: screen.customButton ? CustomTabButton : undefined,
          tabBarShowLabel: true,
        }}
      />
    ))}
  </Tab.Navigator>
);

const App = () => (
  <AppProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {stackScreens.map((screen) => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={screen.options}
          />
        ))}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </AppProvider>
);

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabBarStyle: {
    borderTopWidth: 0.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    height: 60,
    paddingTop: 5,
  },
  customButton: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    paddingTop: 12,
    marginBottom: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default App;
