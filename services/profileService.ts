import { api } from '@/context/auth';
import type { UserProfile, UserMedia, UpdateProfileRequest, ProfileResponse } from '../types/profile';

export class ProfileService {
  static async getProfile(): Promise<ProfileResponse> {
    const response = await api.get('/profile');
    return response.data;
  }

  static async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put('/profile', data);
    return response.data;
  }

  static async getUserMedia(): Promise<UserMedia[]> {
    const response = await api.get('/user/media');
    return response.data;
  }

  static async deleteMedia(mediaId: string): Promise<void> {
    await api.delete(`/media/${mediaId}`);
  }
} 