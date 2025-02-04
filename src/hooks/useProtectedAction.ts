import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const useProtectedAction = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const protectedAction = async (action: () => Promise<void>) => {
    if (!user) {
      navigation.navigate('Auth');
      return;
    }
    await action();
  };

  return protectedAction;
};

export default useProtectedAction; 