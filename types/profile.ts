export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserMedia {
  id: string;
  name: string;
  file_name: string;
  mime_type: string;
  media_type: string;
  reward: number;
  url: string;
  description: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  created_at: string;
  updated_at: string;
  has_watched: boolean;
  thumbnail: string | null;
  uploader_id: string;
  uploader_username: string;
}

export interface ProfileFormData {
  name: string;
}

export interface UpdateProfileRequest {
  name?: string;
}

export interface ProfileResponse {
  user: UserProfile;
  media: UserMedia[];
} 