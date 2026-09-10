import type { UserProfile } from '../types/user';

export const mockUserProfile: UserProfile = {
  nickname: '성결 멋사',
  name: '성결',
  age: 21,
  region: '경기도 안양시',
  incomeLevel: '-',
  educationStatus: '대학교 재학',
  major: '공학계열',
  employmentStatus: '미취업',
  specialty: '-',
  note: '-',
};

export interface MockNotification {
  id: string;
  type: 'deadline' | 'apply-start' | 'new' | 'notice';
  title: string;
  description?: string;
  badge?: string; // 예: D-10, 마감
  timeAgo: string; // 예: "하루 전"
}

export const mockNotifications: MockNotification[] = [
  {
    id: 'n-1',
    type: 'deadline',
    title: '국가근로장학금 2학기',
    description: '신청 마감일이 10일 남았어요!',
    badge: 'D-10',
    timeAgo: '하루 전',
  },
  {
    id: 'n-2',
    type: 'new',
    title: '청년 내일채움 공채',
    description: '2년 근속 시 1,200만원 + α',
    timeAgo: '3일 전',
  },
  {
    id: 'n-3',
    type: 'deadline',
    title: '국가근로장학금 2학기',
    description: '신청이 마감되었어요',
    badge: '마감',
    timeAgo: '5일 전',
  },
  {
    id: 'n-4',
    type: 'notice',
    title: '서비스 점검 안내',
    description: '5/24(일) 새벽 서비스 점검이 있어요',
    timeAgo: '6일 전',
  },
];
