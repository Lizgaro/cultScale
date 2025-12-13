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
        { title: "Матчинг", description: "В Kult у тебя есть возможность выбрать команду.", result: "Партнер найден", time: "24 часа" },
        { title: "MVP", description: "Запуск первой версии продукта с готовой командой.", result: "Запуск", time: "1 неделя" },
        { title: "Трекшн", description: "Первые продажи через базу партнеров.", result: "Выручка", time: "2 недели" },
        { title: "Масштаб", description: "Выход на полную окупаемость и рост.", result: "Profit", time: "1 месяц" }
      ],
      totalTime: "1.5 месяца",
      summary: "До результата. Без затрат на ФОТ."
    },
    tradPath: {
      stages: [
        { title: "Поиск", description: "Поиск кофаундера и бесконечные встречи.", result: "Нет партнера", time: "2-3 мес" },
        { title: "Найм", description: "Сбор штата, оформление, налоги.", result: "ФОТ -300к", time: "1 месяц" },
        { title: "Разработка", description: "Долгострой, баги, смена подрядчиков.", result: "MVP", time: "4-6 мес" },
        { title: "Маркетинг", description: "Попытки настроить рекламу самостоятельно.", result: "Слив бюджета", time: "∞" }
      ],
      totalTime: "8+ месяцев",
      summary: "Или закрытие стартапа через полгода."
    }
  },
  {
    roleId: 'marketer',
    roleName: 'Маркетолог',
    kultPath: {
      stages: [
        { title: "Выбор", description: "Доступ к базе проектов с подтвержденным спросом.", result: "Проект выбран", time: "1 день" },
        { title: "Условия", description: "Подписание смарт-контракта на долю от прибыли.", result: "Доля 30-50%", time: "Сразу" },
        { title: "Запуск", description: "Запуск трафика на готовый оффер.", result: "Лиды", time: "3 дня" },
        { title: "Доход", description: "Получение первых дивидендов от продаж.", result: "Кэш", time: "2 недели" }
      ],
      totalTime: "2 недели",
      summary: "Выход на доход. Без поиска клиентов."
    },
    tradPath: {
      stages: [
        { title: "Резюме", description: "Рассылка откликов, собеседования с HR.", result: "Ожидание", time: "1 месяц" },
        { title: "Оффер", description: "Торг за фикс + призрачные KPI.", result: "Потолок з/п", time: "1 неделя" },
        { title: "Адаптация", description: "Изучение продукта, бюрократия.", result: "Рутина", time: "1 месяц" },
        { title: "Работа", description: "Отчеты, согласования, правки.", result: "Выгорание", time: "Всегда" }
      ],
      totalTime: "2.5 месяца",
      summary: "До первой зарплаты."
    }
  },
  {
    roleId: 'influencer',
    roleName: 'Лидер Мнений',
    kultPath: {
      stages: [
        { title: "Идея", description: "Продюсер предлагает продукт под вашу аудиторию.", result: "Концепт", time: "2 дня" },
        { title: "Производство", description: "Партнеры создают продукт и воронку.", result: "Готово", time: "1 неделя" },
        { title: "Анонс", description: "Прогрев и анонс по своей базе.", result: "Охваты", time: "3 дня" },
        { title: "Активы", description: "Получение доли в бизнесе.", result: "Пассив", time: "Навсегда" }
      ],
      totalTime: "2 недели",
      summary: "Свой бизнес, а не разовая реклама."
    },
    tradPath: {
      stages: [
        { title: "Ожидание", description: "Пассивное ожидание заявок на рекламу.", result: "Тишина", time: "?" },
        { title: "ТЗ", description: "Согласование жесткого ТЗ от заказчика.", result: "Рамки", time: "3 дня" },
        { title: "Пост", description: "Публикация рекламы (часто скам).", result: "Оплата", time: "1 день" },
        { title: "Поиск", description: "Снова поиск рекламодателя.", result: "Нестабильность", time: "Постоянно" }
      ],
      totalTime: "Разово",
      summary: "Работа за еду (бартер)."
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
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered = false }) => (
  <div className={`mb-16 md:mb-24 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
      {title}
    </h2>
    {subtitle && (
      <div className="w-24 h-1 bg-white mb-6"></div>
    )}
    {subtitle && (
      <p className="text-xl text-kult-muted max-w-2xl font-light">
        {subtitle}
      </p>
    )}
  </div>
);

const Marquee: React.FC<{ text: string; reverse?: boolean }> = ({ text, reverse = false }) => (
  <div className="w-full overflow-hidden bg-kult-text text-kult-black py-3 select-none relative z-20">
    <div className={`flex whitespace-nowrap ${reverse ? 'animate-scroll-reverse' : 'animate-scroll'}`} style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
      {[...Array(10)].map((_, i) => (
        <span key={i} className="mx-8 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-4">
          {text} <Zap size={14} className="fill-current" />
        </span>
      ))}
    </div>
  </div>
);

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
            className={`flex flex-col animate-float ${
              msg.sender === 'System' ? 'items-center' : 
              msg.sender === 'Founder' ? 'items-end' : 'items-start'
            }`}
          >
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
              msg.sender === 'System' ? 'bg-white/5 text-kult-muted text-xs border border-white/5' :
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

// Updated Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleGoToBot = () => {
    if (agreed) {
      window.location.href = "https://t.me/CultScale_bot";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-kult-dark border border-white/10 p-8 md:p-12 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-kult-muted hover:text-white">
          <X size={24} />
        </button>

        <div className="animate-float">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-black fill-current" />
          </div>

          <h3 className="text-2xl font-serif text-white mb-4 text-center">Запусти свой рост</h3>
          <p className="text-kult-muted text-sm mb-8 text-center">
            Все операции, матчинг и управление процессами происходят в нашем Telegram боте.
          </p>

          <div className="mb-8">
             <label className="flex items-start gap-3 cursor-pointer group p-3 border border-white/5 rounded hover:bg-white/5 transition-colors">
              <div className={`w-5 h-5 border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${agreed ? 'bg-white border-white' : 'border-white/30 group-hover:border-white'}`}>
                {agreed && <CheckCircle2 size={12} className="text-black" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              <span className="text-xs text-kult-muted leading-tight">
                Я принимаю условия <a href="/legal/offer.html" target="_blank" className="underline hover:text-white">Оферты</a>,
                соглашаюсь с <a href="/legal/privacy.html" target="_blank" className="underline hover:text-white">Политикой конфиденциальности</a> и даю
                <a href="/legal/consent.html" target="_blank" className="underline hover:text-white"> Согласие на обработку персональных данных</a>.
              </span>
            </label>
          </div>

          <button
            onClick={handleGoToBot}
            disabled={!agreed}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Перейти в бота <Send size={16} />
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
    <section id="split-comparison" ref={sectionRef} className="py-32 px-6 bg-kult-black relative overflow-hidden z-30">
       <div className="max-w-7xl mx-auto">
         <SectionHeader title="СРАВНЕНИЕ ПУТИ" subtitle="Выберите роль, чтобы увидеть разницу" centered />

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
               className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                 activeRole === role.roleId
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

            {/* Left Column: With KULT */}
            <div className="relative border-l-4 border-green-500 bg-white/5 p-8 rounded-r-xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 to-transparent"></div>
               <h3 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
                 <Zap className="text-green-500 fill-current" /> С KULT
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

const ProjectsCatalog: React.FC = () => {
  const simpleProjects = [
    { title: "SpeakyGo", desc: "Практика языка с ИИ собеседником", icon: "🗣️", status: "Active" },
    { title: "ChallengeLife", desc: "Сервис челленджей и марафонов", icon: "🏆", status: "Active" },
    { title: "SkyPay/Capital", desc: "Крипта работает как обычные деньги", icon: "💳", status: "Coming Soon" },
    { title: "Find The Job", desc: "Поиск работы и сотрудников с ИИ", icon: "🔍", status: "Active" },
    { title: "Мяудза", desc: "Командный чат и задачи", icon: "🐱", status: "Active" },
  ];

  const heavyProjects = [
    { title: "Metadoor-dev", desc: "Финмодели и прогнозы для бизнеса", icon: "📊", status: "Active" },
    { title: "Claritech", desc: "Контроль и анализ расходов", icon: "📉", status: "Active" },
    { title: "SciArticle", desc: "Автоматические бизнес-отчёты", icon: "📑", status: "Active" },
    { title: "CRMChat", desc: "AI-аутрич и CRM в Telegram", icon: "🤖", status: "Active" },
  ];

  return (
    <section className="py-24 px-6 bg-kult-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="ПРОЕКТЫ ЭКОСИСТЕМЫ" subtitle="От простых сервисов до сложных бизнес-решений" />

        <div className="mb-16">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><Zap size={20}/> Для людей и команд</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simpleProjects.map((p, i) => (
              <div key={i} className="p-6 border border-white/10 bg-white/5 rounded-lg hover:border-white/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl">{p.icon}</span>
                  {p.status === 'Active' ? <CheckCircle2 size={16} className="text-green-500"/> : <span className="text-[10px] uppercase border border-white/20 px-2 py-1 rounded text-kult-muted">Скоро</span>}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                <p className="text-sm text-kult-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><BarChart3 size={20}/> Для бизнеса</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heavyProjects.map((p, i) => (
              <div key={i} className="p-6 border border-white/10 bg-white/5 rounded-lg hover:border-white/30 transition-all">
                 <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl">{p.icon}</span>
                  <CheckCircle2 size={16} className="text-green-500"/>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                <p className="text-sm text-kult-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Card for New Project */}
        <div className="relative overflow-hidden rounded-2xl border border-white/20 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40 opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded mb-4">New Arrival</div>
              <h3 className="text-3xl font-serif text-white mb-2">Spell-book</h3>
              <p className="text-kult-muted max-w-lg">Платформа ИИ-ассистентов нового поколения для малого бизнеса.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <Zap size={32} className="text-white"/>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const TrustSection: React.FC = () => (
  <section className="py-24 px-6 bg-kult-dark relative overflow-hidden">
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
            <div className="text-[10px] text-white/50">Старт с 30к ₽</div>
          </div>

          <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
            <div className="text-4xl font-bold text-white mb-2">+200 млн ₽</div>
            <div className="text-xs text-kult-muted uppercase tracking-wider mb-2">EdTech Кейс</div>
            <div className="text-[10px] text-white/50">GeekBrains</div>
          </div>

            <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
            <div className="text-4xl font-bold text-white mb-2">700 млн ₽</div>
            <div className="text-xs text-kult-muted uppercase tracking-wider mb-2">Общая выручка</div>
            <div className="text-[10px] text-white/50">17 проектов</div>
          </div>
        </div>

        <a
          href="https://youtu.be/tynzX-wg8QI?si=jAtil9a5mukGQtuR"
          target="_blank"
          className="mt-12 inline-flex items-center gap-3 text-white border border-white/20 px-8 py-4 rounded hover:bg-white hover:text-black transition-all group"
        >
          <Play size={18} className="fill-current"/> Смотреть разбор кейсов
        </a>
    </div>
  </section>
);

const GrowthTrackSection: React.FC = () => (
  <section className="py-24 px-6 bg-kult-black">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="СРАВНЕНИЕ МОДЕЛЕЙ" subtitle="Почему старая модель найма больше не работает" centered />

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <div className="hidden md:grid grid-cols-3 bg-white/10 border-b border-white/10">
          <div className="p-6 font-bold text-xs uppercase tracking-widest text-white">Критерий</div>
          <div className="p-6 font-bold text-xs uppercase tracking-widest text-kult-muted">Обычный найм / Фриланс</div>
          <div className="p-6 font-bold text-xs uppercase tracking-widest text-white">Модель Cult Assembly</div>
        </div>

        <ComparisonRow
          title="Мотивация"
          traditional="Работа за оклад. Главная цель — отсидеть часы или сдать задачу."
          kult="Работа за долю. Главная цель — рост прибыли компании."
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
          kult="Только проверенные партнеры, прошедшие челленджи."
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
      "Команда маркетологов и блогеров, мотивированных на результат",
      "Масштабирование без венчура и рекламных бюджетов",
      "Прямой доступ к аудитории через лидеров мнений",
      "Партнеры, прошедшие валидацию комьюнити"
    ]
  },
  {
    icon: BarChart3,
    title: "Маркетолог",
    points: [
      "Проекты под твои скилы без самостоятельного поиска",
      "Работа на 100% мощности, а не на 40% за фикс",
      "Доля от прибыли = реальный заработок на результате",
      "Выбираешь проекты, в которые веришь"
    ]
  },
  {
    icon: Target,
    title: "Лидер мнений",
    points: [
      "Личный продюсер подбирает продукты под твою аудиторию",
      "База релевантных проектов для долгосрочных партнерств",
      "Доля от прибыли вместо копеек за разовую интеграцию",
      "Приоритет в партнерских связках после прохождения челленджа"
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
    number: "01",
    title: "Челлендж",
    description: "Проходишь 7-дневный челлендж для подтверждения компетенций."
  },
  {
    number: "02",
    title: "Заявка",
    description: "Оставляешь заявку на свой проект, скиллы или аудиторию."
  },
  {
    number: "03",
    title: "База",
    description: "Попадаешь в закрытую базу «горячих» участников."
  },
  {
    number: "04",
    title: "Связка",
    description: "Получаешь релевантных партнеров и начинаешь работу."
  },
  {
    number: "05",
    title: "Прибыль",
    description: "Работаешь в спринтах и получаешь долю от реальной прибыли."
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
      
      <div className="bg-noise"></div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-kult-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold tracking-tighter text-white z-50">
            КУЛЬТ
          </div>
          
          <div className="hidden md:flex space-x-8 text-xs font-bold tracking-widest uppercase">
            <button onClick={() => scrollToSection('concept')} className="hover:text-white transition-colors">КОНЦЕПЦИЯ</button>
            <button onClick={() => scrollToSection('roles')} className="hover:text-white transition-colors">РОЛИ</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">ПРОЕКТЫ</button>
            <button onClick={() => scrollToSection('process')} className="hover:text-white transition-colors">ПРОЦЕСС</button>
            <button onClick={() => scrollToSection('manifesto')} className="hover:text-white transition-colors">МАНИФЕСТ</button>
          </div>

          <button 
            className="hidden md:block px-6 py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            onClick={openModal}
          >
            Войти в ассамблею
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
             <button onClick={() => scrollToSection('concept')} className="text-left text-2xl font-serif text-white">КОНЦЕПЦИЯ</button>
            <button onClick={() => scrollToSection('roles')} className="text-left text-2xl font-serif text-white">РОЛИ</button>
             <button onClick={() => scrollToSection('projects')} className="text-left text-2xl font-serif text-white">ПРОЕКТЫ</button>
            <button onClick={() => scrollToSection('process')} className="text-left text-2xl font-serif text-white">ПРОЦЕСС</button>
            <button onClick={() => scrollToSection('manifesto')} className="text-left text-2xl font-serif text-white">МАНИФЕСТ</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 px-6 pb-20">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center z-10">
          <div className="text-center lg:text-left relative">
            {/* Task E1: Improved readability background */}
            <div className="absolute -inset-10 bg-black/40 blur-3xl -z-10 pointer-events-none rounded-full"></div>

            <FadeInSection>
              <div className="inline-flex items-center gap-2 py-1 px-3 border border-white/10 bg-white/5 rounded-full mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-widest uppercase text-kult-muted">
                  Набор открыт
                </span>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[0.9] md:leading-[1.1] mb-8 tracking-tight">
                МАСШТАБ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 italic pr-2">БЕЗ БЮДЖЕТА</span>
              </h1>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="max-w-xl mx-auto lg:mx-0 mb-12 border-l border-white/20 pl-6 text-left">
                 <p className="text-xl md:text-2xl text-white font-serif mb-2">КУЛЬТ — место высокой продуктивности.</p>
                 <p className="text-lg text-kult-muted font-light leading-relaxed">
                   Растёшь и масштабируешься быстрее за счёт методологий, поддержки и наших механик.
                 </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={600}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('split-comparison')}
                  className="w-full sm:w-auto px-8 py-5 bg-[#00ff00] text-black font-bold text-xs tracking-[0.2em] hover:bg-[#00cc00] hover:shadow-[0_8px_24px_rgba(0,255,0,0.4)] hover:scale-105 transition-all uppercase flex items-center justify-center gap-3 group border-none"
                  style={{ height: '64px' }} // +8px visual height
                >
                  С KULT <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                   onClick={() => scrollToSection('split-comparison')}
                   className="w-full sm:w-auto px-8 py-5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] hover:bg-white/5 hover:translate-y-[-2px] transition-all uppercase h-14"
                >
                  Традиционный путь
                </button>
              </div>
            </FadeInSection>
          </div>

          <FadeInSection delay={800} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent blur opacity-30"></div>
              <ChatSimulation />
              <div className="mt-6 text-center">
                 <p className="text-xs text-kult-muted font-mono uppercase tracking-widest">Live Partnership Engine</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </header>

      <Marquee text="PARTNERSHIPS • PROFIT SHARE • SCALE •" />

      {/* The Problem (Dark Reality) */}
      <section id="concept" className="py-32 px-6 bg-kult-black relative">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <h3 className="text-3xl md:text-5xl font-serif mb-12 text-white leading-tight">
              Ты сливаешь свой стартап, <br/>
              <span className="text-kult-muted italic font-serif">даже не осознавая этого.</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-12 text-kult-muted text-lg font-light leading-relaxed">
              <p>
                Представь: команда собрана, деньги найдены, реклама запущена. Проходит месяц. 
                Бюджет испаряется. Маркетолог работает вполсилы за фикс. 
                Блогеры делают интеграцию и забывают о тебе.
              </p>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                <p className="pl-6 text-white">
                  Пока ты сжигаешь кэш на рекламу, твои конкуренты масштабируются без бюджета.
                  Капитал — это архаизм. Современный мир движется за счет партнерств.
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Comparison Cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPARISONS.map((item, idx) => (
              <FadeInSection key={idx} delay={idx * 150}>
                <div className="p-8 border border-white/10 hover:border-white transition-all duration-500 h-full flex flex-col justify-between bg-white/5 backdrop-blur-sm group hover:-translate-y-2">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">{item.company}</h4>
                    <p className="text-xs text-kult-muted uppercase tracking-wider mb-6">
                      {item.achievement}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/10 group-hover:border-white/50 transition-colors">
                    <p className="text-white font-serif italic text-xl">{item.method}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <div className="mt-24 text-center">
             <p className="text-2xl md:text-5xl font-serif text-white leading-tight">
               Бюджет не требуется. <br />
               <span className="text-kult-muted decoration-1 underline decoration-white/30 underline-offset-8">Нужны только партнерства.</span>
             </p>
          </div>
        </div>
      </section>

      {/* The Solution (Roles) */}
      <section id="roles" className="py-32 px-6 bg-kult-dark relative overflow-hidden">
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
                <div className="h-full border-r border-b border-white/10 p-10 md:p-12 group hover:bg-white/5 transition-all duration-500 cursor-default relative">
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-white -rotate-45" />
                  </div>
                  
                  <role.icon className="w-12 h-12 mb-8 text-white stroke-1" />
                  <h3 className="text-3xl font-serif text-white mb-8 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                    {role.title}
                  </h3>
                  
                  <ul className="space-y-6">
                    {role.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start text-kult-muted group-hover:text-white transition-colors duration-300">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-4 flex-shrink-0 opacity-20 group-hover:opacity-100 transition-opacity"></span>
                        <span className="font-light text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={openModal} className="mt-12 text-xs font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:border-white transition-colors">
                    Подать заявку как {role.title}
                  </button>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <SplitScreenComparison />

      <TurnkeySection />

      <Marquee text="DAO GOVERNANCE • NO SALARIES • JUST RESULTS •" reverse={true} />

      {/* Projects Catalog */}
      <div id="projects">
        <ProjectsCatalog />
      </div>

      <GrowthTrackSection />

      <TrustSection />

      {/* The Process */}
      <section id="process" className="py-32 px-6 bg-kult-black relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader 
            title="МЕХАНИКА" 
            subtitle="7-дневные спринты вместо месяцев переговоров. Результат вместо бюрократии."
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

      {/* Manifesto / Final CTA */}
      <section id="manifesto" className="py-32 px-6 bg-white text-kult-black relative overflow-hidden">
        {/* Grain overlay for white section needs to be dark */}
        <div className="absolute inset-0 bg-black opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-10 leading-none">
              ВРЕМЯ ПРИЗНАТЬ <br/> ПРАВДУ
            </h2>
            <p className="text-lg md:text-xl text-kult-gray/80 mb-16 font-light max-w-2xl mx-auto leading-relaxed">
              Нас учили, что для бизнеса необходим капитал. Это миф прошлого поколения.
              Сатоши Накамото создал Bitcoin без ICO и рекламы. 
              Команда из 3 новичков сделала 200 млн без зарплат.
            </p>
            
            <div className="bg-kult-black text-white p-10 md:p-16 w-full shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
              
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">ВСТУПИТЬ В КУЛЬТ</h3>
              <p className="text-kult-muted mb-10 text-sm tracking-wide max-w-md mx-auto">
                Пройди отбор и получи доступ к закрытой базе проектов и продюсеров.
              </p>
              
              <button 
                onClick={openModal}
                className="w-full md:w-auto px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-3"
              >
                Подать заявку <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-white/30">
                <span className="flex items-center gap-2"><Lock size={12}/> Закрытое комьюнити</span>
                <span className="flex items-center gap-2"><Zap size={12}/> 7 дней на валидацию</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-kult-black border-t border-white/5 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="text-4xl font-serif font-bold text-white mb-4">КУЛЬТ</div>
            <p className="text-kult-muted text-sm max-w-xs leading-relaxed">
              Первая в России деловая ассамблея, работающая по модели Profit Sharing.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Навигация</h5>
              <div className="flex flex-col gap-4 text-sm text-kult-muted">
                <button onClick={() => scrollToSection('concept')} className="text-left hover:text-white transition-colors">Концепция</button>
                <button onClick={() => scrollToSection('roles')} className="text-left hover:text-white transition-colors">Роли</button>
                <button onClick={() => scrollToSection('projects')} className="text-left hover:text-white transition-colors">Проекты</button>
                <button onClick={() => scrollToSection('process')} className="text-left hover:text-white transition-colors">Процесс</button>
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Документы</h5>
              <div className="flex flex-col gap-4 text-sm text-kult-muted">
                <a href="/legal/privacy.html" target="_blank" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                <a href="/legal/consent.html" target="_blank" className="hover:text-white transition-colors">Согласие на обработку ПД</a>
                <a href="/legal/offer.html" target="_blank" className="hover:text-white transition-colors">Оферта</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-kult-muted/50">
          <p>© 2024 KULT Assembly. All rights reserved.</p>
          <p>Designed for Leaders.</p>
        </div>
      </footer>
      
      {/* Sticky Bottom CTA for Mobile */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
        <button 
          onClick={openModal}
          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          Подать заявку
        </button>
      </div>

    </div>
  );
};

export default App;