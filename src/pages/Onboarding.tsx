import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserProfile } from '../types/user';

const AGE_OPTIONS = Array.from({ length: 27 }, (_, i) => `${14 + i}세`);
const REGION_OPTIONS = ['안양시', '서울특별시', '수원시', '성남시', '인천광역시', '기타'];
const INCOME_OPTIONS = ['1분위', '2분위', '3분위', '4분위', '5분위', '6분위', '7분위', '8분위', '9분위', '10분위', '해당없음'];
const EDUCATION_OPTIONS = ['중학교 재학', '고등학교 재학', '대학교 재학', '대학교 졸업', '대학원 재학/졸업', '기타'];
const MAJOR_OPTIONS = ['공학계열', '인문계열', '자연계열', '사회계열', '예체능계열', '기타'];
const EMPLOYMENT_OPTIONS = ['미취업', '재직중', '창업 준비중', '구직중'];
const SPECIALTY_OPTIONS = ['해당없음', 'IT·개발', '디자인', '마케팅', '금융', '제조', '기타'];

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
      <h1 className="text-xl font-bold text-[var(--color-navy)] text-center">프로필</h1>

      <Field label="닉네임" required>
        <input
          className="input-filled"
          placeholder="어떻게 불러드리면 될까요?"
          value={form.nickname}
          onChange={(e) => update('nickname', e.target.value)}
        />
      </Field>

      <SectionBox title="기본 정보">
        <Field label="성명" required>
          <input
            className="input-filled"
            placeholder="성명을 입력해 주세요."
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="나이" required>
            <SelectField
              value={form.age ? `${form.age}세` : ''}
              onChange={(v) => update('age', Number(v.replace('세', '')))}
              options={AGE_OPTIONS}
            />
          </Field>
          <Field label="거주지" required>
            <SelectField value={form.region} onChange={(v) => update('region', v)} options={REGION_OPTIONS} />
          </Field>
        </div>
        <Field label="상세 주소">
          <div className="relative">
            <input
              className="input-filled pr-10"
              placeholder="주소를 입력해 주세요."
              value={form.addressDetail}
              onChange={(e) => update('addressDetail', e.target.value)}
            />
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          </div>
        </Field>
      </SectionBox>

      <SectionBox title="상황 정보">
        <Field label="소득 분위">
          <SelectField value={form.incomeLevel ?? ''} onChange={(v) => update('incomeLevel', v)} options={INCOME_OPTIONS} />
        </Field>
        <Field label="학력" required>
          <SelectField
            value={form.educationStatus}
            onChange={(v) => update('educationStatus', v)}
            options={EDUCATION_OPTIONS}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="학교">
            <div className="relative">
              <input
                className="input-filled pr-10"
                placeholder="재학중인 경우"
                value={form.school}
                onChange={(e) => update('school', e.target.value)}
              />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            </div>
          </Field>
          <Field label="전공">
            <SelectField value={form.major ?? ''} onChange={(v) => update('major', v)} options={MAJOR_OPTIONS} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="취업 여부" required>
            <SelectField
              value={form.employmentStatus}
              onChange={(v) => update('employmentStatus', v)}
              options={EMPLOYMENT_OPTIONS}
            />
          </Field>
          <Field label="특화 분야">
            <SelectField value={form.specialty ?? ''} onChange={(v) => update('specialty', v)} options={SPECIALTY_OPTIONS} />
          </Field>
        </div>
      </SectionBox>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[var(--color-border)] px-6 py-3 flex flex-col gap-2">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full rounded-full bg-[var(--color-primary)] py-3.5 text-white font-bold disabled:opacity-40"
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

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold text-[var(--color-navy)] mb-3">{title}</p>
      <div className="rounded-2xl border border-[var(--color-border)] p-4 flex flex-col gap-4">{children}</div>
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

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-filled pr-9">
        <option value="" disabled>
          선택해 주세요
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
    </div>
  );
}
