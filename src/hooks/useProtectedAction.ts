import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const useProtectedAction = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const protectedAction = async (action: () => Promise<void>) => {
    if (!user) {
      navigation.navigate('Auth', { 
        redirect: {
          screen: route.name as keyof RootStackParamList,
          params: route.params as RootStackParamList[keyof RootStackParamList]
        }
      });
      return;
    }
    await action();
  };

  return protectedAction;
};

export default useProtectedAction; 