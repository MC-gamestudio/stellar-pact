import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Globe, Wind, Droplets, ChevronDown, Zap } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanetData {
  name: string;
  atmosphere: string;
  gravity: string;
  water: string;
}

// ─── Civilization Description Generator ───────────────────────────────────────

const atmoDesc: Record<string, string> = {
  '氮氧': '蔚蓝大气层富含活性氧，呼吸无忧',
  '氦氖': '大气泛着迷幻霓虹荧光，气体轻盈',
  '二氧化碳': '浓厚温室气体锁住炽热，万物炙烤',
  '甲烷': '橙黄有机迷雾弥漫星表，化学奇境',
};

const gravityDesc: Record<string, string> = {
  '轻重力 0.3x': '引力微弱，山峦直插苍穹，跳跃即飞翔',
  '标准 1x': '引力适中，生命繁衍于坚实大地',
  '强重力 2x': '引力强劲，生命匍匐低矮，肌肉发达',
  '极重力 3x': '引力极端，万物压缩于地表，宛如铸造',
};

const waterDesc: Record<string, string> = {
  '海洋型': '汪洋覆盖九成星表，深海孕育万物',
  '沙漠型': '焦土龟裂延伸至地平线，水是信仰',
  '冰封型': '永恒冰盖封锁星球，液态水藏于深层',
  '云海型': '云层厚如大陆，生命栖居于云脊之上',
};

