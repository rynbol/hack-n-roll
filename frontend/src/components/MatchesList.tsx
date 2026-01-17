import {View, ScrollView} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import {MatchAvatarItem} from './MatchAvatarItem';

const {height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

interface Match {
  id: string;
  name: string;
  age: number;
  imgUrl: any;
  isNew?: boolean;
}

interface MatchesListProps {
  data: Match[];
  onMatchPress?: (match: Match) => void;
}

export default function MatchesList({data, onMatchPress}: MatchesListProps) {
  return (
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: hp(2),
          paddingRight: hp(2),
        }}
      >
        {data?.map((match, index) => {
          return (
            <MatchAvatarItem
              key={match.id || index}
              imgUrl={match.imgUrl}
              name={match.name}
              isNew={match.isNew}
              onPress={() => onMatchPress?.(match)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
