import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';

interface ActionButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  color: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onPress,
  color,
  size = 'medium',
  disabled = false,
  style,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeMap = {
    small: 48,
    medium: 56,
    large: 64,
  };

  const buttonSize = sizeMap[size];

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          {
            backgroundColor: color,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
        activeOpacity={0.8}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
