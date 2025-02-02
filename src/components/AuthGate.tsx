import React, { useContext, useState } from 'react';
import { Modal } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from '../screens/AuthScreen';

const AuthGate = () => {
  const { user, handleAuthSuccess } = useAuth();

  if (!user) {
    return (
      <Modal visible={true}>
        <AuthScreen/>
      </Modal>
    );
  }

  return null;
};

export default AuthGate; 