import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  PostCard,
  Text,
  Chip,
  Icon,
} from '@ongo/ui';

const MOCK_POSTS = [
  {
    id: 'post1',
    author: { name: '전통요리사_하나', avatarUrl: undefined },
    createdAt: '2026-05-27T08:00:00Z',
    language: 'Korean',
    images: [],
    linkedRecipe: { id: 'yukgaejang', nameKo: '육개장', emoji: '🍲' },
    content: '대구식 정통 육개장 끓여봤어요! 할머니 대부터 전해 내려온 비법은 다름 아닌 잘 볶은 고추기름과 듬뿍 넣은 대파입니다. 푹 끓여내니 국물이 시원하고 정말 보신이 되네요. 다들 이번 주말 점심으로 얼큰한 육개장 어떠세요?',
    likeCount: 128,
    commentCount: 23,
    isLiked: true,
  },
  {
    id: 'post2',
    author: { name: 'GourmetTraveler', avatarUrl: undefined },
    createdAt: '2026-05-26T15:30:00Z',
    language: 'English',
    images: [],
    linkedRecipe: { id: 'gujelpan', nameKo: '구절판', emoji: '🍱' },
    content: 'I tried Gujeolpan for the first time in a royal palace restaurant in Seoul. The presentation is so artistic with 9 different colorful ingredients! Rolling them inside the small thin wheat crepes was an interactive and delightful dining experience. Highly recommend!',
    likeCount: 84,
    commentCount: 12,
    isLiked: false,
  },
];

const FILTER_CATEGORIES = ['전체', '조리 후기', '나만의 레시피', '질문/답변'];

export default function CommunityScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handlePostPress = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  };

  return (
    <ScreenLayout>
      <Header
        title="💬 커뮤니티"
        rightAction={
          <TouchableOpacity onPress={() => router.push('/community/write')}>
            <Icon name="write" size={22} />
          </TouchableOpacity>
        }
      />

      <View style={styles.filterBar}>
        {FILTER_CATEGORIES.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              variant="caption"
              bold={selectedFilter === filter}
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            author={item.author}
            createdAt={item.createdAt}
            language={item.language}
            images={item.images}
            linkedRecipe={item.linkedRecipe}
            content={item.content}
            likeCount={item.likeCount}
            commentCount={item.commentCount}
            isLiked={item.isLiked}
            onPress={() => handlePostPress(item.id)}
            onLike={() => handleLike(item.id)}
            onShare={() => console.log('Share post', item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DD',
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F5F3EF',
  },
  activeFilterTab: {
    backgroundColor: '#C85A28', // Primary main
  },
  filterText: {
    color: '#8C8578',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 48,
  },
});
