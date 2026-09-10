export interface UserProfile {
  nickname: string;
  name: string;
  age: number;
  region: string; // 거주지 (시/구 단위)
  addressDetail?: string;
  incomeLevel?: string; // 소득 분위 (예: "9분위")
  educationStatus: string; // 예: "대학교 재학"
  school?: string;
  major?: string;
  employmentStatus: string; // 예: "미취업"
  specialty?: string; // 특화분야
  note?: string; // 추가사항
}

export interface AuthState {
  isLoggedIn: boolean;
  onboardingCompleted: boolean;
  profile: UserProfile | null;
}
