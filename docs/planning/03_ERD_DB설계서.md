# Opiki ERD / DB 설계서

## 1. 개체(Entity) 목록

| 엔티티 | 설명 |
|---|---|
| User | 회원 정보 |
| UserProfile | 맞춤 추천용 사용자 속성(나이/소득/학교/거주지 등) |
| Benefit | 혜택 공고 원본 정보 |
| BenefitSummary | AI가 생성한 혜택 요약본 |
| BenefitCategory | 혜택 분류(교통/저축/주거 등) |
| Scrap | 사용자 스크랩(즐겨찾기) |
| BenefitComparisonGroup | 중복 지원 불가 혜택 묶음 정의 |
| BenefitVariant | 하나의 혜택 내 조건별 방식 분기(예: K패스 옵션) |
| RecentView | 최근 본 공고 기록 |
| Notification | 발송된 알림 로그 |
| NotificationSetting | 사용자별 알림 수신 설정 |
| ChatSession / ChatMessage | AI 상담원 대화 이력 |
| PopularBenefitRank | 인기 혜택 TOP3 산정 결과(배치성 데이터) |

## 2. 테이블 정의

### 2.1 User
| 컬럼 | 타입 | 설명 |
|---|---|---|
| user_id (PK) | BIGINT | 사용자 고유 ID |
| email | VARCHAR | 로그인 이메일 |
| social_type | VARCHAR | 소셜 로그인 구분(NULL 가능) |
| created_at | DATETIME | 가입일 |
| onboarding_completed | BOOLEAN | 온보딩 완료 여부 |

### 2.2 UserProfile
| 컬럼 | 타입 | 설명 |
|---|---|---|
| profile_id (PK) | BIGINT | |
| user_id (FK → User) | BIGINT | |
| birth_year | INT | 나이 산정용 |
| income_range | VARCHAR | 소득 구간(코드화 권장) |
| school_status | VARCHAR | 재학/휴학/졸업 등 |
| region_code | VARCHAR | 거주지(법정동 코드 등 표준코드 권장) |
| updated_at | DATETIME | |

### 2.3 Benefit
| 컬럼 | 타입 | 설명 |
|---|---|---|
| benefit_id (PK) | BIGINT | |
| title | VARCHAR | 공고명 |
| organization | VARCHAR | 주관기관 |
| category_id (FK) | BIGINT | |
| eligibility_raw | TEXT | 자격요건 원문 |
| eligibility_conditions | JSON | 파싱된 자격조건(나이/소득/지역 등 매칭용) |
| apply_start_date | DATE | 신청 시작일 |
| apply_end_date | DATE | 신청 마감일 |
| apply_url | VARCHAR | 외부 신청 링크 |
| content_raw | TEXT | 공고 원문 |
| view_count | INT | 조회수(TOP3 산정용) |
| created_at | DATETIME | |

### 2.4 BenefitSummary
| 컬럼 | 타입 | 설명 |
|---|---|---|
| summary_id (PK) | BIGINT | |
| benefit_id (FK) | BIGINT | |
| summary_text | TEXT | AI 요약 결과 |
| generated_at | DATETIME | 캐시 갱신 시각 |

### 2.5 BenefitCategory
| 컬럼 | 타입 | 설명 |
|---|---|---|
| category_id (PK) | BIGINT | |
| name | VARCHAR | 예: 교통, 저축, 주거, 취업 |

### 2.6 Scrap
| 컬럼 | 타입 | 설명 |
|---|---|---|
| scrap_id (PK) | BIGINT | |
| user_id (FK) | BIGINT | |
| benefit_id (FK) | BIGINT | |
| created_at | DATETIME | |

### 2.7 BenefitComparisonGroup / BenefitComparisonGroupItem
중복 지원 불가 혜택(예: 청년도약계좌 vs 청년미래적금)을 묶는 테이블

| 컬럼 | 타입 | 설명 |
|---|---|---|
| group_id (PK) | BIGINT | |
| group_name | VARCHAR | 예: "청년 자산형성 상품군" |
| benefit_id (FK, N:M 연결테이블) | BIGINT | 그룹에 속한 혜택들 |

### 2.8 BenefitVariant
하나의 혜택 내에서 조건별로 방식이 갈리는 경우(예: K패스)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| variant_id (PK) | BIGINT | |
| benefit_id (FK) | BIGINT | |
| condition_rule | JSON | 적용 조건(예: 소득구간, 이용빈도) |
| variant_description | TEXT | 해당 조건일 때의 혜택 내용 |

### 2.9 RecentView
| 컬럼 | 타입 | 설명 |
|---|---|---|
| view_id (PK) | BIGINT | |
| user_id (FK) | BIGINT | |
| benefit_id (FK) | BIGINT | |
| viewed_at | DATETIME | |

### 2.10 Notification / NotificationSetting
| 컬럼 | 타입 | 설명 |
|---|---|---|
| notification_id (PK) | BIGINT | |
| user_id (FK) | BIGINT | |
| type | VARCHAR | START / DEADLINE / NEW_BENEFIT |
| benefit_id (FK, nullable) | BIGINT | |
| message | VARCHAR | |
| sent_at | DATETIME | |
| read_at | DATETIME (nullable) | |

| setting_id (PK) | BIGINT | |
| user_id (FK) | BIGINT | |
| push_enabled | BOOLEAN | |
| deadline_days_before | INT | 마감 며칠 전 알림 받을지 |

### 2.11 ChatSession / ChatMessage
| 컬럼 | 타입 | 설명 |
|---|---|---|
| session_id (PK) | BIGINT | |
| user_id (FK) | BIGINT | |
| started_at | DATETIME | |
| message_id (PK) | BIGINT | |
| session_id (FK) | BIGINT | |
| role | VARCHAR | user / assistant |
| content | TEXT | |
| created_at | DATETIME | |

## 3. 관계(Relationship) 요약

- User 1 : 1 UserProfile
- User 1 : N Scrap N : 1 Benefit
- Benefit 1 : 1 BenefitSummary
- Benefit N : 1 BenefitCategory
- BenefitComparisonGroup N : M Benefit (연결 테이블 필요)
- Benefit 1 : N BenefitVariant
- User 1 : N RecentView N : 1 Benefit
- User 1 : N Notification
- User 1 : 1 NotificationSetting
- User 1 : N ChatSession 1 : N ChatMessage

## 4. 비고

- `eligibility_conditions`(JSON)은 AI 맞춤 추천 매칭 로직의 핵심 필드 — 초기에는 수기/반자동 태깅, 이후 자동 파싱 고도화 권장
