import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Home from './screens/Home';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { emailAtom, tokenAtom, onlineAtom, onlineUsersAtom } from './store';
import MyModal from './components/MyModal';
import Login from './screens/Login';
import Profile from './screens/Profile';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Settings from './components/Settings';
import { socket } from './socket';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useAtom(tokenAtom);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useAtom(emailAtom);
  const [queryClient] = useState(() => new QueryClient());
  const [online, isOnline] = useAtom(onlineAtom);
  const [onlineUsers, setOnlineUsers] = useAtom(onlineUsersAtom);

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      const email = await SecureStore.getItemAsync('email');
      return [token, email];
    }

    getToken().then(([t, e]) => {
      console.log(t)
      if (t && e) {
        setToken(t);
        setEmail(e);
      }
    }).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {

    const getOnlineUsers = (data: { email: string}[]) => {
      const tempUsers = new Map<string, string>();
      data.forEach((e) => {
        tempUsers.set(e.email, e.email);
      });
      
      setOnlineUsers(tempUsers);
    }

    socket.on('onlineUsers', getOnlineUsers);

    return () => {
      socket.off('onlineUsers', getOnlineUsers);
    }
  }, [socket, onlineUsers]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {
          loading ?
            (
              <MyModal>
                <ActivityIndicator size="large" color="white" className="tw-w-[70px] tw-h-[70px]" />
                <Text className="tw-text-white tw-font-bold">Loading, please wait...</Text>
              </MyModal>
            ) :
            (
              token ?
                (
                  <Stack.Navigator>
                    <Stack.Screen name='Home' component={Home} options={{ headerShown: false, animation: 'none' }} />
                    <Stack.Group>
                      <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false, animation: 'none' }} />
                      <Stack.Screen name='Settings' component={Settings} />
                    </Stack.Group>
                  </Stack.Navigator>
                ) :
                (
                  <Stack.Navigator>
                    <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                  </Stack.Navigator>
                )
            )
        }
      </NavigationContainer>
    </QueryClientProvider>
  );
}
