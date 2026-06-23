import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '../primitives/Text';
import { Card } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { Icon } from '../primitives/Icon';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';
import { radius } from '../../tokens/radius';

export interface MarketCardProps {
  /** 시장 이름 */
  name: string;
  /** 사용자 위치로부터의 거리 (km) */
  distanceKm: number;
  /** 도로명 주소 */
  addressRoad: string;
  /** 시장 개설 주기 (예: "매일", "5일장") */
  openCycle: string;
  /** 취급 카테고리 정보 한글 라벨 */
  categoryLabel: string;
  /** 주차장 보유 여부 */
  hasParking: boolean;
  /** 클릭 핸들러 (현재 범위에서는 선택형) */
  onPress?: () => void;
  /** 번역된 카테고리 가이드 텍스트 (예: "채소, 수산물을 취급하는 시장입니다") */
  categoryGuideText: string;
  /** 번역된 주차 가능 라벨 (예: "주차 가능") */
  parkingLabel: string;
  /** 번역된 개설 주기 라벨 (예: "운영: 매일") */
  openCycleLabel: string;
}

/**
 * 근처 전통시장 목록에서 개별 시장 정보를 표시하는 카드 컴포넌트
 * @author Antigravity
 */
export const MarketCard: React.FC<MarketCardProps> = ({
  name,
  distanceKm,
  addressRoad,
  openCycle,
  categoryLabel,
  hasParking,
  onPress,
  categoryGuideText,
  parkingLabel,
  openCycleLabel,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.pressable}>
      {({ pressed }) => (
        <Card
          bordered
          style={{
            ...styles.card,
            opacity: pressed ? 0.75 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <View style={styles.row}>
            {/* 왼쪽 아이콘 영역 */}
            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryLight }]}>
              <Icon name="location" size={24} color={colors.primary} />
            </View>

            {/* 중간 정보 영역 */}
            <View style={styles.infoWrapper}>
              <View style={styles.titleRow}>
                <Text variant="h3" bold style={[styles.title, { color: colors.text }]}>
                  {name}
                </Text>
                <Badge
                  label={`${distanceKm.toFixed(1)}km`}
                  variant="secondary"
                  style={styles.distanceBadge}
                />
              </View>

              {/* 취급 카테고리 정보 */}
              <Text
                variant="caption"
                style={[
                  styles.categoryText,
                  { color: categoryLabel ? colors.primary : colors.textTertiary },
                ]}
                numberOfLines={1}
              >
                {categoryGuideText}
              </Text>

              {/* 주소 정보 */}
              {!!addressRoad && (
                <Text variant="caption" style={[styles.addressText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {addressRoad}
                </Text>
              )}

              {/* 태그 리스트 (운영 주기, 주차 여부) */}
              <View style={styles.tagList}>
                {!!openCycle && (
                  <View style={[styles.tag, { backgroundColor: colors.border }]}>
                    <Text variant="caption" style={[styles.tagText, { color: colors.textSecondary }]}>
                      {openCycleLabel}
                    </Text>
                  </View>
                )}
                {hasParking && (
                  <View style={[styles.tag, { backgroundColor: '#E8F5E9' }]}>
                    <Text variant="caption" style={[styles.tagText, { color: colors.success }]}>
                      🚗 {parkingLabel}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 오른쪽 화살표 영역 */}
            {!!onPress && (
              <Icon
                name="chevron-right"
                size={16}
                color={colors.textTertiary}
                style={styles.arrow}
              />
            )}
          </View>
        </Card>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginBottom: spacing.md,
    width: '100%',
  },
  card: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  locationEmoji: {
    fontSize: 22,
  },
  infoWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 16,
    flexShrink: 1,
    marginRight: spacing.xs,
  },
  distanceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  arrow: {
    marginLeft: spacing.sm,
  },
});
