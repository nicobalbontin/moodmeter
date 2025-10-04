export interface MoodSelection {
  id: string;
  user_name: string;
  user_color: string;
  selected_mood: string;
  session_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  sessionId: string;
  userName: string;
  userColor: string;
}

export interface MoodCardData {
  mood: string;
  users: MoodSelection[];
}

