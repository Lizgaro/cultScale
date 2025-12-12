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
  Send
} from 'lucide-react';
import { RoleFeature, ComparisonItem, ProcessStep, ChatMessage, FormData } from './types';

// --- Reusable Components ---

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

const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ role: '', telegram: '', consent: false });

  if (!isOpen) return null;

  const handleRoleSelect = (role: string) => {
    setData({ ...data, role });
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.consent && data.telegram) {
      setStep(3);
      // Here you would typically send data to backend
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-kult-dark border border-white/10 p-8 md:p-12 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-kult-muted hover:text-white">
          <X size={24} />
        </button>

        {step === 1 && (
          <div className="animate-float">
            <h3 className="text-2xl font-serif text-white mb-2">Выбери роль</h3>
            <p className="text-kult-muted text-sm mb-8">Для персонализации челленджа</p>
            <div className="space-y-3">
              {['Фаундер', 'Маркетолог', 'Лидер Мнений'].map(role => (
                <button 
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className="w-full text-left p-4 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex justify-between group"
                >
                  <span className="font-bold tracking-wide uppercase text-sm">{role}</span>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="animate-float">
            <h3 className="text-2xl font-serif text-white mb-2">Контакты</h3>
            <p className="text-kult-muted text-sm mb-8">Мы пришлем детали в Telegram</p>
            
            <div className="mb-6">
              <label className="block text-xs font-mono text-kult-muted uppercase mb-2">Telegram username</label>
              <div className="flex bg-kult-black border border-white/20 focus-within:border-white transition-colors">
                <span className="p-4 text-kult-muted">@</span>
                <input 
                  type="text" 
                  required
                  placeholder="username"
                  className="w-full bg-transparent text-white p-4 pl-0 outline-none placeholder:text-white/20"
                  value={data.telegram}
                  onChange={e => setData({...data, telegram: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${data.consent ? 'bg-white border-white' : 'border-white/30 group-hover:border-white'}`}>
                  {data.consent && <CheckCircle2 size={12} className="text-black" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={data.consent}
                  onChange={e => setData({...data, consent: e.target.checked})}
                />
                <span className="text-xs text-kult-muted leading-tight">
                  Я даю согласие на обработку персональных данных в соответствии с законодательством РФ (152-ФЗ) и Политикой конфиденциальности.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={!data.consent || !data.telegram}
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить заявку
            </button>
            
            <button type="button" onClick={() => setStep(1)} className="mt-4 text-xs text-kult-muted hover:text-white underline">
              Назад
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center animate-float">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-black" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Заявка принята</h3>
            <p className="text-kult-muted text-sm mb-8">
              Менеджер свяжется с вами по указанному контакту в течение 24 часов.
            </p>
            <button onClick={onClose} className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest">
              Вернуться на сайт
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Content Data ---

const ROLES: RoleFeature[] = [
  {
    icon: Target,
    title: "Лидер мнений",
    points: [
      "Личный продюсер подбирает продукты под твою аудиторию",
      "База релевантных проектов для долгосрочных партнерств",
      "Доля от прибыли вместо копеек за разовую интеграцию",
      "Приоритет в партнерских связках после прохождения челленджа"
    ]
  },
  {
    icon: Rocket,
    title: "Фаундер",
    points: [
      "Команда маркетологов и блогеров, мотивированных на результат",
      "Масштабирование без венчура и рекламных бюджетов",
      "Прямой доступ к аудитории через лидеров мнений",
      "DAO-одобренные партнеры, прошедшие валидацию комьюнити"
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
          <div className="text-center lg:text-left">
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
              <p className="text-lg md:text-xl text-kult-muted max-w-xl mx-auto lg:mx-0 font-light leading-relaxed mb-12 border-l border-white/20 pl-6 text-left">
                Первое в России место, где фаундеры растут без венчура, 
                а лидеры мнений становятся совладельцами проектов.
              </p>
            </FadeInSection>

            <FadeInSection delay={600}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button onClick={openModal} className="w-full sm:w-auto px-8 py-5 bg-white text-black font-bold text-xs tracking-[0.2em] hover:bg-gray-200 transition-all uppercase flex items-center justify-center gap-3 group">
                  Подать заявку
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => scrollToSection('concept')} className="w-full sm:w-auto px-8 py-5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] hover:bg-white/5 transition-colors uppercase">
                  Читать Манифест
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

      <Marquee text="DAO GOVERNANCE • NO SALARIES • JUST RESULTS •" reverse={true} />

      {/* The Process */}
      <section id="process" className="py-32 px-6 bg-kult-black relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader 
            title="МЕХАНИКА" 
            subtitle="7-дневные спринты вместо месяцев переговоров. DAO-голосование вместо субъективного отбора."
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
                <button onClick={() => scrollToSection('process')} className="text-left hover:text-white transition-colors">Процесс</button>
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Документы</h5>
              <div className="flex flex-col gap-4 text-sm text-kult-muted">
                <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                <a href="#" className="hover:text-white transition-colors">Согласие на обработку ПД</a>
                <a href="#" className="hover:text-white transition-colors">Оферта</a>
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