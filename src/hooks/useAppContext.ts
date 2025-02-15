import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { useLocation } from '../contexts/LocationContext';

const useAppContext = () => ({
  ...useAuth(),
  ...useShop(),
  ...useLocation()
});

export default useAppContext; 