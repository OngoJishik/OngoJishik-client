import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, Href, useFocusEffect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useTranslation } from '@ongo/i18n';
import { ScreenLayout, Header, Avatar, MenuItem, Text, Icon, useTheme } from '@ongo/ui';
import { useLogoutMutation, useMyBoardsQuery, useFavoritesQuery, useSearchHistoryQuery } from '@ongo/api-client';
import {
    currentUserAtom,
    localFavoritesAtom,
    searchHistoryAtom,
    authTokenAtom,
    refreshTokenAtom,
    userProfileAtom,
} from '@ongo/store';
import { storage } from '@ongo/utils';
import type { TUserProfile } from '@ongo/api-client';

/**
 * 마이페이지 화면 컴포넌트
 * 사용자 정보, 요약 통계(즐겨찾기, 내 게시글, 검색 기록), 그리고 설정 메뉴들을 표시합니다.
 * @author Antigravity
 */
export const MyPageScreen = () => {
    const router = useRouter();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const currentUser = useAtomValue(currentUserAtom);
    const favorites = useAtomValue(localFavoritesAtom);
    const searchHistory = useAtomValue(searchHistoryAtom);
    const refreshToken = useAtomValue(refreshTokenAtom);

    // 디바이스에 저장된 프로필을 직접 읽어 화면에 사용한다.
    // currentUser(파생 atom)는 콜드 스타트 시 비동기 하이드레이션 타이밍에 따라 null로
    // 해소될 수 있어 이름/메일이 사라지는 문제가 있었다. AsyncStorage를 직접 읽으면
    // Jotai 비동기 타이밍과 무관하게 항상 영속된 값을 복원할 수 있다.
    const [storedProfile, setStoredProfile] = useState<TUserProfile | null>(null);

    const { mutateAsync: logout } = useLogoutMutation();
    const setAuthToken = useSetAtom(authTokenAtom);
    const setRefreshToken = useSetAtom(refreshTokenAtom);
    const setUserProfile = useSetAtom(userProfileAtom);

    // 내 게시글 총 개수 조회 (size=1로 totalElements만 효율적으로 가져옴)
    const { data: myBoardsData, refetch: refetchMyBoards } = useMyBoardsQuery(0, 1);
    const postCount = myBoardsData?.totalElements ?? currentUser?.postCount ?? 0;

    // 내 즐겨찾기 총 개수 및 목록 조회
    const { data: bookmarksData, refetch: refetchFavorites } = useFavoritesQuery();

    // 최근 검색 기록 총 개수 조회
    const { data: historyData, refetch: refetchSearchHistory } = useSearchHistoryQuery();

    // 화면 포커스 시 모든 카운트 데이터 강제 갱신 (실시간 동기화 보장)
    // + 디바이스에 영속된 프로필(ongo_user_profile)을 직접 복원
    useFocusEffect(
        useCallback(() => {
            refetchMyBoards();
            refetchFavorites();
            refetchSearchHistory();

            let active = true;
            storage.getItem<TUserProfile>('ongo_user_profile').then((profile) => {
                if (active) {
                    setStoredProfile(profile);
                }
            });
            return () => {
                active = false;
            };
        }, [refetchMyBoards, refetchFavorites, refetchSearchHistory]),
    );

    const handleLogout = () => {
        Alert.alert(
            t('mypage.logout', { defaultValue: '로그아웃' }),
            t('mypage.logoutConfirm', { defaultValue: '정말 로그아웃 하시겠습니까?' }),
            [
                { text: t('common.cancel', { defaultValue: '취소' }), style: 'cancel' },
                {
                    text: t('common.confirm', { defaultValue: '확인' }),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout(refreshToken);
                        } catch (error) {
                            if (__DEV__) {
                                console.warn('Logout API failed:', error);
                            }
                        } finally {
                            // Always clear client session states
                            setAuthToken(null);
                            setRefreshToken(null);
                            setUserProfile(null);
                            try {
                                await GoogleSignin.signOut();
                            } catch (e) {
                                if (__DEV__) {
                                    console.error('Google SignOut error:', e);
                                }
                            }
                            router.replace('/(auth)/login');
                        }
                    },
                },
            ],
        );
    };

    // 라이브 atom(currentUser)을 우선 사용하고, 콜드 스타트 등으로 비어 있으면
    // 디바이스에 영속된 값(storedProfile)으로 복원한다.
    const displayName = currentUser?.name ?? storedProfile?.name ?? '전통요리사_하나';
    const displayEmail = currentUser?.email ?? storedProfile?.email ?? 'hana@gmail.com';
    const favCount = bookmarksData?.totalCount ?? 0;
    const searchCount = historyData?.totalCount ?? searchHistory.length ?? 0;

    return (
        <ScreenLayout scrollable>
            <Header title={t('mypage.title')} titleIcon="mypage" />

            <View style={styles.profileSection}>
                <Avatar name={displayName} size={64} />
                <View style={styles.profileMeta}>
                    <Text variant="h3" bold>
                        {displayName}
                    </Text>
                    <Text variant="caption" style={{ color: colors.textSecondary }}>
                        {displayEmail}
                    </Text>
                    <Text variant="caption" style={{ color: colors.textTertiary, marginTop: 4 }}>
                        {t('mypage.profileSubText')}
                    </Text>
                </View>
            </View>

            <View style={[styles.statsBar, { backgroundColor: colors.primaryLight }]}>
                <View style={styles.statCol}>
                    <Text variant="h2" bold style={[styles.statVal, { color: colors.primary }]}>
                        {favCount}
                    </Text>
                    <Text variant="caption" style={{ color: colors.textSecondary }}>
                        {t('mypage.favorites')}
                    </Text>
                </View>
                <View style={[styles.statCol, styles.statDivider, { borderColor: colors.border }]}>
                    <Text variant="h2" bold style={[styles.statVal, { color: colors.primary }]}>
                        {postCount}
                    </Text>
                    <Text variant="caption" style={{ color: colors.textSecondary }}>
                        {t('mypage.posts')}
                    </Text>
                </View>
                <View style={styles.statCol}>
                    <Text variant="h2" bold style={[styles.statVal, { color: colors.primary }]}>
                        {searchCount}
                    </Text>
                    <Text variant="caption" style={{ color: colors.textSecondary }}>
                        {t('mypage.searchHistory')}
                    </Text>
                </View>
            </View>

            <View style={styles.menuContainer}>
                <MenuItem
                    title={t('mypage.favoritesList')}
                    icon="★"
                    iconName="star-filled"
                    description={t('mypage.favoritesDesc')}
                    onPress={() => router.push('/favorites')}
                />
                <MenuItem
                    title={t('mypage.searchHistory')}
                    icon="🔍"
                    iconName="search"
                    description={t('mypage.searchHistoryDesc')}
                    onPress={() => router.push('/search-history')}
                />
                <MenuItem
                    title={t('mypage.myPosts')}
                    icon="💬"
                    iconName="write"
                    description={t('mypage.myPostsDesc')}
                    onPress={() => router.push('/my-posts')}
                />
                <MenuItem
                    title={t('mypage.myComments', '내가 작성한 댓글')}
                    icon="💬"
                    iconName="comment"
                    description={t('mypage.myCommentsDesc', '내가 작성한 댓글들을 확인합니다.')}
                    onPress={() => router.push('/my-comments' as Href)}
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
                    description={t('mypage.languageDesc')}
                    onPress={() => router.push('/settings/language')}
                />
                <MenuItem
                    title={t('mypage.permissions')}
                    icon="🔒"
                    description={t('mypage.permissionsDesc')}
                    onPress={() => router.push('/settings/permissions' as Href)}
                />
                <MenuItem
                    title={t('mypage.appInfo')}
                    icon="ℹ️"
                    description={t('mypage.appInfoDesc')}
                    rightElement={
                        <Text variant="caption" style={{ color: colors.textSecondary }}>
                            v1.2.4
                        </Text>
                    }
                    onPress={() => router.push('/settings/info' as Href)}
                />
                <MenuItem
                    title={t('mypage.logout', { defaultValue: '로그아웃' })}
                    icon="🚪"
                    description={t('mypage.logoutDesc', {
                        defaultValue: '기기에서 로그아웃하고 로그인 화면으로 돌아갑니다.',
                    })}
                    onPress={handleLogout}
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
