export default {
  "expo": {
    "name": "Ornagold",
    "slug": "ornagold",
    "version": "1.0.1",
    "orientation": "portrait",
    "icon": "./assets/images/ornagold-logo.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": false,
    "extra": {
      "eas": {
        "projectId": "5782fe14-d5ee-4ead-bd28-2181e17c5eb1"
      },
      "supabaseUrl": process.env.SUPABASE_URL,
      "supabaseAnonKey": process.env.SUPABASE_ANON_KEY
    },
    "android": {
      "package": "com.ornagold.app",
      "versionCode": 2,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#eae0cd"
      },
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyANJrc9Q_UT6H5opDEhi7cQQHpVdZ_Ixtg"
        }
      },
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ornagold.app",
      "config": {
        "googleMapsApiKey": "AIzaSyANJrc9Q_UT6H5opDEhi7cQQHpVdZ_Ixtg"
      },
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app uses your location to show nearby gold shops."
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/adaptive-icon.png",
      "build": {
        "babel": {
          "include": [
            "react-native-maps"
          ]
        }
      }
    },
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "android": {
            "enableHermes": true,
            "newArchEnabled": false
          }
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#eae0cd"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos for your shop."
        }
      ],
      "expo-updates"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "owner": "ornagold_01",
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/5782fe14-d5ee-4ead-bd28-2181e17c5eb1",
      "fallbackToCacheTimeout": 0
    }
  }
};
