# Opiki API 명세서

> 공통 규칙: Base URL `/api/v1`, 인증 필요 API는 Header `Authorization: Bearer {token}`
> 응답 포맷: `{ "success": boolean, "data": {...}, "error": {...} }`

## 1. 인증 / 온보딩

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | /auth/signup | 회원가입 | X |
| POST | /auth/login | 로그인 | X |
| POST | /auth/social/{provider} | 소셜 로그인 | X |
| POST | /users/me/profile | 온보딩 프로필 등록(나이/소득/학교/거주지) | O |
| PATCH | /users/me/profile | 프로필 수정 | O |
| GET | /users/me/profile | 내 프로필 조회 | O |

## 2. 혜택 탐색 / 상세

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| GET | /benefits | 혜택 목록 (필터: category, region, keyword, page) | X |
| GET | /benefits/popular | 인기 혜택 TOP3 | X |
| GET | /benefits/{benefit_id} | 혜택 상세 원문 | X |
| GET | /benefits/{benefit_id}/summary | AI 요약본 조회(캐시 없으면 생성) | X |
| GET | /benefits/recommended | 로그인 사용자 맞춤 추천 목록 | O |
| GET | /benefits/{benefit_id}/compare | 조건별 방식 비교(AI 분석, 예: K패스) | O |

## 3. 스크랩

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | /scraps | 스크랩 등록 (body: benefit_id) | O |
| DELETE | /scraps/{benefit_id} | 스크랩 해제 | O |
| GET | /scraps | 내 스크랩 목록 | O |
| GET | /scraps/conflicts | 중복 지원 불가 그룹 내 스크랩 존재 시 AI 비교 안내 | O |

## 4. 캘린더

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| GET | /calendar/events | 스크랩 기반 신청기간 캘린더 데이터 (월 단위 쿼리) | O |
| GET | /calendar/upcoming | 마감 임박순 리스트 | O |
| GET | /calendar/export | 기본 캘린더 앱 연동용 .ics 파일 생성 | O |

## 5. 알림

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| GET | /notifications | 알림 히스토리 조회 | O |
| PATCH | /notifications/{id}/read | 알림 읽음 처리 | O |
| GET | /notifications/settings | 알림 수신 설정 조회 | O |
| PATCH | /notifications/settings | 알림 수신 설정 변경(마감 D-day 등) | O |
| POST | /notifications/device-token | FCM 디바이스 토큰 등록 | O |

## 6. AI 상담원

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | /chat/sessions | 상담 세션 시작 | O |
| POST | /chat/sessions/{session_id}/messages | 메시지 전송 → AI 응답(추천 혜택 카드 포함 가능) | O |
| GET | /chat/sessions/{session_id} | 대화 이력 조회 | O |

## 7. 최근 본 공고

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | /recent-views | 조회 기록 등록(benefit 상세 진입 시 자동 호출) | O |
| GET | /recent-views | 최근 본 공고 목록 | O |

## 8. 관리자(선택 — 운영용)

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | /admin/benefits | 혜택 공고 등록 | 관리자 |
| PATCH | /admin/benefits/{id} | 혜택 공고 수정 | 관리자 |
| POST | /admin/benefits/{id}/regenerate-summary | AI 요약 재생성 | 관리자 |

## 9. 요청/응답 예시

### GET /benefits/recommended
**Response**
```json
{
  "success": true,
  "data": {
    "benefits": [
      {
        "benefit_id": 101,
        "title": "청년월세지원",
        "reason": "만 29세 이하, 서울 거주 조건 충족",
        "apply_end_date": "2026-10-31"
      }
    ]
  }
}
```

### POST /scraps
**Request**
```json
{ "benefit_id": 101 }
```
**Response (중복불가 그룹 충돌 시)**
```json
{
  "success": true,
  "data": {
    "scrap_created": true,
    "conflict": {
      "group_name": "청년 자산형성 상품군",
      "conflicting_benefit_id": 205,
      "ai_recommendation": "소득 조건상 청년도약계좌가 더 유리합니다."
    }
  }
}
```


