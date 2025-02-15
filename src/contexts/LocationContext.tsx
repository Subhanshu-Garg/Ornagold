import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import AppError, { errorHandler } from '../utils/errorHandler';

type LocationContextType = {
  location: Location.LocationObject | null;
  locationLoading: boolean;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
  getBestForNavigationLocation: () => Promise<Location.LocationObject | null>;
  reverseGeocode: (location: Location.LocationObject) => Promise<Location.LocationGeocodedAddress[]>;
};

const LocationContext = createContext<LocationContextType>({} as LocationContextType);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation().catch((error) => 
      errorHandler.handle(error, "location")
    );
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new AppError('VALIDATION', 'Location access required!');
      }

      const location = await Location.getLastKnownPositionAsync({
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
      }) || await Location.getCurrentPositionAsync()
      setLocation(location);
    } finally {
      setLoading(false);
      return location;
    }
  };

  const getBestForNavigationLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new AppError('VALIDATION', 'Location access denied!');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      });

       // Check if precise location is enabled
      const providerStatus = await Location.getProviderStatusAsync();
      if (!providerStatus.locationServicesEnabled || !providerStatus.gpsAvailable) {
        throw new AppError('VALIDATION', 'Please enable precise location in your device settings to continue.')
      }
      
      setLocation(location);
    } catch (error) {
      throw new AppError('UNKNOWN', 'Something went wrong while fetching location!', error)
    } finally {
      setLoading(false);
      return location;
    }
  };

  const reverseGeocode = async (location: Location.LocationObject) => {
    return Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const value = useMemo(() => ({
    location,
    locationLoading: loading,
    getCurrentLocation,
    reverseGeocode,
    getBestForNavigationLocation
  }), [location, loading]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext); 