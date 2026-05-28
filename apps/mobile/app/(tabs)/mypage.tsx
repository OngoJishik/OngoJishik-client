import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  Avatar,
  MenuItem,
  Text,
  Icon,
} from '@ongo/ui';

export default function MyPageScreen() {
  const router = useRouter();

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScreenLayout scrollable>
      <Header
        title="👤 마이페이지"
        rightAction={
          <TouchableOpacity onPress={() => console.log('Settings')}>
            <Icon name="settings" size={22} />
          </TouchableOpacity>
        }
      />

      <View style={styles.profileSection}>
        <Avatar name="전통요리사_하나" size={64} />
        <View style={styles.profileMeta}>
          <Text variant="h3" bold>
            전통요리사_하나
          </Text>
          <Text variant="caption">hana@gmail.com</Text>
        </View>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statCol}>
          <Text variant="h2" bold style={styles.statVal}>
            12
          </Text>
          <Text variant="caption">즐겨찾기</Text>
        </View>
        <View style={[styles.statCol, styles.statDivider]}>
          <Text variant="h2" bold style={styles.statVal}>
            5
          </Text>
          <Text variant="caption">게시글</Text>
        </View>
        <View style={styles.statCol}>
          <Text variant="h2" bold style={styles.statVal}>
            28
          </Text>
          <Text variant="caption">검색 기록</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          label="즐겨찾기 목록"
          iconName="heart"
          onPress={() => console.log('Favorites List')}
        />
        <MenuItem
          label="검색 기록"
          iconName="search"
          onPress={() => console.log('Search History')}
        />
        <MenuItem
          label="내 게시글"
          iconName="community"
          onPress={() => console.log('My Posts')}
        />
      </View>

      <View style={styles.settingsHeader}>
        <Text variant="caption" bold style={{ color: '#8C8578' }}>
          설정 및 정보
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          label="언어 설정"
          iconName="settings"
          rightElement={<Text variant="caption">한국어</Text>}
          onPress={() => handleMenuPress('/settings/language')}
        />
        <MenuItem
          label="알림 설정"
          iconName="bell"
          rightElement={<Text variant="caption">켜짐</Text>}
          onPress={() => handleMenuPress('/settings/notifications')}
        />
        <MenuItem
          label="앱 정보"
          iconName="info"
          rightElement={<Text variant="caption">v1.0.0</Text>}
          onPress={() => console.log('App Info')}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileMeta: {
    marginLeft: 16,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F3EF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    color: '#C85A28', // Primary
    marginBottom: 4,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D4CFC6',
  },
  menuContainer: {
    marginBottom: 16,
  },
  settingsHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
});
