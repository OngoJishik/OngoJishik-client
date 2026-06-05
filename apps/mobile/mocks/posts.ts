/**
 * 모바일 앱에서 사용되는 커뮤니티 게시글 및 댓글 Mock 데이터 목록
 * @author Antigravity
 */
export const MOCK_POSTS = [
  {
    id: 'post1',
    author: { name: '전통요리사_하나', avatarUrl: undefined },
    createdAt: '2026-05-27T08:00:00Z',
    category: '조리 후기',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
    ],
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
    category: '나만의 레시피',
    images: [],
    linkedRecipe: { id: 'gujelpan', nameKo: '구절판', emoji: '🍱' },
    content: 'I tried Gujeolpan for the first time in a royal palace restaurant in Seoul. The presentation is so artistic with 9 different colorful ingredients! Rolling them inside the small thin wheat crepes was an interactive and delightful dining experience. Highly recommend!',
    likeCount: 84,
    commentCount: 12,
    isLiked: false,
  },
];

export const MOCK_MY_POSTS = [
  {
    id: 'my-post1',
    author: { name: '전통요리사_하나', avatarUrl: undefined },
    createdAt: '2026-05-27T08:00:00Z',
    category: '조리 후기',
    images: [],
    linkedRecipe: { id: 'yukgaejang', nameKo: '육개장', emoji: '🍲' },
    content: '대구식 정통 육개장 끓여봤어요! 할머니 대부터 전해 내려온 비법은 다름 아닌 잘 볶은 고추기름과 듬뿍 넣은 대파입니다. 푹 끓여내니 국물이 시원하고 정말 보신이 되네요. 다들 이번 주말 점심으로 얼큰한 육개장 어떠세요?',
    likeCount: 128,
    commentCount: 23,
    isLiked: true,
  },
];

export const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: { name: 'KimCook', avatarUrl: undefined },
    createdAt: '2026-05-27T08:15:00Z',
    content: '우와, 정말 칼칼하고 시원해보여요! 고춧기름 내는 비결이 궁금하네요.',
  },
  {
    id: 'c2',
    author: { name: '전통매니아', avatarUrl: undefined },
    createdAt: '2026-05-27T09:00:00Z',
    content: '대파를 푹 끓이면 은은한 단맛도 돌아서 국물 맛이 일품이죠. 멋진 레시피 후기 감사드립니다!',
  },
];