const civDescriptions: Record<string, string> = {
  '氦氖-轻重力 0.3x-云海型': '这里的生命学会了在云端漂浮，以星光为食，以风为语。',
  '氦氖-轻重力 0.3x-海洋型': '霓虹气泡漂浮于海面，生命半在天空半在水中，两界游走。',
  '氦氖-轻重力 0.3x-沙漠型': '荧光孢子随轻风飘散，将整片沙海染成彩虹色的生命海洋。',
  '氦氖-轻重力 0.3x-冰封型': '冰晶与霓虹气体共舞，生命以光合冻结之法，封存永恒。',
  '氦氖-标准 1x-云海型': '霓虹云层中诞生了以电磁感知世界的文明，语言是光脉冲。',
  '氦氖-标准 1x-海洋型': '发光的海洋里，每一滴水都是一个神经元，星球本身在思考。',
  '氦氖-标准 1x-沙漠型': '沙粒在霓虹光中反射万道彩光，沙漠文明以色彩编写历史。',
  '氦氖-标准 1x-冰封型': '霓虹气体与冰晶折射出极光大教堂，文明在绚烂中沉思。',
  '氦氖-强重力 2x-云海型': '沉重的云压得生命低矮却强壮，他们用肌肉托举整片天空。',
  '氦氖-强重力 2x-海洋型': '强力压缩的海洋如同液态金属，其中诞生的生命坚不可摧。',
  '氦氖-强重力 2x-沙漠型': '强重力将沙粒压成宝石，文明以采矿为神圣，地核是圣地。',
  '氦氖-强重力 2x-冰封型': '冰层在极压下变得坚硬如钻石，文明雕刻冰晶建造城市。',
  '氦氖-极重力 3x-云海型': '大气被极重力压缩成液态，云层密度超过水，生命于其中游弋。',
  '氦氖-极重力 3x-海洋型': '极压之海如铁水翻腾，诞生于此的生命体积微小却力大无穷。',
  '氦氖-极重力 3x-沙漠型': '极重力将地表夷为平原，只有最顽强的菌落在岩缝中挣扎求生。',
  '氦氖-极重力 3x-冰封型': '极压冰层分子排列如金属晶格，文明在其中凿出热泉都市。',
  '氮氧-轻重力 0.3x-云海型': '轻重力令云层高悬不散，文明在云脊筑城，俯瞰无尽星海。',
  '氮氧-轻重力 0.3x-海洋型': '海水在低重力下腾起巨浪百米，冲浪成为这里唯一的宗教。',
  '氮氧-轻重力 0.3x-沙漠型': '沙粒轻盈如雪，风暴将整座山脉搬运，地图每天都在改写。',
  '氮氧-轻重力 0.3x-冰封型': '冰川以极缓慢速度漂浮空中，文明驾驭冰岛四处游历。',
  '氮氧-标准 1x-云海型': '标准重力下云海稳定如大地，上层文明从未见过星球表面。',
  '氮氧-标准 1x-海洋型': '蓝天碧海，这颗星球诞生了宇宙中最喜悦、最好奇的文明。',
  '氮氧-标准 1x-沙漠型': '每一滴雨都是节日，文明围绕稀缺之水建立了精妙的社会秩序。',
  '氮氧-标准 1x-冰封型': '冰封之下的液态海洋孕育了从未见过阳光的深海文明。',
  '氮氧-强重力 2x-云海型': '云层被强重力压得低沉如幕，文明在浓雾中演化出超强感官。',
  '氮氧-强重力 2x-海洋型': '强重力令海洋稳如磐石，文明在压强极大的深渊中萌芽。',
  '氮氧-强重力 2x-沙漠型': '强重力锁住每一粒沙，巨型建筑如山脉矗立，文明以建造为荣。',
  '氮氧-强重力 2x-冰封型': '强重力将冰压碎又重塑，文明在永恒裂变的冰原上追逐稳定。',
  '氮氧-极重力 3x-云海型': '大气被极压缩成薄层，只有最顽强的微生物在岩石缝隙喘息。',
  '氮氧-极重力 3x-海洋型': '极重力下海洋深不见底，传说最深处有光，那是地核的心跳。',
  '氮氧-极重力 3x-沙漠型': '极重力锁死所有水分子，这颗星球的沙是干燥宇宙的终极形态。',
  '氮氧-极重力 3x-冰封型': '极重力冰封之星，文明在地热裂缝中诞生，以热能为神明。',
  '二氧化碳-轻重力 0.3x-云海型': '炽热云层在轻重力下漂浮极高，文明在低温高空中建造悬浮城市。',
  '二氧化碳-轻重力 0.3x-海洋型': '温室效应令海水沸腾，适应高温的文明以蒸汽为动力驾驭海洋。',
  '二氧化碳-轻重力 0.3x-沙漠型': '炙热沙漠与轻重力共同孕育了擅长跳跃、以热为食的外骨骼文明。',
  '二氧化碳-轻重力 0.3x-冰封型': '温室大气与极寒冰封对峙，交界处是生命奇迹诞生的裂缝地带。',
  '二氧化碳-标准 1x-云海型': '浓厚云层遮蔽阳光，星球陷入永恒昏暗，文明以生物发光照亮一切。',
  '二氧化碳-标准 1x-海洋型': '超热酸性海洋孕育了以碳为骨架的独特生命，钢铁在此溶解。',
  '二氧化碳-标准 1x-沙漠型': '温室炉火中，沙漠文明发展出完美的隔热技术，建造了玻璃城邦。',
  '二氧化碳-标准 1x-冰封型': '温室锁热，冰层之下液态海洋涌动，文明从冰中凿出生命之路。',
  '二氧化碳-强重力 2x-云海型': '浓厚大气与强重力形成极端风暴层，文明在风暴眼中建造永恒都市。',
  '二氧化碳-强重力 2x-海洋型': '酸海与强压并存，孕育了宇宙中最耐酸耐压的硅基生命体。',
  '二氧化碳-强重力 2x-沙漠型': '高温高压沙漠将碳压成钻石，文明以采矿为使命，星球是宝藏。',
  '二氧化碳-强重力 2x-冰封型': '温室与强重力将冰层压为超密度固态，文明在其中开凿永恒迷宫。',
  '二氧化碳-极重力 3x-云海型': '极压大气如铅幕低垂，唯有在大气层顶端，微型生命悄然呼吸。',
  '二氧化碳-极重力 3x-海洋型': '极压酸海，这里是宇宙中最严苛的生存考场，幸存者无所不能。',
  '二氧化碳-极重力 3x-沙漠型': '极重力与极热并存，这颗星球是自然的炼狱，却也是最纯粹的炉火。',
  '二氧化碳-极重力 3x-冰封型': '极端矛盾的世界，温室与极压冰封共存，文明尚未诞生，但迟早会来。',
  '甲烷-轻重力 0.3x-云海型': '橙色甲烷云在轻重力下漫无边际，其中漂浮着以有机物为食的气囊生命。',
  '甲烷-轻重力 0.3x-海洋型': '液态甲烷之海在轻重力下掀起奇异潮汐，碳氢文明在此书写化学史诗。',
  '甲烷-轻重力 0.3x-沙漠型': '有机沙漠如同巨大化学实验室，每一粒沙都是一个分子，等待组合。',
  '甲烷-轻重力 0.3x-冰封型': '甲烷冰晶在轻重力下折射出橙色光芒，文明在有机冰原上雕刻文字。',
  '甲烷-标准 1x-云海型': '橙色云海笼罩星球，有机物在云层中自发组合，每天都有新生命诞生。',
  '甲烷-标准 1x-海洋型': '液态甲烷大洋孕育了以碳链为DNA的奇异文明，他们的血液是石油。',
  '甲烷-标准 1x-沙漠型': '有机沙漠中矿藏无数，文明以提炼有机物为产业，星球是一座炼油厂。',
  '甲烷-标准 1x-冰封型': '甲烷冰盖之下藏着液态有机海洋，文明在冰下漆黑中发展出奇异智慧。',
  '甲烷-强重力 2x-云海型': '浓厚有机云被强重力压实，下雨时降的是有机酸，沃土无比肥沃。',
  '甲烷-强重力 2x-海洋型': '高压有机海洋如同原始汤，生命在此以惊人速度演化，每秒都在进化。',
  '甲烷-强重力 2x-沙漠型': '强重力将有机物压成焦油湖，文明将焦油湖视为圣地，汲取能量。',
  '甲烷-强重力 2x-冰封型': '有机冰在强压下变质成特殊晶体，文明以此为建材，城市折射橙光。',
  '甲烷-极重力 3x-云海型': '极压将有机云液化，整个星球笼罩在有机液体雨中，生命在雨中生长。',
  '甲烷-极重力 3x-海洋型': '极压有机海洋密度极高，生命在其中如同在固体中游弋，缓慢而深邃。',
  '甲烷-极重力 3x-沙漠型': '极重力有机沙漠是宇宙中碳元素最密集之处，钻石如沙砾般普通。',
  '甲烷-极重力 3x-冰封型': '极端有机冰封世界，文明尚在孕育中，这颗星球仍是一枚待孵的宇宙蛋。',
};

