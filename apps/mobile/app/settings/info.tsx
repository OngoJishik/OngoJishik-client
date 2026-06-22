import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  Text,
  useTheme,
} from '@ongo/ui';

/**
 * 앱 정보 및 이용약관 화면 컴포넌트
 * 앱의 버전 정보를 보여주고, 법무법인 별 가이드라인에 맞춘 이용약관을 제공합니다.
 * @author Antigravity
 */
export const AppInfoScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScreenLayout>
      <Header title={t('appInfo.title', '앱 정보')} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* 앱 버전 정보 카드 */}
        <View style={[styles.versionCard, { backgroundColor: colors.primaryLight }]}>
          <Text variant="h3" bold style={{ color: colors.primary }}>
            온고지식 (溫故 지식)
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
            {t('appInfo.version', '버전')} v1.0.0
          </Text>
        </View>

        {/* 이용약관 영역 */}
        <Text variant="label" bold style={[styles.termsTitle, { color: colors.text }]}>
          {t('appInfo.termsTitle', '서비스 이용약관')}
        </Text>

        <View style={[styles.termsContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
          {/* 1. 용어의 정의 */}
          <View style={styles.section}>
            <Text variant="label" bold style={{ color: colors.text }}>
              {t('appInfo.definitionsTitle')}
            </Text>
            <Text variant="body" style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {t('appInfo.definitionsDesc')}
            </Text>
          </View>

          {/* 2. 이용자의 의무 및 면책 사항 */}
          <View style={styles.section}>
            <Text variant="label" bold style={{ color: colors.text }}>
              {t('appInfo.obligationsTitle')}
            </Text>
            <Text variant="body" style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {t('appInfo.obligationsDesc')}
            </Text>
          </View>

          {/* 3. 이용정지 및 탈퇴 */}
          <View style={styles.section}>
            <Text variant="label" bold style={{ color: colors.text }}>
              {t('appInfo.suspensionTitle')}
            </Text>
            <Text variant="body" style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {t('appInfo.suspensionDesc')}
            </Text>
          </View>

          {/* 4. 분쟁 해결 및 관할 */}
          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text variant="label" bold style={{ color: colors.text }}>
              {t('appInfo.disputeTitle')}
            </Text>
            <Text variant="body" style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {t('appInfo.disputeDesc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export { AppInfoScreen as default };

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  versionCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  termsTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  termsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EDE3',
    paddingBottom: 16,
  },
  sectionBody: {
    marginTop: 8,
    lineHeight: 20,
    fontSize: 14,
  },
});
