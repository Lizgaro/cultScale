import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Rocket,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  MessageSquare,
  Zap,
  Lock,
  Send,
  Play,
  ChevronDown
} from 'lucide-react';
import { RoleFeature, ComparisonItem, ProcessStep, ChatMessage, FormData, RoleComparisonData } from './types';

// --- Reusable Components ---

const ROLE_COMPARISON_DATA: RoleComparisonData[] = [
  {
    roleId: 'founder',
    roleName: 'Фаундер',
    kultPath: {
      stages: [
        { title: "Челлендж", description: "За 7 дней упаковываете проект: оффер, презентация, подкаст. Готовы к привлечению партнёров.", result: "Упаковка готова", time: "7 дней" },
        { title: "Матчинг", description: "Выходите на маркетологов и ЛМ, готовых работать за % от прибыли. Без фикса и предоплат.", result: "Партнёр найден", time: "24 часа" },
        { title: "Трекшн", description: "Первые продажи через базу партнёров и их аудиторию. Без слива рекламных бюджетов.", result: "Первая выручка", time: "2 недели" },
        { title: "Масштаб", description: "Масштабируете за недели, а не годы. Команда растёт вместе с бизнесом.", result: "Profit Share", time: "1 месяц" }
      ],

      totalTime: "6 недель",
      summary: "Рост без инвестиций — только за результат"
    },
    tradPath: {
      stages: [
        { title: "Поиск", description: "Бесконечные встречи с фрилансерами и агентствами. Никто не хочет работать за %.", result: "Нет партнёра", time: "2-3 мес" },
        { title: "Найм", description: "Собираете штат: ФОТ, налоги, онбординг. Деньги тают до первой продажи.", result: "ФОТ −300к/мес", time: "1 месяц" },
        { title: "Разработка", description: "Долгострой, баги, смена подрядчиков. MVP откладывается снова и снова.", result: "Долгострой", time: "4-6 мес" },
        { title: "Маркетинг", description: "Сливаете бюджет на рекламу. Агентства берут предоплату, результата нет.", result: "Слив бюджета", time: "∞" }
      ],
      totalTime: "8+ месяцев",
      summary: "Закрытие стартапа через полгода"
    }
  },
  {
    roleId: 'marketer',
    roleName: 'Маркетолог',
    kultPath: {
      stages: [
        { title: "Челлендж", description: "Проходите 7-дневный челлендж — получаете доступ к базе проектов под ваши скилы.", result: "Доступ к базе", time: "7 дней" },
        { title: "Пилот", description: "Заходите в первый проект за % от прибыли. 100 часов = 100-500к дохода.", result: "100-500к", time: "1 месяц" },
        { title: "Партнёрство", description: "Получаете долю в бизнесе. Ваш доход растёт вместе с проектом.", result: "300к-1,2 млн", time: "3 месяца" },
        { title: "Скейл", description: "Берёте несколько проектов параллельно. Строите своё агентство на Profit Share.", result: "1,8-7,2 млн/год", time: "12 месяцев" }
      ],
      totalTime: "От 7 дней до скейла",
      summary: "От 100к до 2+ млн/мес на Profit Share"
    },
    tradPath: {
      stages: [
        { title: "Найм", description: "Работа за оклад. Клянчите бюджеты вместо тестов гипотез.", result: "~100к/мес", time: "1 год" },
        { title: "Рост", description: "Потолок 5%/мес. Низкая мотивация без доли в прибыли.", result: "~200к/мес", time: "2 года" },
        { title: "Стагнация", description: "Стагнация и выгорание. Компания не делится прибылью.", result: "~300к/мес", time: "3 года" },
        { title: "Выгорание", description: "Увольнение или смена места. Всё по кругу.", result: "Потеря", time: "∞" }
      ],
      totalTime: "3+ года до потолка",
      summary: "Потолок ~300к и выгорание"
    }
  },
  {
    roleId: 'influencer',
    roleName: 'Лидер Мнений',
    kultPath: {
      stages: [
        { title: "Контент-завод", description: "Запускаете системный контент с продюсером. 160к охвата за первый месяц.", result: "160к охвата", time: "1 месяц" },
        { title: "Партнёр", description: "Получаете долгосрочные партнёрства вместо разовых интеграций. Эфиры + посты.", result: "400к пилот", time: "2 месяца" },
        { title: "Амбассадор", description: "Ваши охваты и доход растут x3 каждый квартал через продюсирование.", result: "1,2 млн/мес", time: "квартал" },
        { title: "Совладелец", description: "Входите в долю новых проектов. Играете вдолгую на миллионы $.", result: "Капитализация", time: "долгосрок" }
      ],
      totalTime: "От 1 мес до совладельца",
      summary: "От 100к охвата до 5 млн руб и долей на млн $"
    },
    tradPath: {
      stages: [
        { title: "Ожидание", description: "Пассивное ожидание заявок. Рекламодатели приходят редко.", result: "Тишина", time: "?" },
        { title: "Согласование", description: "Жёсткое ТЗ от заказчика. Креатив сковывают рамками.", result: "Рамки", time: "3 дня" },
        { title: "Публикация", description: "Разовая интеграция за копейки. Рекламодатели не возвращаются.", result: "Разовая оплата", time: "1 день" },
        { title: "Нестабильность", description: "Снова поиск. Нет системы, нет предсказуемого дохода.", result: "Бартер", time: "∞" }
      ],
      totalTime: "Разово",
      summary: "Работа за бартер и нестабильность"
    }
  }
];


