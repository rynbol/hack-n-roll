import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';

const {height} = Dimensions.get('window');
const hp = (percentage: number) => (height * percentage) / 100;

interface Match {
  id: string;
  name: string;
  age: number;
  imgUrl: any;
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
        className="space-x-4"
        contentContainerStyle={{
          paddingLeft: hp(2),
          paddingRight: hp(2),
        }}
      >
        {data?.map((match, index) => {
          return (
            <TouchableOpacity
              key={match.id || index}
              className="flex items-center space-y-1"
              onPress={() => onMatchPress?.(match)}
            >
              <View className="rounded-full">
                <Image
                  source={match.imgUrl}
                  style={{
                    width: hp(6),
                    height: hp(6),
                  }}
                  className="rounded-full"
                />
              </View>
              <Text className="text-neutral-800 font-bold text-sm">
                {match.name}
              </Text>
              <Text className="text-neutral-800 font-bold text-xs">
                {match.age}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
