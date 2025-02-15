import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { ShopProvider } from "./contexts/ShopContext";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <ShopProvider>{children}</ShopProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
