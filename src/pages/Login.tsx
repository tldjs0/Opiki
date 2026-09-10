import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// 데모 목적: 실제 인증 서버가 없으므로 입력값 검증 없이
// "로그인" 클릭 시 목업 프로필로 로그인 처리합니다.
export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="px-6 pt-6 pb-10 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-[var(--color-navy)]">로그인</h1>

      <div className="flex flex-col gap-4">
        <Field label="아이디" required>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디 혹은 이메일을 입력해 주세요."
            className="input"
          />
        </Field>
        <Field label="비밀번호" required>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요."
            className="input"
          />
        </Field>
      </div>

      <p className="text-sm text-center text-[var(--color-muted)]">
        아직 오피키 회원이 아니신가요?{' '}
        <button onClick={() => navigate('/onboarding')} className="text-[var(--color-primary)] font-semibold">
          회원가입 하기
        </button>
      </p>

      <button
        onClick={handleLogin}
        className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-white font-bold"
      >
        로그인
      </button>

      <div className="flex items-center justify-center gap-5 pt-2">
        <SocialButton label="네이버로 로그인" bg="#03C75A" onClick={handleLogin}>
          N
        </SocialButton>
        <SocialButton label="구글로 로그인" bg="#ffffff" border onClick={handleLogin}>
          <GoogleG />
        </SocialButton>
        <SocialButton label="전화번호로 로그인" bg="#f2f4f8" border onClick={handleLogin}>
          <PhoneIcon />
        </SocialButton>
      </div>
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

function SocialButton({
  label,
  bg,
  border,
  onClick,
  children,
}: {
  label: string;
  bg: string;
  border?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ background: bg }}
      className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-bold ${
        border ? 'border border-[var(--color-border)]' : ''
      }`}
    >
      {children}
    </button>
  );
}

function GoogleG() {
  return <span className="text-[15px] font-bold text-[var(--color-navy)]">G</span>;
}
function PhoneIcon() {
  return <span className="text-[15px] text-[var(--color-navy)]">☎</span>;
}
