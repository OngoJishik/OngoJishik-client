import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  Avatar,
  MenuItem,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';

/**
 * 마이페이지 화면 컴포넌트
 * 사용자 정보, 요약 통계(즐겨찾기, 내 게시글, 검색 기록), 그리고 설정 메뉴들을 표시합니다.
 * @author Antigravity
 */
export const MyPageScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScreenLayout scrollable>
      <Header
        title={`👤 ${t('mypage.title')}`}
        rightAction={
          <Pressable onPress={() => {
            if (__DEV__) {
              console.log('Settings pressed');
            }
          }}>
            <Icon name="settings" size={22} color={colors.text} />
          </Pressable>
        }
      />

      <View style={styles.profileSection}>
        <Avatar name="전통요리사_하나" size={64} />
        <View style={styles.profileMeta}>
          <Text variant="h3" bold>
            전통요리사_하나
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>hana@gmail.com</Text>
        </View>
      </View>

      <View style={[styles.statsBar, { backgroundColor: colors.primaryLight }]}>
        <View style={styles.statCol}>
          <Text variant="h2" bold style={[styles.statVal, { color: designColors.primary.DEFAULT }]}>
            12
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>{t('mypage.favorites')}</Text>
        </View>
        <View style={[styles.statCol, styles.statDivider, { borderColor: colors.border }]}>
          <Text variant="h2" bold style={[styles.statVal, { color: designColors.primary.DEFAULT }]}>
            5
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>{t('mypage.posts')}</Text>
        </View>
        <View style={styles.statCol}>
          <Text variant="h2" bold style={[styles.statVal, { color: designColors.primary.DEFAULT }]}>
            28
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>{t('mypage.searchHistory')}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          label={t('mypage.favoritesList')}
          iconName="heart"
          onPress={() => router.push('/favorites' as any)}
        />
        <MenuItem
          label={t('mypage.searchHistory')}
          iconName="search"
          onPress={() => router.push('/(tabs)/search' as any)}
        />
        <MenuItem
          label={t('mypage.myPosts')}
          iconName="community"
          onPress={() => router.push('/my-posts' as any)}
        />
      </View>

      <View style={styles.settingsHeader}>
        <Text variant="caption" bold style={{ color: colors.textSecondary }}>
          {t('mypage.settingsTitle')}
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          label={t('mypage.language')}
          iconName="settings"
          rightElement={<Text variant="caption" style={{ color: colors.textSecondary }}>{t('mypage.korean')}</Text>}
          onPress={() => router.push('/settings/language' as any)}
        />
        <MenuItem
          label={t('mypage.notifications')}
          iconName="bell"
          rightElement={<Text variant="caption" style={{ color: colors.textSecondary }}>{t('common.on')}</Text>}
          onPress={() => router.push('/settings/notifications' as any)}
        />
        <MenuItem
          label={t('mypage.appInfo')}
          iconName="info"
          rightElement={<Text variant="caption" style={{ color: colors.textSecondary }}>v1.0.0</Text>}
          onPress={() => {
            if (__DEV__) {
              console.log('App Info pressed');
            }
          }}
        />
      </View>
    </ScreenLayout>
  );
};

export default MyPageScreen;

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
    marginBottom: 4,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  menuContainer: {
    marginBottom: 16,
  },
  settingsHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
});
