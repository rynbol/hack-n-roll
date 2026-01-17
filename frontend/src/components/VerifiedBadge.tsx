import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface VerifiedBadgeProps {
  verified: boolean;
  size?: number;
  style?: ViewStyle;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  verified,
  size = 16,
  style,
}) => {
  if (!verified) return null;

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="checkmark-circle" size={size} color={colors.badgeBlue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
