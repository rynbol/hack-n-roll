import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface BadgeProps {
  count: number;
  size?: 'small' | 'medium';
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  size = 'medium',
  backgroundColor = colors.badgeRed,
  style,
}) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  const sizeMap = {
    small: {
      container: 16,
      fontSize: 10,
    },
    medium: {
      container: 20,
      fontSize: 12,
    },
  };

  const dimensions = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          minWidth: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container / 2,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: dimensions.fontSize,
          },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
