import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface MatchAvatarItemProps {
  imgUrl: ImageSourcePropType;
  name: string;
  isNew?: boolean;
  onPress: () => void;
}

export const MatchAvatarItem: React.FC<MatchAvatarItemProps> = ({
  imgUrl,
  name,
  isNew = false,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={imgUrl} style={styles.avatar} />
        {isNew && (
          <View style={styles.newBadge}>
            <Ionicons name="heart" size={14} color={colors.white} />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.border,
  },
  newBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.badgePink,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    fontSize: 12,
    color: colors.textPrimary,
    maxWidth: 70,
    textAlign: 'center',
  },
});
