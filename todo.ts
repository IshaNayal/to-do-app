export interface Todo {
  id: number;
  task: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  display_name?: string;
  profile_picture_url?: string;
  provider?: string;
}
