import { Component, ErrorInfo, ReactNode } from 'react';
import AppError, { errorHandler } from '../utils/errorHandler';
import { View } from 'react-native';
import { Text } from 'react-native-elements';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: AppError;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error: errorHandler.normalize(error)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorHandler.handle(error, 'component_error');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View>
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
} 