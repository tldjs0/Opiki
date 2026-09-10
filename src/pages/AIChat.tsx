import { useState } from 'react';
import { Send } from 'lucide-react';
import { mockBenefits } from '../mocks/benefits';
import { BenefitCard } from '../components/ui/BenefitCard';
import { SubPageHeader } from '../components/layout/SubPageHeader';
import type { Benefit } from '../types/benefit';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  benefit?: Benefit;
}

// TODO(백엔드 연동 시 교체): 실제로는 GPT 기반 API(docs/planning/04_API_명세서.md의
// POST /chat/sessions/{id}/messages)를 호출해야 합니다. 지금은 키워드 매칭 기반 목업입니다.
function getMockReply(userText: string): { text: string; benefit?: Benefit } {
  const text = userText.toLowerCase();
  if (text.includes('교통') || text.includes('버스') || text.includes('지하철')) {
    const benefit = mockBenefits.find((b) => b.id === 'b-001')!;
    return { text: '대중교통을 자주 이용하시는군요! 이 혜택이 딱 맞을 것 같아요.', benefit };
  }
  if (text.includes('저축') || text.includes('적금') || text.includes('돈')) {
    const benefit = mockBenefits.find((b) => b.id === 'b-006')!;
    return { text: '자산 형성에 관심이 있으시다면 이 혜택을 확인해보세요.', benefit };
  }
  if (text.includes('학자금') || text.includes('장학') || text.includes('학교')) {
    const benefit = mockBenefits.find((b) => b.id === 'b-003')!;
    return { text: '학업 중이시라면 이 장학금이 도움이 될 거예요.', benefit };
  }
  if (text.includes('취업') || text.includes('일자리') || text.includes('직장')) {
    const benefit = mockBenefits.find((b) => b.id === 'b-004')!;
    return { text: '취업을 준비 중이시라면 이 혜택을 참고해보세요.', benefit };
  }
  return {
    text: '조금 더 자세히 말씀해 주시면 상황에 맞는 혜택을 찾아드릴게요. 예) "대중교통 많이 타요", "저축하고 싶어요", "취업 준비 중이에요"',
  };
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '안녕하세요! 요즘 관심사나 상황을 알려주시면 맞는 혜택을 찾아드릴게요 😊',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    const reply = getMockReply(trimmed);
    const botMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: reply.text,
      benefit: reply.benefit,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <SubPageHeader title="AI 상담원" />

      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-3 pb-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user'
                  ? 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                  : 'bg-[var(--color-bg)] text-[var(--color-navy)] rounded-tl-sm'
              }`}
            >
              {m.text}
            </div>
            {m.benefit && (
              <div className="w-full max-w-[85%]">
                <BenefitCard benefit={m.benefit} showScrapButton={false} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="예: 대중교통 자주 이용해요"
          className="input flex-1"
        />
        <button
          onClick={handleSend}
          aria-label="전송"
          className="h-11 w-11 shrink-0 rounded-full bg-[var(--color-primary)] flex items-center justify-center"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
