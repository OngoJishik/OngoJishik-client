import { apiClient } from '../client';

/**
 * 업로드할 이미지 파일 정보 타입
 * React Native FormData에서 사용하는 { uri, name, type } 구조
 * @author Antigravity
 */
export type TImageFile = {
  uri: string;
  name: string;
  type: string;
};

/**
 * 이미지 업로드 응답 타입
 * @author Antigravity
 */
export type TImageUploadResponse = {
  imageUrls: string[];
};

/**
 * 여러 이미지를 서버에 업로드하고 저장된 URL 목록을 반환
 * @author Antigravity
 */
export const uploadImages = async (files: TImageFile[]): Promise<TImageUploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  });
  const response = await apiClient.post<TImageUploadResponse>('/api/uploads/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