function getCivDescription(planet: PlanetData): string {
  const key = `${planet.atmosphere}-${planet.gravity}-${planet.water}`;
  return civDescriptions[key] ?? '这颗星球的文明密码尚待破译，宇宙在沉默中等待第一声呼唤。';
}

// ─── Starfield ────────────────────────────────────────────────────────────────

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      delta: (Math.random() - 0.5) * 0.007,
      color: Math.random() > 0.82 ? `hsl(${200 + Math.random() * 50}, 80%, 85%)` : 'white',
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.delta;
        if (s.alpha <= 0.02 || s.alpha >= 1) s.delta *= -1;
        ctx.globalAlpha = Math.max(0.02, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Planet Visual ────────────────────────────────────────────────────────────

const planetPalettes: Record<string, { base: string; shine: string; detail: string; glow: string }> = {
  '氮氧': { base: '#1e3a8a', shine: '#3b82f6', detail: '#93c5fd', glow: '#60a5fa' },
  '氦氖': { base: '#6b21a8', shine: '#a855f7', detail: '#e879f9', glow: '#c026d3' },
  '二氧化碳': { base: '#7f1d1d', shine: '#dc2626', detail: '#fca5a5', glow: '#f97316' },
  '甲烷': { base: '#78350f', shine: '#d97706', detail: '#fcd34d', glow: '#f59e0b' },
};

function PixelPlanet({ atmosphere, water }: { atmosphere: string; water: string }) {
  const pal = planetPalettes[atmosphere] ?? planetPalettes['氮氧'];
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 62;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: r * 2 + 50,
          height: r * 2 + 50,
          background: `radial-gradient(circle, ${pal.glow}28 0%, transparent 70%)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id={`pg-${atmosphere}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={pal.shine} />
            <stop offset="55%" stopColor={pal.base} />
            <stop offset="100%" stopColor={pal.base} stopOpacity="0.5" />
          </radialGradient>
          <clipPath id={`pc-${atmosphere}`}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>

        <circle cx={cx} cy={cy} r={r} fill={`url(#pg-${atmosphere})`} />

        <g clipPath={`url(#pc-${atmosphere})`}>
          {water === '海洋型' && <>
            <rect x={cx - 18} y={cy - 28} width={26} height={18} rx={2} fill={pal.detail} opacity={0.45} />
            <rect x={cx + 12} y={cy + 8} width={16} height={12} rx={2} fill={pal.detail} opacity={0.38} />
            <rect x={cx - 38} y={cy + 18} width={20} height={14} rx={2} fill={pal.detail} opacity={0.32} />
          </>}
          {water === '沙漠型' && <>
            <rect x={cx - 45} y={cy - 38} width={90} height={76} fill={pal.detail} opacity={0.28} />
            <rect x={cx - 25} y={cy - 18} width={50} height={36} fill={pal.shine} opacity={0.18} />
          </>}
          {water === '冰封型' && <>
            <rect x={cx - 45} y={cy - r + 4} width={90} height={24} rx={2} fill="white" opacity={0.5} />
            <rect x={cx - 35} y={cy + r - 26} width={70} height={20} rx={2} fill="white" opacity={0.42} />
          </>}
          {water === '云海型' && [...Array(5)].map((_, i) => (
            <rect key={i} x={cx - 52 + i * 20} y={cy - 12 + (i % 2) * 18} width={26} height={9} rx={4} fill="white" opacity={0.22} />
          ))}
        </g>

        <ellipse cx={cx - 20} cy={cy - 20} rx={15} ry={10} fill="white" opacity={0.16} />
        <ellipse cx={cx} cy={cy} rx={r + 16} ry={9} fill="none" stroke={pal.detail} strokeWidth={2.5} opacity={0.22} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={pal.glow} strokeWidth={1.5} opacity={0.55} />
      </svg>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

interface SelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function PixelSelect({ label, icon, value, options, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <label className="block mb-1.5" style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
        <span className="inline-flex items-center gap-1.5">{icon} {label}</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 transition-all duration-200 focus:outline-none"
        style={{
          background: 'rgba(15, 10, 40, 0.85)',
          border: `1px solid ${open ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.35)'}`,
          boxShadow: open ? '0 0 14px rgba(139,92,246,0.35)' : '0 0 4px rgba(139,92,246,0.1)',
          fontFamily: "'VT323', monospace",
          fontSize: '1.1rem',
          color: '#e2e8f0',
          letterSpacing: '0.08em',
        }}
      >
        <span>{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: '#a855f7' }} />
      </button>
      {open && (
        <div
          className="absolute z-50 w-full mt-0.5"
          style={{
            background: 'rgba(8, 3, 24, 0.98)',
            border: '1px solid rgba(139,92,246,0.5)',
            boxShadow: '0 8px 32px rgba(139,92,246,0.25)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 transition-colors duration-150"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '1.1rem',
                color: opt === value ? '#c084fc' : '#cbd5e1',
                letterSpacing: '0.08em',
                borderBottom: '1px solid rgba(139,92,246,0.1)',
                background: opt === value ? 'rgba(88,28,135,0.25)' : 'transparent',
              }}
              onMouseEnter={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = 'rgba(88,28,135,0.2)'; }}
              onMouseLeave={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {opt === value ? '▶ ' : '\u00A0\u00A0'}{opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Attribute Row ────────────────────────────────────────────────────────────

function AttrRow({ icon, label, value, desc }: { icon: React.ReactNode; label: string; value: string; desc: string }) {
  return (
    <div className="px-3 py-2.5" style={{ background: 'rgba(10,5,30,0.5)', borderLeft: '2px solid rgba(139,92,246,0.5)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ color: '#a855f7' }}>{icon}</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.82rem', color: '#7c3aed', letterSpacing: '0.12em' }}>{label}</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.95rem', color: '#e2e8f0', marginLeft: 'auto', letterSpacing: '0.06em' }}>{value}</span>
      </div>
      <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6, fontWeight: 300 }}>{desc}</p>
    </div>
  );
}

// ─── Planet Card ──────────────────────────────────────────────────────────────

function PlanetCard({ planet }: { planet: PlanetData }) {
  const [visible, setVisible] = useState(false);
  const idRef = useRef(Math.random().toString(36).slice(2, 8).toUpperCase());

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const civDesc = getCivDescription(planet);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(28px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      <div className="flex justify-center mb-4">
        <PixelPlanet atmosphere={planet.atmosphere} water={planet.water} />
      </div>

      <div className="text-center mb-4">
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.82rem', color: '#7dd3fc', letterSpacing: '0.12em', lineHeight: 1.7, wordBreak: 'break-all' }}>
          {planet.name}
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: '0.82rem', color: '#334155', letterSpacing: '0.18em', marginTop: '4px' }}>
          ID: {idRef.current}
        </div>
      </div>

      <div className="w-full mb-4" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.55), transparent)' }} />

      <div className="space-y-2.5 mb-4">
        <AttrRow icon={<Wind size={12} />} label="大气层" value={planet.atmosphere} desc={atmoDesc[planet.atmosphere]} />
        <AttrRow icon={<Zap size={12} />} label="重力强度" value={planet.gravity} desc={gravityDesc[planet.gravity]} />
        <AttrRow icon={<Droplets size={12} />} label="水资源" value={planet.water} desc={waterDesc[planet.water]} />
      </div>

      <div className="w-full mb-4" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.4), transparent)' }} />

      <div
        className="p-4 flex-1"
        style={{
          background: 'rgba(12, 7, 35, 0.65)',
          border: '1px solid rgba(56,189,248,0.18)',
          boxShadow: 'inset 0 0 20px rgba(56,189,248,0.04)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={11} style={{ color: '#38bdf8' }} />
          <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.85rem', color: '#38bdf8', letterSpacing: '0.15em' }}>文明档案</span>
        </div>
        <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.85, fontWeight: 300 }}>
          {civDesc}
        </p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const ATMOSPHERE_OPTIONS = ['氮氧', '氦氖', '二氧化碳', '甲烷'];
const GRAVITY_OPTIONS = ['轻重力 0.3x', '标准 1x', '强重力 2x', '极重力 3x'];
const WATER_OPTIONS = ['海洋型', '沙漠型', '冰封型', '云海型'];

export default function App() {
  const [name, setName] = useState('');
  const [atmosphere, setAtmosphere] = useState(ATMOSPHERE_OPTIONS[0]);
  const [gravity, setGravity] = useState(GRAVITY_OPTIONS[1]);
  const [water, setWater] = useState(WATER_OPTIONS[0]);
  const [planet, setPlanet] = useState<PlanetData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [nameError, setNameError] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 700);
      return;
    }
    setGenerating(true);
    setPlanet(null);
    setTimeout(() => {
      setPlanet({ name: name.trim(), atmosphere, gravity, water });
      setCardKey(k => k + 1);
      setGenerating(false);
    }, 900);
  }, [name, atmosphere, gravity, water]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#03020f' }}>
      <Starfield />

      <div className="fixed pointer-events-none" style={{ top: '-8%', left: '-8%', width: '42vw', height: '42vw', background: 'radial-gradient(circle, rgba(88,28,135,0.10) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: '-12%', right: '-8%', width: '48vw', height: '48vw', background: 'radial-gradient(circle, rgba(12,74,110,0.12) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8 md:py-10">

        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Globe size={16} style={{ color: '#38bdf8' }} />
            <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(0.9rem, 2.8vw, 1.4rem)', color: '#f1f5f9', letterSpacing: '0.22em', textShadow: '0 0 18px rgba(56,189,248,0.55), 0 0 40px rgba(139,92,246,0.25)' }}>
              STELLAR PACT
            </h1>
            <Globe size={16} style={{ color: '#38bdf8' }} />
          </div>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#7dd3fc', letterSpacing: '0.38em' }}>
            认领你的星球
          </p>
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(28)].map((_, i) => (
              <div key={i} style={{ width: 3, height: 3, background: i % 4 === 0 ? '#6d28d9' : i % 4 === 1 ? '#0369a1' : i % 4 === 2 ? '#1e293b' : '#0f172a' }} />
            ))}
          </div>
        </div>

        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5 lg:gap-6">

          <div
            className="flex-1 p-5 md:p-7"
            style={{
              background: 'rgba(7, 3, 22, 0.82)',
              border: '1px solid rgba(109,40,217,0.3)',
              boxShadow: '0 0 32px rgba(109,40,217,0.08), inset 0 0 24px rgba(8,4,25,0.5)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: 6, height: 6, background: '#7c3aed' }} />
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.95rem', color: '#475569', letterSpacing: '0.2em' }}>星球配置终端</span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-1.5" style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                  <span className="inline-flex items-center gap-1.5"><Sparkles size={13} /> 星球名称</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                  placeholder="输入你的星球名..."
                  maxLength={20}
                  className="w-full px-4 py-2.5 focus:outline-none transition-all duration-200 placeholder:opacity-30"
                  style={{
                    background: 'rgba(12, 7, 32, 0.9)',
                    border: `1px solid ${nameError ? 'rgba(239,68,68,0.65)' : 'rgba(109,40,217,0.4)'}`,
                    boxShadow: nameError ? '0 0 14px rgba(239,68,68,0.25)' : '0 0 6px rgba(109,40,217,0.12)',
                    fontFamily: "'VT323', monospace",
                    fontSize: '1.15rem',
                    color: '#e2e8f0',
                    letterSpacing: '0.08em',
                    animation: nameError ? 'shake 0.35s ease' : 'none',
                  }}
                />
                {nameError && (
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: '0.82rem', color: '#ef4444', marginTop: '4px', letterSpacing: '0.05em' }}>
                    ▶ 请为你的星球命名
                  </p>
                )}
              </div>

              <PixelSelect label="大气层成分" icon={<Wind size={13} />} value={atmosphere} options={ATMOSPHERE_OPTIONS} onChange={setAtmosphere} />
              <PixelSelect label="重力强度" icon={<Zap size={13} />} value={gravity} options={GRAVITY_OPTIONS} onChange={setGravity} />
              <PixelSelect label="水资源分布" icon={<Droplets size={13} />} value={water} options={WATER_OPTIONS} onChange={setWater} />

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3.5 mt-1 relative overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: generating
                    ? 'rgba(67,20,107,0.5)'
                    : 'linear-gradient(135deg, rgba(88,28,135,0.92) 0%, rgba(12,74,110,0.92) 100%)',
                  border: '1px solid rgba(139,92,246,0.55)',
                  boxShadow: generating ? 'none' : '0 0 22px rgba(139,92,246,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.62rem',
                  color: '#f1f5f9',
                  letterSpacing: '0.1em',
                  cursor: generating ? 'wait' : 'pointer',
                }}
              >
                {!generating && (
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)', animation: 'shimmer 2.8s infinite' }} />
                )}
                {generating ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span style={{ animation: 'blink 0.65s step-end infinite' }}>▮</span> 生成中...
                  </span>
                ) : '生成我的星球'}
              </button>
            </div>

            <div className="flex justify-between mt-5 select-none">
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.7rem', color: '#1e1b4b', letterSpacing: '0.05em' }}>╔══╗</span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.7rem', color: '#1e1b4b', letterSpacing: '0.05em' }}>╔══╗</span>
            </div>
          </div>

          <div
            className="flex-1 p-5 md:p-7"
            style={{
              background: 'rgba(4, 2, 16, 0.78)',
              border: `1px solid ${planet ? 'rgba(56,189,248,0.25)' : 'rgba(30,41,59,0.4)'}`,
              boxShadow: planet ? '0 0 32px rgba(56,189,248,0.07)' : 'none',
              backdropFilter: 'blur(14px)',
              minHeight: 500,
              transition: 'border-color 0.5s, box-shadow 0.5s',
            }}
          >
            {planet ? (
              <div key={cardKey} className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 6, height: 6, background: '#0284c7' }} />
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.95rem', color: '#475569', letterSpacing: '0.2em' }}>星球档案</span>
                </div>
                <PlanetCard planet={planet} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center" style={{ minHeight: 420 }}>
                <div className="text-center">
                  <div style={{ fontSize: '4rem', opacity: 0.07, fontFamily: 'monospace' }}>◯</div>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#1e293b', letterSpacing: '0.18em', lineHeight: 2.2, marginTop: '12px' }}>
                    配置参数<br />点击生成<br />查看档案
                  </p>
                  <div className="flex justify-center gap-2.5 mt-5">
                    {[0, 0.4, 0.8].map((delay, i) => (
                      <div key={i} style={{ width: 5, height: 5, background: '#1e293b', animation: `blink 1.4s step-end ${delay}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-7 text-center select-none" style={{ fontFamily: "'VT323', monospace", fontSize: '0.75rem', color: '#1e293b', letterSpacing: '0.18em' }}>
          STELLAR PACT v0.1 · 宇宙星球登记系统 · 所有星球均受星际公约保护
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
