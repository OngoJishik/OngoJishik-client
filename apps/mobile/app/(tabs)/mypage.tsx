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
          <Text variant="caption" style={{ color: colors.textTertiary, marginTop: 4 }}>
            {t('mypage.profileSubText', { defaultValue: '한국어 · 가입일 2024.03' })}
          </Text>
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
          title={t('mypage.favoritesList')}
          icon="♡"
          description={t('mypage.favoritesDesc', { defaultValue: '즐겨찾기한 음식 목록' })}
          onPress={() => router.push('/favorites' as any)}
        />
        <MenuItem
          title={t('mypage.searchHistory')}
          icon="🔍"
          description={t('mypage.searchHistoryDesc', { defaultValue: '최근 검색 기록 관리' })}
          onPress={() => router.push('/(tabs)/search' as any)}
        />
        <MenuItem
          title={t('mypage.myPosts')}
          icon="💬"
          description={t('mypage.myPostsDesc', { defaultValue: '내가 작성한 커뮤니티 글' })}
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
          title={t('mypage.language')}
          icon="⚙️"
          description={t('mypage.languageDesc', { defaultValue: '앱 표시 언어 변경' })}
          rightElement={<Text variant="caption" style={{ color: colors.textSecondary }}>{t('mypage.korean')}</Text>}
          onPress={() => router.push('/settings/language' as any)}
        />
        <MenuItem
          title={t('mypage.notifications')}
          icon="🔔"
          description={t('mypage.notificationsDesc', { defaultValue: '푸시 및 알림 수신 설정' })}
          rightElement={<Text variant="caption" style={{ color: colors.textSecondary }}>{t('common.on')}</Text>}
          onPress={() => router.push('/settings/notifications' as any)}
        />
        <MenuItem
          title={t('mypage.appInfo')}
          icon="ℹ️"
          description={t('mypage.appInfoDesc', { defaultValue: '버전 정보 및 이용약관' })}
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

export { MyPageScreen as default };

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