const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    }, { threshold: 0.1 });

    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const BusinessBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-bg-shift opacity-30"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-bg-shift opacity-20" style={{ animationDelay: '-5s' }}></div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered = false }) => (
  <div className={`mb-16 md:mb-24 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
    <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-white mb-8 leading-none tracking-tighter">
      {title}
    </h2>
    {subtitle && (
      <div className="w-20 h-1.5 bg-accent mb-8 rounded-full"></div>
    )}
    {subtitle && (
      <p className="text-lg md:text-xl text-kult-muted max-w-3xl font-light leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

const Marquee: React.FC<{ text: string; reverse?: boolean }> = ({ text, reverse = false }) => {
  const animationStyle = {
    display: 'flex',
    whiteSpace: 'nowrap' as const,
    animation: 'marquee-scroll 30s linear infinite',
    animationDirection: reverse ? 'reverse' : 'normal',
  };

  return (
    <div className="w-full overflow-hidden bg-kult-text text-kult-black py-3 select-none relative z-20">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={animationStyle}>
        {[...Array(20)].map((_, i) => (
          <span key={i} className="mx-8 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-4 flex-shrink-0">
            {text} <Zap size={14} className="fill-current" />
          </span>
        ))}
      </div>
    </div>
  );
};

const ChatSimulation: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const script: ChatMessage[] = [
    { sender: 'Founder', text: 'Продукт готов. Метрики >30%. Нужен масштаб.', time: '10:42' },
    { sender: 'System', text: 'Поиск партнера...', time: '10:42' },
    { sender: 'System', text: 'Матч: Продюсер (Tier-1)', time: '10:43' },
    { sender: 'Producer', text: 'Вижу цифры. Делаем 60/40. Запуск в понедельник.', time: '10:45' },
    { sender: 'System', text: 'Сделка подтверждена. Profit Share активен.', time: '10:45' },
  ];

  useEffect(() => {
    let timeoutIds: number[] = [];
    const runScript = () => {
      setMessages([]);
      script.forEach((msg, index) => {
        const id = window.setTimeout(() => {
          setMessages(prev => [...prev, msg]);
        }, index * 1500 + 500);
        timeoutIds.push(id);
      });
    };

    runScript();
    const intervalId = window.setInterval(runScript, 10000);

    return () => {
      timeoutIds.forEach(clearTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 w-full max-w-md mx-auto border-l-4 border-l-white/20">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono text-kult-muted uppercase tracking-wider">Live Deal Flow</span>
        </div>
        <Lock size={14} className="text-kult-muted" />
      </div>
      <div className="space-y-4 h-[320px] overflow-hidden relative">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col animate-float ${msg.sender === 'System' ? 'items-center' :
              msg.sender === 'Founder' ? 'items-end' : 'items-start'
              }`}
          >
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'System' ? 'bg-white/5 text-kult-muted text-xs border border-white/5' :
              msg.sender === 'Founder' ? 'bg-white text-black' :
                'bg-kult-gray border border-white/20 text-white'
              }`}>
              {msg.sender !== 'System' && <div className="text-[10px] opacity-50 mb-1 font-bold uppercase">{msg.sender}</div>}
              {msg.text}
            </div>
          </div>
        ))}
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-kult-black/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

// Updated Modal Component (T4: Removed checkbox friction)
const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleGoToBot = () => {
    window.location.href = "https://t.me/CultScale_bot";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-kult-dark border border-white/10 p-10 md:p-14 overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)]">
        <button onClick={onClose} className="absolute top-6 right-6 text-kult-muted hover:text-white transition-colors">
          <X size={28} />
        </button>

        <div className="animate-float">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,0,0.3)] rotate-3">
            <Zap size={40} className="text-black fill-current" />
          </div>

          <h3 className="text-3xl font-serif font-bold text-white mb-4 text-center tracking-tight">Начни свой 7-дневный Челлендж</h3>

          {/* T3: Urgency element */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 text-center">
            <p className="text-red-400 text-sm font-bold uppercase tracking-wider">🔥 Осталось 7 мест в этом потоке</p>
          </div>

          <p className="text-kult-muted text-base mb-10 text-center leading-relaxed">
            Все операции и матчинг происходят в Telegram-боте. Нажимая кнопку, вы соглашаетесь с <a href="/legal/offer.html" target="_blank" className="text-accent underline">Офертой</a>.
          </p>

          <button
            onClick={handleGoToBot}
            className="w-full py-5 bg-accent text-black font-extrabold uppercase tracking-[0.2em] hover:bg-[#00e600] active:scale-[0.98] transition-all flex items-center justify-center gap-3 rounded-2xl text-sm shadow-[0_10px_30px_rgba(0,255,0,0.2)]"
          >
            Войти в Челлендж <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow: React.FC<{ title: string; traditional: string; kult: string }> = ({ title, traditional, kult }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors group">
    <div className="p-6 md:p-8 flex items-center border-r border-white/10 md:border-r-0 md:border-b-0">
      <h4 className="text-xl font-serif text-white">{title}</h4>
    </div>
    <div className="p-6 md:p-8 flex items-center border-r border-white/10 md:border-r-0 border-b md:border-b-0 border-white/10 text-kult-muted opacity-60 group-hover:opacity-100 transition-opacity">
      <XCircle size={20} className="text-red-500 mr-3 flex-shrink-0" />
      <span className="text-sm">{traditional}</span>
    </div>
    <div className="p-6 md:p-8 flex items-center bg-white/5 md:bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <CheckCircle2 size={20} className="text-green-500 mr-3 flex-shrink-0 relative z-10" />
      <span className="text-sm text-white font-medium relative z-10">{kult}</span>
    </div>
  </div>
);

// --- New Split Screen Comparison Component ---

const SplitScreenComparison: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'founder' | 'marketer' | 'influencer'>('founder');
  const [isVisible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Accordion states
  const [leftOpenIndex, setLeftOpenIndex] = useState<number | null>(null);
  const [rightOpenIndex, setRightOpenIndex] = useState<number | null>(null);

  // Reset accordion when role changes
  useEffect(() => {
    setLeftOpenIndex(null);
    setRightOpenIndex(null);
  }, [activeRole]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setVisible(true);
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const data = ROLE_COMPARISON_DATA.find(r => r.roleId === activeRole);

  if (!data) return null;

  const toggleLeft = (idx: number) => setLeftOpenIndex(leftOpenIndex === idx ? null : idx);
  const toggleRight = (idx: number) => setRightOpenIndex(rightOpenIndex === idx ? null : idx);

  return (
    <section id="split-comparison" ref={sectionRef} className="py-32 px-6 bg-transparent relative overflow-hidden z-30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="ТВОЙ ПУТЬ РОСТА" subtitle="Выбери свою роль и посмотри разницу между традиционным путём и Культурой Маркетинга." centered />

        {/* Usage Instruction */}
        <div className="text-center mb-10 -mt-12 relative z-20">
          <p className="inline-block py-2 px-4 rounded-full bg-white/5 border border-white/10 text-kult-muted text-xs md:text-sm font-mono tracking-wide">
            1) Выбери роль → 2) Выбери путь → 3) Нажми на этап
          </p>
        </div>

        {/* Role Selectors */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-20">
          {ROLE_COMPARISON_DATA.map((role) => (
            <button
              key={role.roleId}
              onClick={() => setActiveRole(role.roleId as any)}
              className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${activeRole === role.roleId
                ? 'bg-green-500/10 border-green-500 text-white shadow-[0_0_20px_rgba(0,255,0,0.2)] scale-105'
                : 'bg-transparent border-white/20 text-kult-muted hover:border-white hover:text-white'
                }`}
            >
              {role.roleName}
            </button>
          ))}
        </div>

        {/* Split Screen Layout */}
        <div className={`grid md:grid-cols-2 gap-8 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

          {/* Left Column: With Marketing Culture */}
          <div className="relative border-l-4 border-accent bg-white/5 p-8 md:p-12 rounded-2xl group/card transition-all hover:bg-white/[0.08] perspective-1000">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 to-transparent"></div>
            <h3 className="text-3xl font-serif text-white mb-10 flex items-center gap-4">
              <Zap className="text-accent fill-current scale-125" /> С Культурой Маркетинга
            </h3>

            <div className="space-y-4">
              {data.kultPath.stages.map((stage, idx) => {
                const isOpen = leftOpenIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`relative pl-8 border-l border-green-500/30 transition-all duration-300 cursor-pointer group ${isOpen ? 'pb-6' : 'pb-2'}`}
                    onClick={() => toggleLeft(idx)}
                  >
                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_#00ff00] transition-transform ${isOpen ? 'scale-125' : ''}`}></div>

                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-bold transition-colors ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{stage.title}</h4>
                      <ChevronDown size={20} className={`text-green-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-sm text-kult-muted mb-3">{stage.description}</p>
                        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
                          <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Результат: {stage.result}</span>
                          <span className="text-white font-bold text-sm">{stage.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center">
              <div className="text-kult-muted text-xs uppercase tracking-widest mb-2">Итого</div>
              <div className="text-3xl font-bold text-green-500">{data.kultPath.totalTime}</div>
              <p className="text-sm text-green-400/80 mt-2">{data.kultPath.summary}</p>
            </div>
          </div>

          {/* Right Column: Independently */}
          <div className="relative border-l-4 border-gray-600 bg-white/5 p-8 rounded-r-xl opacity-80 hover:opacity-100 transition-opacity">
            <h3 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
              <Lock className="text-gray-500" /> Самостоятельно
            </h3>

            <div className="space-y-4">
              {data.tradPath.stages.map((stage, idx) => {
                const isOpen = rightOpenIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`relative pl-8 border-l border-gray-600/30 transition-all duration-300 cursor-pointer group ${isOpen ? 'pb-6' : 'pb-2'}`}
                    onClick={() => toggleRight(idx)}
                  >
                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 bg-gray-600 rounded-full transition-transform ${isOpen ? 'scale-125' : ''}`}></div>

                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-bold transition-colors ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{stage.title}</h4>
                      <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-sm text-kult-muted mb-3">{stage.description}</p>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Результат: {stage.result}</span>
                          <span className="text-gray-300 font-bold text-sm">{stage.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center">
              <div className="text-kult-muted text-xs uppercase tracking-widest mb-2">Итого</div>
              <div className="text-3xl font-bold text-gray-400">{data.tradPath.totalTime}</div>
              <p className="text-sm text-gray-500 mt-2">{data.tradPath.summary}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- New Components for Catalog & Trust ---

const BlueOceanSection: React.FC = () => (
  <section className="py-24 px-6 bg-gradient-to-b from-kult-black to-kult-dark relative z-30 border-t border-white/5">
    <div className="max-w-5xl mx-auto">
      <SectionHeader
        title="Партнёрская модель роста: маркетинг без бюджета — только за результат."
        subtitle="Мы не предлагаем вам «ещё один сервис». Мы даём систему, где фаундер, маркетолог и лидер мнений объединяются ради захвата рынка с оплатой за результат."
        centered
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="p-6 bg-white/5 border-l-4 border-green-500 rounded-r-xl">
            <h4 className="text-xl font-bold text-white mb-3">Логика (принцип "So That")</h4>
            <p className="text-kult-muted leading-relaxed">
              Маркетолог заходит в проект как со-владелец результата... <strong>так что</strong> он готов работать за долю в прибыли, потому что вы даёте ему упакованный фундамент, а не кота в мешке.
            </p>
          </div>

          <div className="p-6 bg-white/5 border-l-4 border-white/20 rounded-r-xl">
            <h4 className="text-xl font-bold text-white mb-3">Результат</h4>
            <p className="text-kult-muted leading-relaxed">
              Вы вкладываете X — получаете Y. Юнит-экономика становится предсказуемой, а рост доходов опережает рост расходов.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-green-500/20 blur-3xl rounded-full"></div>
          <div className="relative bg-kult-gray border border-white/10 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl">1</div>
              <div className="h-px flex-1 bg-white/20"></div>
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/20 font-bold text-xl">2</div>
              <div className="h-px flex-1 bg-white/20"></div>
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/20 font-bold text-xl">3</div>
            </div>
            <h5 className="text-white font-bold mb-2">Захват рынка</h5>
            <p className="text-sm text-kult-muted">Объединение ресурсов фаундера, экспертизы маркетолога и охватов лидера мнений.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TurnkeySection: React.FC = () => (
  <section className="py-24 px-6 bg-kult-black relative z-30 border-t border-white/5">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-sm p-8 md:p-12 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <h3 className="text-2xl md:text-3xl font-serif text-white mb-8 leading-tight">
          Мы можем подобрать тебе маркетолога с опытом от 3 лет и выстроить всю систему партнерского маркетинга под ключ.
        </h3>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">📌 Что входит:</h4>
            <ul className="space-y-4 text-kult-muted">
              <li className="flex items-start gap-3"><span className="text-green-500">→</span> Подбор маркетолога и ЛМ под твой проект</li>
              <li className="flex items-start gap-3"><span className="text-green-500">→</span> Упаковка оффера и воронок</li>
              <li className="flex items-start gap-3"><span className="text-green-500">→</span> Запуск гипотез за 3-4 месяца</li>
              <li className="flex items-start gap-3"><span className="text-green-500">→</span> Сопровождение до первых продаж</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Материалы и примеры работ:</h4>
            <div className="space-y-4">
              <a href="https://scale-x.ru/b" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-green-400 transition-colors group/link flex items-center gap-2">
                <span className="text-green-500 group-hover/link:translate-x-1 transition-transform">→</span>
                <span className="underline decoration-white/30 underline-offset-4 group-hover/link:decoration-green-400">Лендинг: scale-x.ru/b</span>
              </a>
              <a href="https://www.youtube.com/playlist?list=PLjRb9QSd9LLRDlsB37KhUJm4rpH7OfrKl" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-green-400 transition-colors group/link flex items-center gap-2">
                <span className="text-green-500 group-hover/link:translate-x-1 transition-transform">→</span>
                <span className="underline decoration-white/30 underline-offset-4 group-hover/link:decoration-green-400">Плейлист с кейсами</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-white text-lg">
            Готов обсудить детали? Запишись на встречу с <a href="https://t.me/kostya_fun" target="_blank" rel="noopener noreferrer" className="text-green-500 font-bold hover:text-green-400 transition-colors">@kostya_fun</a> — он расскажет, как это работает конкретно для твоего проекта.
          </p>
        </div>

      </div>
    </div>
  </section>
);

const ValueStackSection: React.FC = () => (
  <section className="py-24 px-6 bg-kult-dark border-t border-white/5 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_70%)] pointer-events-none"></div>
    <div className="max-w-5xl mx-auto relative z-10">
      <SectionHeader
        title="Заберите инструменты, на которых были построены империи на сотни миллионов."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* ГЛАВНЫЙ = Челлендж */}
        <div className="p-6 bg-gradient-to-br from-accent/10 to-green-500/5 border-2 border-accent/50 rounded-xl flex flex-col justify-between hover:border-accent transition-all relative overflow-hidden cursor-pointer" onClick={() => window.location.href = 'https://t.me/CultScale_bot'}>
          <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-black text-[10px] font-black uppercase rounded">⭐ ГЛАВНОЕ</div>
          <div>
            <div className="text-accent font-bold mb-2">БАЗОВОЕ</div>
            <h4 className="text-lg font-bold text-white mb-4">7-дневный челлендж по упаковке проекта</h4>
          </div>
          <div className="text-white font-bold">БЕСПЛАТНО</div>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-xl group hover:border-green-500/30 transition-all">
          <div className="text-kult-muted text-xs uppercase mb-2">Бонус №1</div>
          <h4 className="text-lg font-bold text-white mb-4">PDF «Формула Илона Маска»</h4>
          <p className="text-xs text-kult-muted mb-4">Как Маск создал PayPal с партнёрами и реинвестировал $180 млн. Применим в B2B.</p>
          <div className="text-green-500 text-xs font-bold mt-auto flex items-center gap-2">ВНУТРИ БОТА <Send size={12} /></div>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-xl group hover:border-green-500/30 transition-all">
          <div className="text-kult-muted text-xs uppercase mb-2">Бонус №2</div>
          <h4 className="text-lg font-bold text-white mb-4">Кейс «700 млн на командах»</h4>
          <p className="text-xs text-kult-muted mb-4">Реальный опыт построения автономных отделов маркетинга, работающих за %.</p>
          <div className="text-green-500 text-xs font-bold mt-auto flex items-center gap-2">ВНУТРИ БОТА <Send size={12} /></div>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-xl group hover:border-green-500/30 transition-all">
          <div className="text-kult-muted text-xs uppercase mb-2">Бонус №3</div>
          <h4 className="text-lg font-bold text-white mb-4">Разбор воронки Брансона</h4>
          <p className="text-xs text-kult-muted mb-4">Структура на $265M+, которая захватывает рынки и превращает внимание в прибыль.</p>
          <div className="text-green-500 text-xs font-bold mt-auto flex items-center gap-2">ВНУТРИ БОТА <Send size={12} /></div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-white/10 border border-accent/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-kult-muted uppercase mb-1">Итого</div>
          <div className="text-xl md:text-2xl font-serif font-bold text-white">Ценность ₽1,2 млн</div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-xs font-bold text-kult-muted uppercase mb-1">Ваша цена</div>
          <div className="text-xl md:text-2xl font-serif font-bold text-accent">БЕСПЛАТНО</div>
        </div>
      </div>
    </div>
  </section>
);

const GuaranteeSection: React.FC = () => (
  <section className="py-24 px-6 bg-kult-black relative overflow-hidden text-center">
    <div className="max-w-4xl mx-auto">
      <div className="inline-block px-4 py-2 border border-green-500/30 bg-green-500/5 rounded-full mb-8">
        <span className="text-green-500 text-xs font-bold uppercase tracking-widest">Гарантия (Risk Reversal)</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">
        Ваш единственный риск — потратить 7 часов (по 1 часу в день).
      </h2>
      <div className="grid md:grid-cols-2 gap-12 text-left mt-16">
        <div className="space-y-6">
          <p className="text-kult-muted text-lg leading-relaxed">
            Даже если вы не найдёте партнёра за 7 дней, у вас останется:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 className="text-green-500 flex-shrink-0" />
              <span>Упакованный оффер мирового уровня</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 className="text-green-500 flex-shrink-0" />
              <span>Презентация и скринкаст</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 className="text-green-500 flex-shrink-0" />
              <span>Записанный подкаст для прогрева аудитории</span>
            </li>
          </ul>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-kult-muted leading-relaxed mb-6 italic">
            "Консалтинговые агентства берут за такую упаковку ₽500,000–₽2 млн. Вы получаете это бесплатно — просто пройдите 7 дней."
          </p>
          <div className="h-px bg-white/10 w-full mb-6"></div>
          <p className="text-white font-bold">
            Вы ничего не теряете, но можете приобрести актив на сотни миллионов.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// T12: FAQ Section to reduce objections
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Это бесплатно? В чём подвох?",
      a: "Да, 7-дневный челлендж полностью бесплатный. Мы зарабатываем на услуге «под ключ» для тех, кто хочет делегировать весь процесс."
    },
    {
      q: "Сколько времени занимает?",
      a: "1 час в день в течение 7 дней."
    },
    {
      q: "Что если у меня нет продукта?",
      a: "Челлендж подходит для проектов на стадии MVP и выше. Если у вас есть идея — начните с неё."
    },
    {
      q: "Какие гарантии?",
      a: "Даже если партнёра не найдёте, у вас останутся: упакованный оффер, презентация и записанный подкаст стоимостью ₽500к–₽2 млн."
    }
  ];

  return (
    <section className="py-24 px-6 bg-kult-dark border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <SectionHeader title="Частые вопросы" centered />

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="text-white font-bold">{faq.q}</span>
                <ChevronDown
                  className={`text-accent flex-shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                  size={20}
                />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openIndex === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-kult-muted leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection: React.FC = () => (

  <section id="trust" className="py-24 px-6 bg-kult-dark relative overflow-hidden">
    {/* Background decoration to replace image visual weight */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">
        ДОВЕРИЕ В ЦИФРАХ
      </h2>
      <p className="text-kult-muted text-lg mb-16 max-w-2xl mx-auto">
        Мы не продаем курсы. Мы строим бизнесы. Результаты наших партнеров говорят громче любых обещаний.
      </p>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
          <div className="text-4xl font-bold text-white mb-2">+206 млн ₽</div>
          <div className="text-xs text-kult-muted uppercase tracking-wider mb-2">Парфюм в Telegram</div>
          <div className="text-[10px] text-white/50">С 30к бюджета на старте за год в новом канале трафика с командой маркетологов в партнерстве</div>
        </div>

        <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
          <div className="text-4xl font-bold text-white mb-2">+200 млн ₽</div>
          <div className="text-xs text-kult-muted uppercase tracking-wider mb-2">EdTech Кейс</div>
          <div className="text-[10px] text-white/50">С бюджета 240к на старте за год в новом канале трафика с командой маркетологов в партнерстве</div>
        </div>

        <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
          <div className="text-4xl font-bold text-white mb-2">700 млн ₽</div>
          <div className="text-xs text-kult-muted uppercase tracking-wider mb-2">Общая выручка</div>
          <div className="text-[10px] text-white/50">Портфель партнерств</div>
        </div>
      </div>

      <a
        href="https://youtu.be/tynzX-wg8QI?si=jAtil9a5mukGQtuR"
        target="_blank"
        className="mt-12 inline-flex items-center gap-3 text-white border border-white/20 px-8 py-4 rounded hover:bg-white hover:text-black transition-all group"
      >
        <Play size={18} className="fill-current" /> Смотреть разбор кейсов
      </a>
    </div>
  </section>
);

const GrowthTrackSection: React.FC = () => (
  <section className="py-24 px-6 bg-kult-black">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="СРАВНЕНИЕ МОДЕЛЕЙ" subtitle="Почему старая модель найма больше не эффективна в 2025 году" centered />

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <div className="hidden md:grid grid-cols-3 bg-white/10 border-b border-white/10">
          <div className="p-6 font-bold text-xs uppercase tracking-widest text-white">Критерий</div>
          <div className="p-6 font-bold text-xs uppercase tracking-widest text-kult-muted">Обычный найм / Фриланс</div>
          <div className="p-6 font-bold text-xs uppercase tracking-widest text-white">Модель Cult Assembly</div>
        </div>

        <ComparisonRow
          title="Мотивация"
          traditional="Работа за оклад. Главная цель — отсидеть часы или сдать задачу."
          kult="Работа за долю. Главная цель — рост прибыли."
        />
        <ComparisonRow
          title="Стоимость"
          traditional="Высокий оклад + налоги + поиск + онбординг."
          kult="0₽ на старте. Оплата только с фактической прибыли."
        />
        <ComparisonRow
          title="Риски"
          traditional="Если гипотеза не сработала — вы потеряли бюджет."
          kult="Риски делятся на всех. Нет прибыли — нет расходов."
        />
        <ComparisonRow
          title="Скорость"
          traditional="Долгий найм, собеседования, тестовые задания."
          kult="Готовая команда заходит в проект за 7 дней."
        />
        <ComparisonRow
          title="Качество"
          traditional="Сложно проверить компетенции до начала работы."
          kult="Только проверенные партнеры, прошедшие Челлендж."
        />
      </div>
    </div>
  </section>
);

// --- Content Data ---

const ROLES: RoleFeature[] = [
  {
    icon: Rocket,
    title: "Фаундер",
    points: [
      "За 7 дней — упакованный оффер для привлечения партнёров",
      "Маркетолог за % от прибыли, а не за фикс",
      "ЛМ для охватов без рекламного бюджета",
      "Экосистема партнёров для системного роста"
    ]
  },
  {
    icon: BarChart3,
    title: "Маркетолог",
    points: [
      "За 7 дней — доступ к базе проектов под твои скилы",
      "Работа за Profit Share: твой доход = результат",
      "Доля в бизнесе вместо потолка оклада",
      "Выбираешь проекты, в которые веришь"
    ]
  },
  {
    icon: Target,
    title: "Лидер мнений",
    points: [
      "За 1 месяц — 160к охвата с продюсером",
      "Долгосрочные партнёрства вместо разовых интеграций",
      "Доля от прибыли вместо бартера",
      "Путь к совладельцу проектов"
    ]
  }
];


const COMPARISONS: ComparisonItem[] = [
  {
    company: "Самолет",
    achievement: "обогнал ПИК",
    method: "без денег на землю"
  },
  {
    company: "Uber",
    achievement: "стал гигантом",
    method: "без покупки машин"
  },
  {
    company: "Airbnb",
    achievement: "доминирует",
    method: "не владея недвижимостью"
  }
];

const STEPS: ProcessStep[] = [
  {
    number: "01-02",
    title: "Смысловая упаковка",
    description: "Выделяем суть продукта в одну фразу, понятную рынку 2026 года."
  },
  {
    number: "03-04",
    title: "Доказательство ценности",
    description: "Создаём презентацию и скринкаст, которые снимают все возражения партнёра за 3 минуты."
  },
  {
    number: "05-06",
    title: "Создание доверия",
    description: "Записываем подкаст — это сырьё для охватов и личного бренда, которое заменяет месяцы прогрева."
  },
  {
    number: "07",
    title: "Фиксация партнёра",
    description: "Выход на рынок с оффером Equity-based, создание рабочего чата и старт работы."
  }
];

// --- Main App Component ---

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const openModal = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen bg-kult-black text-kult-text font-sans selection:bg-white selection:text-black overflow-x-hidden relative">

      <BusinessBackground />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-kult-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-serif font-extrabold tracking-tighter text-white z-50 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-black font-black text-xs rotate-3">KM</span>
            КУЛЬТУРА МАРКЕТИНГА
          </button>


          <div className="hidden md:flex space-x-10 text-xs font-bold tracking-[0.2em] uppercase text-kult-muted">
            <button onClick={() => scrollToSection('concept')} className="hover:text-white transition-colors">КОНЦЕПЦИЯ</button>
            <button onClick={() => scrollToSection('roles')} className="hover:text-white transition-colors">РОЛИ</button>
            <button onClick={() => scrollToSection('process')} className="hover:text-white transition-colors">ЧЕЛЛЕНДЖ</button>
          </div>

          <button
            className="hidden md:block px-6 py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            onClick={openModal}
          >
            Начать Челлендж
          </button>

          <button
            className="md:hidden text-white z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-kult-black z-40 pt-24 px-6 flex flex-col space-y-6">
            <button onClick={() => scrollToSection('concept')} className="text-left text-3xl font-serif text-white uppercase tracking-tighter">КОНЦЕПЦИЯ</button>
            <button onClick={() => scrollToSection('roles')} className="text-left text-3xl font-serif text-white uppercase tracking-tighter">РОЛИ</button>
            <button onClick={() => scrollToSection('process')} className="text-left text-3xl font-serif text-white uppercase tracking-tighter">ЧЕЛЛЕНДЖ</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 px-6 pb-20">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-4xl mx-auto w-full text-center z-10">
          <div className="relative">
            {/* Task E1: Improved readability background */}
            <div className="absolute -inset-10 bg-black/40 blur-3xl -z-10 pointer-events-none rounded-full"></div>

            <FadeInSection>
              {/* T2: Social Proof */}
              <div className="inline-flex items-center gap-3 py-2 px-5 border border-accent/30 bg-accent/5 rounded-full mb-8">
                <span className="text-accent text-sm font-bold">459+</span>
                <span className="text-xs text-kult-muted uppercase tracking-wider">фаундеров уже в системе</span>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              {/* T1: Shortened headline to ~15 words */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-8 tracking-tight">
                Маркетинг-партнёр за <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white italic">% от прибыли</span>,<br />а не за фикс
              </h1>
            </FadeInSection>

            <FadeInSection delay={300}>
              <p className="text-lg md:text-xl text-kult-muted font-light leading-relaxed mb-10 max-w-xl mx-auto">
                Подключите маркетолога за 7 дней. Без предоплат и рисков.
              </p>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                  onClick={openModal}
                  className="w-full sm:w-auto px-10 py-5 bg-accent text-black font-extrabold text-sm tracking-wider hover:bg-[#00cc00] hover:shadow-[0_8px_32px_rgba(0,255,0,0.4)] hover:scale-105 transition-all uppercase flex items-center justify-center gap-3 group border-none rounded-xl"
                >
                  🚀 Начать Челлендж →
                </button>

                {/* T3: Urgency */}
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse">
                  Осталось 7 мест
                </span>
              </div>
            </FadeInSection>
          </div>

        </div>

      </header>

      <Marquee text="КУЛЬТУРА МАРКЕТИНГА • ПАРТНЁРСТВА ВМЕСТО ЗАРПЛАТ • ДОЛЯ ОТ ПРИБЫЛИ ВМЕСТО БЮДЖЕТОВ •" />

      {/* The Problem (Dark Reality) */}
      <section id="concept" className="py-32 px-6 bg-kult-black relative">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-white leading-tight">
              Вот почему ваш бизнес не масштабируется <br />
              <span className="text-kult-muted italic font-serif text-2xl md:text-4xl">(пока бюджеты сгорают дотла):</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl group hover:border-red-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                  <XCircle size={24} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Проблема 1: Атака "хитрых агентств"</h3>
                <p className="text-kult-muted text-sm leading-relaxed">
                  Вас каждый день атакуют обещаниями "горы клиентов" при 100% предоплате. Это лотерея за <span className="text-white font-bold">₽500,000–₽1,5 млн</span>, где весь риск — на вас, а результат — в тумане.
                </p>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl group hover:border-red-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                  <BarChart3 size={24} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Проблема 2: Слив при масштабировании</h3>
                <p className="text-kult-muted text-sm leading-relaxed">
                  Стоимость клика выросла в 3-4 раза за год. При увеличении бюджета CAC растёт быстрее выручки. Реклама стала только для теста, а не для роста.
                </p>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl group hover:border-red-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                  <Lock size={24} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Проблема 3: Внутренний хаос</h3>
                <p className="text-kult-muted text-sm leading-relaxed">
                  Лиды есть — деньги нет. CRM забита мусором, менеджеры путаются в воронке. Вы просто льёте деньги в дырявое ведро.
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>


      {/* The Solution (Roles) */}
      <section id="roles" className="py-32 px-6 bg-transparent relative overflow-hidden">
        {/* Abstract shape */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            title="ТВОЯ РОЛЬ"
            subtitle="Система вин-вин, где каждый участник мотивирован конечным результатом."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-l border-white/10">
            {ROLES.map((role, idx) => (
              <FadeInSection key={idx} delay={idx * 100}>
                <div className="h-full border-r border-b border-white/10 p-10 md:p-12 group hover:bg-white/[0.03] transition-all duration-500 cursor-default relative overflow-hidden perspective-1000 hover:rotate-x-3 hover:rotate-y-3 hover:scale-102">
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-white -rotate-45" />
                  </div>

                  <role.icon className="w-12 h-12 mb-8 text-white stroke-1" />
                  <h3 className="text-3xl font-serif text-white mb-8 group-hover:text-accent transition-all">
                    {role.title}
                  </h3>

                  <ul className="space-y-6">
                    {role.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start text-kult-muted group-hover:text-white transition-colors duration-300">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-4 flex-shrink-0 opacity-20 group-hover:opacity-100 transition-opacity"></span>
                        <span className="font-light text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={openModal} className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-accent border-b border-accent/20 pb-1 hover:border-accent transition-all group/btn flex items-center gap-2">
                    Начать Челлендж <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <SplitScreenComparison />


      <Marquee text="КУЛЬТУРА МАРКЕТИНГА • ПАРТНЁРСТВА ВМЕСТО ЗАРПЛАТ • ДОЛЯ ОТ ПРИБЫЛИ ВМЕСТО БЮДЖЕТОВ •" reverse={true} />

      <GrowthTrackSection />


      {/* The Process (Challenge) */}
      <section id="process" className="py-32 px-6 bg-transparent relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="7-дневный челлендж"
            subtitle="7 дней, которые отделяют вас от найма партнёра за результат (а не за фикс)."
            centered={true}
          />

          <div className="relative mt-20">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block"></div>

            <div className="space-y-24">
              {STEPS.map((step, idx) => (
                <FadeInSection key={idx} delay={idx * 100}>
                  <div className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-12 relative group`}>

                    {/* Center Dot */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-black border border-white rounded-full z-10 items-center justify-center group-hover:scale-150 transition-transform duration-500">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>

                    <div className="w-full md:w-1/2 px-4">
                      <div className={`text-left ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <div className={`flex items-end gap-4 mb-4 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          <span className="text-8xl font-serif font-bold text-white/5 leading-none">
                            {step.number}
                          </span>
                          <h4 className="text-2xl font-bold text-white pb-3">{step.title}</h4>
                        </div>
                        <p className="text-kult-muted font-light leading-relaxed max-w-sm ml-auto mr-auto md:mx-0">{step.description}</p>
                      </div>
                    </div>

                    {/* Empty side for layout balance */}
                    <div className="w-full md:w-1/2 hidden md:block"></div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ValueStackSection />

      <GuaranteeSection />

      <FAQSection />

      {/* Final CTA Section */}

      <section id="manifesto" className="py-32 px-6 bg-white text-kult-black relative overflow-hidden">
        {/* Grain overlay for white section needs to be dark */}
        <div className="absolute inset-0 bg-black opacity-[0.03] pointer-events-none mix-blend-multiply"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-10 leading-none tracking-tighter">
              Готовы перестать играть в лотерею и начать расти?
            </h2>

            <div className="bg-kult-black text-white p-10 md:p-16 w-full shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-10 uppercase tracking-widest text-accent">
                ПОЛУЧИТЬ ДОСТУП К ЧЕЛЛЕНДЖУ
              </h3>

              <button
                onClick={openModal}
                className="w-full md:w-auto px-12 py-6 bg-accent text-black font-black uppercase tracking-[0.2em] hover:bg-[#00e600] hover:scale-105 transition-all inline-flex items-center justify-center gap-4 text-xl rounded-2xl shadow-[0_20px_40px_rgba(0,255,0,0.3)]"
              >
                🤖 Зайти в бот прямо сейчас →
              </button>

              <div className="mt-12 flex flex-col items-center justify-center gap-6 text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
                <p>Бесплатно для фаундеров. Занимает 30 секунд.</p>
                <div className="flex items-center gap-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <span>MUSK</span>
                  <span>HORMOZI</span>
                  <span>BRUNSON</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-kult-black border-t border-white/5 text-center md:text-left transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <div className="text-3xl font-serif font-black text-white mb-6 tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded flex items-center justify-center text-black text-xs rotate-3">KM</span>
              КУЛЬТУРА МАРКЕТИНГА
            </div>
            <p className="text-kult-muted text-sm leading-relaxed font-light">
              Система партнерского роста для бизнеса. Внедряем маркетинг за результат по модели Profit Sharing.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-16 md:gap-24">
            <div>
              <h5 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8 opacity-50">Навигация</h5>
              <div className="flex flex-col gap-4 text-sm text-kult-muted">
                <button onClick={() => scrollToSection('concept')} className="text-left hover:text-accent transition-colors">Концепция</button>
                <button onClick={() => scrollToSection('roles')} className="text-left hover:text-accent transition-colors">Роли</button>
                <button onClick={() => scrollToSection('process')} className="text-left hover:text-accent transition-colors">Челлендж</button>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8 opacity-50">Юридическая информация</h5>
              <div className="flex flex-col gap-4 text-sm text-kult-muted">
                <a href="/privacy" className="hover:text-accent transition-colors">Приватность</a>
                <a href="/offer" className="hover:text-accent transition-colors">Оферта</a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-kult-muted/30 font-mono uppercase tracking-[0.4em]">
          <p>© 2025 MARKETING CULTURE. GLOBAL PARTNERSHIPS.</p>
          <p className="mt-4 md:mt-0 tracking-[0.2em]">Crafted for the new generation of founders.</p>
        </div>
      </footer>

      {/* T5: Sticky Bottom CTA for Mobile - Always visible */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-kult-black via-kult-black to-transparent">
        <button
          onClick={openModal}
          className="w-full py-4 bg-accent text-black font-black uppercase tracking-[0.15em] shadow-[0_-5px_30px_rgba(0,255,0,0.3)] rounded-xl text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          🚀 Начать Челлендж
          <span className="text-[10px] opacity-70">(осталось 7 мест)</span>
        </button>
      </div>
    </div>
  );
};

export default App;