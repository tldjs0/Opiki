interface ComingSoonProps {
  title: string;
  description?: string;
}

// TODO: 각 단계별 작업에서 실제 화면으로 교체 예정 (docs/handover 참고)
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-24 text-center">
      <p className="font-bold text-lg text-[var(--color-navy)]">{title}</p>
      <p className="text-sm text-[var(--color-muted)]">
        {description ?? '다음 단계 작업에서 구현될 화면입니다.'}
      </p>
    </div>
  );
}
