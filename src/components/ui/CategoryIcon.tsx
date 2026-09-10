import { Home, HeartPulse, GraduationCap, Briefcase, Building2 } from 'lucide-react';
import type { BenefitCategory } from '../../types/benefit';

const config: Record<BenefitCategory, { icon: typeof Home; bg: string; color: string }> = {
  생활비: { icon: Home, bg: '#ffe3ec', color: '#ff6b9d' },
  교육: { icon: HeartPulse, bg: '#ffe3e3', color: '#ff6b6b' },
  장학금: { icon: GraduationCap, bg: '#e3f5ec', color: '#2fae76' },
  '취업·창업': { icon: Briefcase, bg: '#e6ecff', color: '#5b8cff' },
  주거: { icon: Building2, bg: '#f0e6ff', color: '#8b5cf6' },
};

export function CategoryIcon({ category, size = 36 }: { category: BenefitCategory; size?: number }) {
  const { icon: Icon, bg, color } = config[category];
  return (
    <span
      style={{ background: bg, width: size, height: size }}
      className="shrink-0 rounded-full flex items-center justify-center"
    >
      <Icon size={size * 0.5} color={color} />
    </span>
  );
}
