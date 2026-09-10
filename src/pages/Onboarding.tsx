import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserProfile } from '../types/user';

const initialForm: UserProfile = {
  nickname: '',
  name: '',
  age: 20,
  region: '',
  addressDetail: '',
  incomeLevel: '',
  educationStatus: '',
  school: '',
  major: '',
  employmentStatus: '',
  specialty: '',
  note: '',
};

export function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [form, setForm] = useState<UserProfile>(initialForm);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSave = form.nickname.trim() !== '' && form.name.trim() !== '' && form.region.trim() !== '';

  const handleSave = () => {
    completeOnboarding(form);
    navigate('/');
  };

  const handleSkip = () => setShowSkipConfirm(true);
  const confirmSkip = () => {
    completeOnboarding({ ...form, nickname: form.nickname || '오피키 회원' });
    navigate('/');
  };

  return (
    <div className="px-6 pt-6 pb-28 flex flex-col gap-6 relative">
      <h1 className="text-xl font-bold text-[var(--color-navy)]">프로필</h1>

      <Field label="닉네임" required>
        <input
          className="input"
          placeholder="어떻게 불러드리면 될까요?"
          value={form.nickname}
          onChange={(e) => update('nickname', e.target.value)}
        />
      </Field>

      <div>
        <p className="text-sm font-bold text-[var(--color-navy)] mb-3">기본 정보</p>
        <div className="flex flex-col gap-4">
          <Field label="성명" required>
            <input
              className="input"
              placeholder="성명을 입력해 주세요."
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="나이" required>
              <input
                type="number"
                className="input"
                value={form.age}
                onChange={(e) => update('age', Number(e.target.value))}
              />
            </Field>
            <Field label="거주지" required>
              <input
                className="input"
                placeholder="예: 안양시"
                value={form.region}
                onChange={(e) => update('region', e.target.value)}
              />
            </Field>
          </div>
          <Field label="상세 주소">
            <input
              className="input"
              placeholder="주소를 입력해 주세요."
              value={form.addressDetail}
              onChange={(e) => update('addressDetail', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-[var(--color-navy)] mb-3">상황 정보</p>
        <div className="flex flex-col gap-4">
          <Field label="소득 분위">
            <input
              className="input"
              placeholder="예: 9분위"
              value={form.incomeLevel}
              onChange={(e) => update('incomeLevel', e.target.value)}
            />
          </Field>
          <Field label="학력" required>
            <input
              className="input"
              placeholder="예: 대학교 재학"
              value={form.educationStatus}
              onChange={(e) => update('educationStatus', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="학교">
              <input
                className="input"
                placeholder="재학중인 경우"
                value={form.school}
                onChange={(e) => update('school', e.target.value)}
              />
            </Field>
            <Field label="전공">
              <input
                className="input"
                placeholder="학과"
                value={form.major}
                onChange={(e) => update('major', e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="취업 여부" required>
              <input
                className="input"
                placeholder="예: 미취업"
                value={form.employmentStatus}
                onChange={(e) => update('employmentStatus', e.target.value)}
              />
            </Field>
            <Field label="특화 분야">
              <input
                className="input"
                placeholder="선택"
                value={form.specialty}
                onChange={(e) => update('specialty', e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[var(--color-border)] px-6 py-3 flex flex-col gap-2">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-white font-bold disabled:opacity-40"
        >
          저장 하기
        </button>
        <button onClick={handleSkip} className="text-center text-xs text-[var(--color-muted)]">
          다음에 입력할게요
        </button>
      </div>

      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center">
            <p className="font-bold text-[var(--color-navy)] leading-snug">
              선택 정보를 입력하지 않고
              <br />
              건너뛰시겠습니까?
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-2">더 향상 된 추천을 받을 수 있습니다!</p>
            <div className="flex border-t border-[var(--color-border)] mt-5 -mx-6">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 py-3 text-[var(--color-muted)] border-r border-[var(--color-border)]"
              >
                아니요
              </button>
              <button onClick={confirmSkip} className="flex-1 py-3 text-[var(--color-primary)] font-semibold">
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[var(--color-navy)]">
        {label}
        {required && <span className="text-[var(--color-accent)]">*</span>}
      </span>
      {children}
    </label>
  );
}
