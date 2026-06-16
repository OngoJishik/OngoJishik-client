import { useMutation } from '@tanstack/react-query';
import { uploadImages } from '../endpoints/upload';

/**
 * 이미지 업로드 뮤테이션 훅
 * mutateAsync를 사용해 호출하고 결과로 imageUrls 배열을 받는다.
 * @author Antigravity
 */
export const useUploadImagesMutation = () =>
  useMutation({ mutationFn: uploadImages });
