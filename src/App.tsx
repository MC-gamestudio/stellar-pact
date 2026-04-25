import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Globe, Wind, Droplets, ChevronDown, Zap, ArrowLeft, Star } from 'lucide-react';

// ─── Galaxy Data ───────────────────────────────────────────────────────────────

interface GalaxyData {
  id: string;
  name: string;
  type: string;
  dist: string;
  desc: string;
  hint: string;
  color: string;
  atmoHint?: string;
  gravHint?: string;
  waterHint?: string;
  atmoDefault?: string;
  gravDefault?: string;
  waterDefault?: string;
}

const GALAXIES: GalaxyData[] = [
  { id: 'MW-001', name: '银河系', type: '棒旋星系', dist: '我们在这里', color: '#3b82f6',
    desc: '初始区域，密度最高，新手起点，竞争激烈但邻居多。',
    hint: '适合热爱社交、从繁华起点开始的玩家',
    atmoHint: '银河系多样，任何大气层皆有可能', gravHint: '标准引力环境，适合各类生命形态', waterHint: '水资源分布均匀，自由选择' },
  { id: 'M31-002', name: '仙女座星系', type: '棒旋星系', dist: '254万光年', color: '#8b5cf6',
    desc: '第二大初始区域，跨星系外交网络起点，贸易往来最频繁。',
    hint: '适合想建立跨星系外交网络的玩家',
    atmoHint: '与银河系相似，氮氧大气最为常见', gravHint: '与银河系引力相近', waterHint: '海洋型分布广泛',
    atmoDefault: '氮氧', gravDefault: '标准 1x', waterDefault: '海洋型' },
  { id: 'M33-003', name: '三角座星系', type: '旋涡星系', dist: '270万光年', color: '#06b6d4',
    desc: '新兴星系，资源丰富但文明稀少，适合科技垄断。',
    hint: '适合喜欢独立发展的科技树玩家',
    atmoHint: '新生恒星多，氢气大气层常见', gravHint: '结构稀疏，轻重力星球居多', waterHint: '云海型分布广泛',
    atmoDefault: '氢气', gravDefault: '轻重力 0.5x', waterDefault: '云海型' },
  { id: 'LMC-004', name: '大麦哲伦云', type: '不规则星系', dist: '16万光年', color: '#f97316',
    desc: '辐射极强的极端环境区域，孕育特殊耐辐射生命形态。',
    hint: '适合想走极端路线的玩家',
    atmoHint: '高能粒子轰击，建议选择高能粒子大气', gravHint: '恒星密集，重力偏强', waterHint: '辐射蒸发水分，沙漠型为主',
    atmoDefault: '高能粒子', gravDefault: '强重力 2x', waterDefault: '沙漠型' },
  { id: 'SMC-005', name: '小麦哲伦云', type: '不规则星系', dist: '20万光年', color: '#eab308',
    desc: '重元素稀缺，但稀有矿产价值极高，天然贸易垄断区。',
    hint: '适合走贸易垄断路线的玩家',
    atmoHint: '金属丰度低，氦氖大气更适合早期宇宙环境', gravHint: '质量较小，轻重力为主', waterHint: '冰封型保存稀缺水资源',
    atmoDefault: '氦氖', gravDefault: '轻重力 0.3x', waterDefault: '冰封型' },
  { id: 'M87-006', name: '室女座A', type: '椭圆星系', dist: '5370万光年', color: '#ec4899',
    desc: '人类首张黑洞照片的拍摄地，时间在此流逝极慢。',
    hint: '适合想体验热寂终局的高级玩家',
    atmoHint: '黑洞喷流影响，高能等离子体大气', gravHint: '黑洞引力极强，极重力环境', waterHint: '极端环境下液态甲烷更稳定',
    atmoDefault: '等离子体', gravDefault: '极重力 3x', waterDefault: '液态甲烷海' },
  { id: 'M51-007', name: '涡状星系', type: '旋涡星系', dist: '2300万光年', color: '#10b981',
    desc: '双星系碰撞，大量新生星球可认领，但轨道不稳定。',
    hint: '适合喜欢高风险高回报的冒险型玩家',
    atmoHint: '恒星碰撞形成复杂混合大气', gravHint: '引力扰动剧烈，重力多变', waterHint: '碰撞产生丰富水资源',
    atmoDefault: '多层混合大气', gravDefault: '亚标准 0.8x', waterDefault: '超级海洋' },
  { id: 'NGC1300-008', name: 'NGC 1300', type: '棒旋星系', dist: '6100万光年', color: '#f59e0b',
    desc: '拥有宏伟对称棒状结构，中心资源丰富，外围安全。',
    hint: '适合喜欢策略性选择地理位置的玩家',
    atmoHint: '棒状结构使气体向中心汇聚，二氧化碳浓厚', gravHint: '中心强重力，外围轻重力', waterHint: '中心沙漠，外围海洋',
    atmoDefault: '二氧化碳', gravDefault: '强重力 1.5x', waterDefault: '沙漠型' },
  { id: 'M104-009', name: '草帽星系', type: '旋涡星系', dist: '2900万光年', color: '#6366f1',
    desc: '巨大尘埃盘遮蔽信息，深度扫描消耗能量极高。',
    hint: '适合情报战专家玩家',
    atmoHint: '尘埃盘导致特殊大气成分混合', gravHint: '核球明亮，中心引力偏强', waterHint: '尘埃干燥环境，沙漠型为主',
    atmoDefault: '硫化氢', gravDefault: '强重力 2x', waterDefault: '沙漠型' },
  { id: 'CW-010', name: '车轮星系', type: '环状星系', dist: '5亿光年', color: '#14b8a6',
    desc: '碰撞产生的环状结构，天然联盟防御要塞。',
    hint: '适合喜欢多人联盟战略的玩家',
    atmoHint: '环状冲击波形成氨气为主的大气', gravHint: '环状结构引力分布均匀', waterHint: '冲击波带来丰富云海',
    atmoDefault: '氨气', gravDefault: '标准 1x', waterDefault: '云海型' },
  { id: 'ANN-011', name: '触须星系', type: '碰撞星系对', dist: '4500万光年', color: '#ef4444',
    desc: '两个星系正在碰撞，冲突频发，战斗系数加成+30%。',
    hint: '适合喜欢冲突、愿意当反派的玩家',
    atmoHint: '碰撞激波产生高温等离子体大气', gravHint: '引力潮汐撕裂，极重力环境', waterHint: '高温环境，酸液海洋',
    atmoDefault: '等离子体', gravDefault: '极重力 3x', waterDefault: '酸液海洋' },
  { id: 'BUT-012', name: '蝴蝶星系', type: '并合星系', dist: '4亿光年', color: '#a855f7',
    desc: '双黑洞合并中，引力波使星际通讯有随机延迟。',
    hint: '适合喜欢不确定性随机事件的玩家',
    atmoHint: '双核引力波影响大气层稳定性', gravHint: '双黑洞区，超重力环境', waterHint: '引力波扰动，多相态水',
    atmoDefault: '多层混合大气', gravDefault: '超重力 5x', waterDefault: '多相态混合' },
  { id: 'M81-013', name: 'M81星系', type: '旋涡星系', dist: '1200万光年', color: '#0ea5e9',
    desc: '结构完整均衡，各类科技树发展无加减成，最公平起点。',
    hint: '适合第一次玩、想先熟悉规则的新手玩家',
    atmoHint: '标准星系，氮氧大气最为常见', gravHint: '标准引力环境', waterHint: '海洋与陆地均衡分布',
    atmoDefault: '氮氧', gravDefault: '标准 1x', waterDefault: '海洋型' },
  { id: 'NGC1569-014', name: 'NGC 1569', type: '不规则星系', dist: '1100万光年', color: '#f43f5e',
    desc: '恒星诞生率是银河系100倍，科技树研究速度+50%。',
    hint: '适合想快速发展科技的玩家',
    atmoHint: '超级恒星风将气体电离，高能粒子大气', gravHint: '强烈星系风，轻重力', waterHint: '恒星风蒸发水分，沙漠型',
    atmoDefault: '高能粒子', gravDefault: '轻重力 0.5x', waterDefault: '沙漠型' },
  { id: 'NGC4889-015', name: 'NGC 4889', type: '椭圆星系', dist: '3.36亿光年', color: '#7c3aed',
    desc: '已知最大黑洞之一，热寂终局的最佳发生地。',
    hint: '适合冲着热寂死亡、想看宇宙消亡的玩家',
    atmoHint: '超大质量黑洞区，等离子体大气', gravHint: '压碎级极端引力', waterHint: '极端压力下多相态混合',
    atmoDefault: '等离子体', gravDefault: '压碎级 10x', waterDefault: '多相态混合' },
  { id: 'CenA-016', name: '半人马座A', type: '椭圆星系', dist: '1300万光年', color: '#0891b2',
    desc: '最强射电源之一，喷流方向通讯范围翻倍。',
    hint: '适合建立超远程通讯网络的玩家',
    atmoHint: '射电喷流带来高能粒子大气', gravHint: '活跃星系核，强重力环境', waterHint: '高能环境，液态甲烷更稳定',
    atmoDefault: '高能粒子', gravDefault: '强重力 2x', waterDefault: '液态甲烷海' },
  { id: 'HEL-017', name: 'NGC 2685', type: '极环星系', dist: '4200万光年', color: '#059669',
    desc: '多平面结构与多维空间有联系，进入多维的最低门槛。',
    hint: '适合率先进入多维空间探索的技术型玩家',
    atmoHint: '多平面结构带来多层大气奇观', gravHint: '多平面引力抵消，微重力环境', waterHint: '多维水资源分布，云海型',
    atmoDefault: '多层混合大气', gravDefault: '微重力 0.1x', waterDefault: '云海型' },
  { id: 'REV-018', name: 'NGC 4622', type: '旋涡星系', dist: '1.11亿光年', color: '#d97706',
    desc: '旋臂方向与大多数星系相反，科技树路径颠覆常规。',
    hint: '适合第二次重开、想体验完全不同路线的老玩家',
    atmoHint: '反向旋转带来逆流大气，氩气为主', gravHint: '反向角动量使引力分布异常', waterHint: '反向演化，地下水脉为主',
    atmoDefault: '氩气', gravDefault: '亚标准 0.8x', waterDefault: '地下水脉' },
  { id: 'QCH-019', name: 'NGC 7603', type: '赛弗特星系', dist: '3.5亿光年', color: '#be185d',
    desc: '量子纠缠区，通讯可绕过能量消耗，但有泄露风险。',
    hint: '适合喜欢冒险、不介意信息泄露风险的玩家',
    atmoHint: '量子效应使大气成分随机叠加', gravHint: '量子引力效应，重力不确定', waterHint: '量子叠加态，水资源随机分布',
    atmoDefault: '多层混合大气', gravDefault: '亚标准 0.8x', waterDefault: '多相态混合' },
  { id: 'IC1101-020', name: 'IC 1101', type: '超巨椭圆星系', dist: '10.4亿光年', color: '#dc2626',
    desc: '已知最大星系，银河系60倍，终局最激烈的战场。',
    hint: '适合历经多次重开、寻求终极挑战的资深玩家',
    atmoHint: '超大星系汇聚所有大气类型', gravHint: '超大质量聚集，极重力区域', waterHint: '宇宙中最丰富的水资源集合',
    atmoDefault: '等离子体', gravDefault: '极重力 3x', waterDefault: '超级海洋' },
];

// ─── Options ──────────────────────────────────────────────────────────────────

const ATMOSPHERE_OPTIONS = ['氮氧', '氦氖', '二氧化碳', '甲烷', '氨气', '氢气', '硫化氢', '氩气', '高能粒子', '多层混合大气', '等离子体'];
const GRAVITY_OPTIONS = ['微重力 0.1x', '轻重力 0.3x', '轻重力 0.5x', '亚标准 0.8x', '标准 1x', '强重力 1.5x', '强重力 2x', '极重力 3x', '超重力 5x', '压碎级 10x'];
const WATER_OPTIONS = ['无水干燥', '地下水脉', '冰封型', '沙漠型', '云海型', '海洋型', '超级海洋', '酸液海洋', '液态甲烷海', '多相态混合'];

// ─── Planet Palettes ──────────────────────────────────────────────────────────

const getPlanetPalette = (atmo: string) => {
  const map: Record<string, { base: string; shine: string; detail: string; glow: string }> = {
    '氮氧': { base: '#1e3a8a', shine: '#3b82f6', detail: '#93c5fd', glow: '#60a5fa' },
    '氦氖': { base: '#6b21a8', shine: '#a855f7', detail: '#e879f9', glow: '#c026d3' },
    '二氧化碳': { base: '#7f1d1d', shine: '#dc2626', detail: '#fca5a5', glow: '#f97316' },
    '甲烷': { base: '#78350f', shine: '#d97706', detail: '#fcd34d', glow: '#f59e0b' },
    '氨气': { base: '#064e3b', shine: '#10b981', detail: '#6ee7b7', glow: '#34d399' },
    '氢气': { base: '#0c4a6e', shine: '#0ea5e9', detail: '#7dd3fc', glow: '#38bdf8' },
    '硫化氢': { base: '#713f12', shine: '#ca8a04', detail: '#fde68a', glow: '#facc15' },
    '氩气': { base: '#1e1b4b', shine: '#6366f1', detail: '#a5b4fc', glow: '#818cf8' },
    '高能粒子': { base: '#4c0519', shine: '#f43f5e', detail: '#fda4af', glow: '#fb7185' },
    '多层混合大气': { base: '#1a1a2e', shine: '#8b5cf6', detail: '#c4b5fd', glow: '#7c3aed' },
    '等离子体': { base: '#0f172a', shine: '#e879f9', detail: '#f0abfc', glow: '#d946ef' },
  };
  return map[atmo] ?? map['氮氧'];
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanetData {
  name: string;
  atmosphere: string;
  gravity: string;
  water: string;
  galaxy: GalaxyData;
}

// ─── Starfield ────────────────────────────────────────────────────────────────

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2, alpha: Math.random(),
      delta: (Math.random() - 0.5) * 0.007,
      color: Math.random() > 0.82 ? `hsl(${200 + Math.random() * 60}, 80%, 85%)` : 'white',
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Pixel Planet ─────────────────────────────────────────────────────────────

function PixelPlanet({ atmosphere, water }: { atmosphere: string; water: string }) {
  const pal = getPlanetPalette(atmosphere);
  const size = 160; const cx = size / 2; const cy = size / 2; const r = 62;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute rounded-full animate-pulse" style={{ width: r * 2 + 50, height: r * 2 + 50, background: `radial-gradient(circle, ${pal.glow}28 0%, transparent 70%)`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id={`pg-${atmosphere.replace(/\s/g, '')}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={pal.shine} />
            <stop offset="55%" stopColor={pal.base} />
            <stop offset="100%" stopColor={pal.base} stopOpacity="0.5" />
          </radialGradient>
          <clipPath id={`pc-${atmosphere.replace(/\s/g, '')}`}><circle cx={cx} cy={cy} r={r} /></clipPath>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill={`url(#pg-${atmosphere.replace(/\s/g, '')})`} />
        <g clipPath={`url(#pc-${atmosphere.replace(/\s/g, '')})`}>
          {water === '海洋型' || water === '超级海洋' ? <>
            <rect x={cx - 18} y={cy - 28} width={26} height={18} rx={2} fill={pal.detail} opacity={0.45} />
            <rect x={cx + 12} y={cy + 8} width={16} height={12} rx={2} fill={pal.detail} opacity={0.38} />
            <rect x={cx - 38} y={cy + 18} width={20} height={14} rx={2} fill={pal.detail} opacity={0.32} />
          </> : null}
          {water === '沙漠型' || water === '无水干燥' ? <>
            <rect x={cx - 45} y={cy - 38} width={90} height={76} fill={pal.detail} opacity={0.28} />
            <rect x={cx - 25} y={cy - 18} width={50} height={36} fill={pal.shine} opacity={0.18} />
          </> : null}
          {water === '冰封型' ? <>
            <rect x={cx - 45} y={cy - r + 4} width={90} height={24} rx={2} fill="white" opacity={0.5} />
            <rect x={cx - 35} y={cy + r - 26} width={70} height={20} rx={2} fill="white" opacity={0.42} />
          </> : null}
          {water === '云海型' || water === '多相态混合' ? [...Array(5)].map((_, i) => (
            <rect key={i} x={cx - 52 + i * 20} y={cy - 12 + (i % 2) * 18} width={26} height={9} rx={4} fill="white" opacity={0.22} />
          )) : null}
          {water === '酸液海洋' || water === '液态甲烷海' ? <>
            <rect x={cx - 40} y={cy + 10} width={80} height={30} fill={pal.glow} opacity={0.35} />
          </> : null}
          {water === '地下水脉' ? <>
            {[...Array(4)].map((_, i) => <rect key={i} x={cx - 30 + i * 15} y={cy + 20} width={3} height={25} fill={pal.detail} opacity={0.5} />)}
          </> : null}
        </g>
        <ellipse cx={cx - 20} cy={cy - 20} rx={15} ry={10} fill="white" opacity={0.16} />
        <ellipse cx={cx} cy={cy} rx={r + 16} ry={9} fill="none" stroke={pal.detail} strokeWidth={2.5} opacity={0.22} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={pal.glow} strokeWidth={1.5} opacity={0.55} />
      </svg>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

function PixelSelect({ label, icon, value, options, onChange, hint }: {
  label: string; icon: React.ReactNode; value: string; options: string[]; onChange: (v: string) => void; hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} className="relative w-full">
      <label className="block mb-1" style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
        <span className="inline-flex items-center gap-1.5">{icon} {label}</span>
      </label>
      {hint && <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: '0.7rem', color: '#7c3aed', lineHeight: 1.5, marginBottom: '4px', paddingLeft: '2px' }}>💡 {hint}</p>}
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 transition-all duration-200 focus:outline-none"
        style={{ background: 'rgba(15,10,40,0.85)', border: `1px solid ${open ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.35)'}`, boxShadow: open ? '0 0 14px rgba(139,92,246,0.35)' : '0 0 4px rgba(139,92,246,0.1)', fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#e2e8f0', letterSpacing: '0.08em' }}>
        <span>{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: '#a855f7' }} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-0.5 max-h-56 overflow-y-auto" style={{ background: 'rgba(8,3,24,0.98)', border: '1px solid rgba(139,92,246,0.5)', boxShadow: '0 8px 32px rgba(139,92,246,0.25)' }}>
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-4 py-2 transition-colors duration-150"
              style={{ fontFamily: "'VT323', monospace", fontSize: '1.05rem', color: opt === value ? '#c084fc' : '#cbd5e1', letterSpacing: '0.08em', borderBottom: '1px solid rgba(139,92,246,0.1)', background: opt === value ? 'rgba(88,28,135,0.25)' : 'transparent' }}
              onMouseEnter={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = 'rgba(88,28,135,0.2)'; }}
              onMouseLeave={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              {opt === value ? '▶ ' : '\u00A0\u00A0'}{opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Galaxy Card ──────────────────────────────────────────────────────────────

function GalaxyCard({ galaxy, onSelect }: { galaxy: GalaxyData; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      style={{ background: 'rgba(10,5,30,0.6)', border: `1px solid ${galaxy.color}30`, boxShadow: `0 0 12px ${galaxy.color}10` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${galaxy.color}70`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${galaxy.color}20`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${galaxy.color}30`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${galaxy.color}10`; }}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.55rem', color: galaxy.color, letterSpacing: '0.08em' }}>{galaxy.name}</span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.75rem', color: '#334155', marginLeft: '8px', letterSpacing: '0.1em' }}>{galaxy.id}</span>
        </div>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.7rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{galaxy.dist}</span>
      </div>
      <div className="flex gap-1.5 mb-1.5">
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.7rem', color: galaxy.color, background: `${galaxy.color}15`, padding: '1px 6px', borderRadius: '2px' }}>{galaxy.type}</span>
      </div>
      <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: '0.7rem', color: '#64748b', lineHeight: 1.5 }}>{galaxy.desc}</p>
    </button>
  );
}

// ─── Planet Card ──────────────────────────────────────────────────────────────

function PlanetCard({ planet }: { planet: PlanetData }) {
  const [visible, setVisible] = useState(false);
  const [civDesc, setCivDesc] = useState('正在扫描星球数据...');
  const [loading, setLoading] = useState(true);
  const idRef = useRef(Math.random().toString(36).slice(2, 8).toUpperCase());

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  useEffect(() => {
    setLoading(true);
    setCivDesc('正在扫描星球数据...');
    const generate = async () => {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `你是一个科幻世界的星球档案生成器。根据以下星球属性，生成一段60字以内的文明简介。要求：有文学感，参考《三体》《星际穿越》语言风格，不要幼稚，不要说"文明"两个字，直接描述这颗星球上的生命形态和它们的存在方式。只输出简介本身，不要任何前缀。

星系：${planet.galaxy.name}（${planet.galaxy.type}，${planet.galaxy.dist}）
大气层：${planet.atmosphere}
重力：${planet.gravity}
水资源：${planet.water}
星球名称：${planet.name}`
            }]
          })
        });
        const data = await response.json();
        const text = data.content?.[0]?.text ?? '这颗星球的密码尚待破译，宇宙在沉默中等待第一声呼唤。';
        setCivDesc(text);
      } catch {
        setCivDesc('这颗星球的密码尚待破译，宇宙在沉默中等待第一声呼唤。');
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [planet]);

  const pal = getPlanetPalette(planet.atmosphere);

  return (
    <div className="flex flex-col h-full" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(28px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
      <div className="flex justify-center mb-3"><PixelPlanet atmosphere={planet.atmosphere} water={planet.water} /></div>
      <div className="text-center mb-3">
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.75rem', color: '#7dd3fc', letterSpacing: '0.12em', lineHeight: 1.7, wordBreak: 'break-all' }}>{planet.name}</div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: '0.75rem', color: '#334155', letterSpacing: '0.15em', marginTop: '2px' }}>ID: {idRef.current} · {planet.galaxy.name}</div>
      </div>
      <div className="w-full mb-3" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.55), transparent)' }} />
      <div className="space-y-2 mb-3">
        {[
          { icon: <Wind size={11} />, label: '大气层', value: planet.atmosphere },
          { icon: <Zap size={11} />, label: '重力强度', value: planet.gravity },
          { icon: <Droplets size={11} />, label: '水资源', value: planet.water },
        ].map(({ icon, label, value }) => (
          <div key={label} className="px-3 py-2" style={{ background: 'rgba(10,5,30,0.5)', borderLeft: `2px solid ${pal.glow}80` }}>
            <div className="flex items-center gap-1.5">
              <span style={{ color: pal.glow }}>{icon}</span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.8rem', color: '#7c3aed', letterSpacing: '0.1em' }}>{label}</span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.9rem', color: '#e2e8f0', marginLeft: 'auto', letterSpacing: '0.06em' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full mb-3" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.4), transparent)' }} />
      <div className="p-4 flex-1" style={{ background: 'rgba(12,7,35,0.65)', border: '1px solid rgba(56,189,248,0.18)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={11} style={{ color: '#38bdf8' }} />
          <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.85rem', color: '#38bdf8', letterSpacing: '0.15em' }}>文明档案</span>
          {loading && <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.7rem', color: '#475569', animation: 'blink 0.8s step-end infinite' }}>▮ AI生成中</span>}
        </div>
        <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: '0.85rem', color: loading ? '#475569' : '#cbd5e1', lineHeight: 1.85, fontWeight: 300, fontStyle: loading ? 'italic' : 'normal' }}>{civDesc}</p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

type Step = 'galaxy' | 'planet';

export default function App() {
  const [step, setStep] = useState<Step>('galaxy');
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyData | null>(null);
  const [name, setName] = useState('');
  const [atmosphere, setAtmosphere] = useState(ATMOSPHERE_OPTIONS[0]);
  const [gravity, setGravity] = useState(GRAVITY_OPTIONS[4]);
  const [water, setWater] = useState(WATER_OPTIONS[5]);
  const [planet, setPlanet] = useState<PlanetData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [nameError, setNameError] = useState(false);
  const [search, setSearch] = useState('');

  const handleSelectGalaxy = useCallback((g: GalaxyData) => {
    setSelectedGalaxy(g);
    if (g.atmoDefault) setAtmosphere(g.atmoDefault);
    if (g.gravDefault) setGravity(g.gravDefault);
    if (g.waterDefault) setWater(g.waterDefault);
    setStep('planet');
  }, []);

  const handleGenerate = useCallback(() => {
    if (!name.trim()) { setNameError(true); setTimeout(() => setNameError(false), 700); return; }
    setGenerating(true); setPlanet(null);
    setTimeout(() => {
      setPlanet({ name: name.trim(), atmosphere, gravity, water, galaxy: selectedGalaxy! });
      setCardKey(k => k + 1); setGenerating(false);
    }, 900);
  }, [name, atmosphere, gravity, water, selectedGalaxy]);

  const filteredGalaxies = GALAXIES.filter(g => g.name.includes(search) || g.type.includes(search) || g.id.includes(search.toUpperCase()));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#03020f' }}>
      <Starfield />
      <div className="fixed pointer-events-none" style={{ top: '-8%', left: '-8%', width: '42vw', height: '42vw', background: 'radial-gradient(circle, rgba(88,28,135,0.10) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: '-12%', right: '-8%', width: '48vw', height: '48vw', background: 'radial-gradient(circle, rgba(12,74,110,0.12) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe size={16} style={{ color: '#38bdf8' }} />
            <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(0.8rem, 2.5vw, 1.3rem)', color: '#f1f5f9', letterSpacing: '0.22em', textShadow: '0 0 18px rgba(56,189,248,0.55)' }}>STELLAR PACT</h1>
            <Globe size={16} style={{ color: '#38bdf8' }} />
          </div>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#7dd3fc', letterSpacing: '0.35em' }}>
            {step === 'galaxy' ? '选择你的星系' : `在 ${selectedGalaxy?.name} 认领星球`}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
            <div style={{ width: 24, height: 1, background: step === 'planet' ? '#7c3aed' : '#1e293b' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: step === 'planet' ? '#7c3aed' : '#1e293b' }} />
          </div>
        </div>

        {/* ── Step 1: Galaxy Selection ── */}
        {step === 'galaxy' && (
          <div className="w-full max-w-5xl" style={{ background: 'rgba(7,3,22,0.82)', border: '1px solid rgba(109,40,217,0.3)', backdropFilter: 'blur(14px)', padding: '20px' }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={12} style={{ color: '#7c3aed' }} />
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.9rem', color: '#475569', letterSpacing: '0.2em' }}>宇宙星系登记处 · 选择一个星系认领你的星球</span>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索星系名称或类型..."
              className="w-full px-4 py-2 mb-4 focus:outline-none"
              style={{ background: 'rgba(12,7,32,0.9)', border: '1px solid rgba(109,40,217,0.3)', fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#e2e8f0', letterSpacing: '0.06em' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredGalaxies.map(g => <GalaxyCard key={g.id} galaxy={g} onSelect={() => handleSelectGalaxy(g)} />)}
            </div>
          </div>
        )}

        {/* ── Step 2: Planet Creation ── */}
        {step === 'planet' && selectedGalaxy && (
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5">
            {/* Form */}
            <div className="flex-1 p-5 md:p-6" style={{ background: 'rgba(7,3,22,0.82)', border: '1px solid rgba(109,40,217,0.3)', backdropFilter: 'blur(14px)' }}>
              <button onClick={() => { setStep('galaxy'); setPlanet(null); }} className="flex items-center gap-1.5 mb-4 transition-opacity hover:opacity-70"
                style={{ fontFamily: "'VT323', monospace", fontSize: '0.85rem', color: '#475569', letterSpacing: '0.1em' }}>
                <ArrowLeft size={12} /> 返回星系选择
              </button>
              {/* Galaxy badge */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2" style={{ background: `${selectedGalaxy.color}10`, border: `1px solid ${selectedGalaxy.color}30` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: selectedGalaxy.color }} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.85rem', color: selectedGalaxy.color, letterSpacing: '0.12em' }}>{selectedGalaxy.name}</span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em' }}>{selectedGalaxy.id} · {selectedGalaxy.dist}</span>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block mb-1" style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                    <span className="inline-flex items-center gap-1.5"><Sparkles size={13} /> 星球名称</span>
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                    placeholder="为你的星球命名..." maxLength={20} className="w-full px-4 py-2.5 focus:outline-none"
                    style={{ background: 'rgba(12,7,32,0.9)', border: `1px solid ${nameError ? 'rgba(239,68,68,0.65)' : 'rgba(109,40,217,0.4)'}`, fontFamily: "'VT323', monospace", fontSize: '1.15rem', color: '#e2e8f0', letterSpacing: '0.08em', animation: nameError ? 'shake 0.35s ease' : 'none' }} />
                  {nameError && <p style={{ fontFamily: "'VT323', monospace", fontSize: '0.8rem', color: '#ef4444', marginTop: '3px' }}>▶ 请为你的星球命名</p>}
                </div>

                <PixelSelect label="大气层成分" icon={<Wind size={13} />} value={atmosphere} options={ATMOSPHERE_OPTIONS} onChange={setAtmosphere} hint={selectedGalaxy.atmoHint} />
                <PixelSelect label="重力强度" icon={<Zap size={13} />} value={gravity} options={GRAVITY_OPTIONS} onChange={setGravity} hint={selectedGalaxy.gravHint} />
                <PixelSelect label="水资源分布" icon={<Droplets size={13} />} value={water} options={WATER_OPTIONS} onChange={setWater} hint={selectedGalaxy.waterHint} />

                <button onClick={handleGenerate} disabled={generating} className="w-full py-3.5 relative overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
                  style={{ background: generating ? 'rgba(67,20,107,0.5)' : 'linear-gradient(135deg, rgba(88,28,135,0.92) 0%, rgba(12,74,110,0.92) 100%)', border: '1px solid rgba(139,92,246,0.55)', fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', color: '#f1f5f9', letterSpacing: '0.1em', cursor: generating ? 'wait' : 'pointer' }}>
                  {generating ? <span className="inline-flex items-center justify-center gap-2"><span style={{ animation: 'blink 0.65s step-end infinite' }}>▮</span> 生成中...</span> : '生成我的星球'}
                </button>
              </div>
            </div>

            {/* Planet Card */}
            <div className="flex-1 p-5 md:p-6" style={{ background: 'rgba(4,2,16,0.78)', border: `1px solid ${planet ? 'rgba(56,189,248,0.25)' : 'rgba(30,41,59,0.4)'}`, backdropFilter: 'blur(14px)', minHeight: 500, transition: 'border-color 0.5s' }}>
              {planet ? (
                <div key={cardKey} className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div style={{ width: 6, height: 6, background: '#0284c7' }} />
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: '0.9rem', color: '#475569', letterSpacing: '0.2em' }}>星球档案</span>
                  </div>
                  <PlanetCard planet={planet} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center" style={{ minHeight: 420 }}>
                  <div className="text-center">
                    <div style={{ fontSize: '4rem', opacity: 0.07, fontFamily: 'monospace' }}>◯</div>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#1e293b', letterSpacing: '0.18em', lineHeight: 2.2, marginTop: '12px' }}>配置参数<br />点击生成<br />查看档案</p>
                    <div className="flex justify-center gap-2.5 mt-5">
                      {[0, 0.4, 0.8].map((delay, i) => <div key={i} style={{ width: 5, height: 5, background: '#1e293b', animation: `blink 1.4s step-end ${delay}s infinite` }} />)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center select-none" style={{ fontFamily: "'VT323', monospace", fontSize: '0.72rem', color: '#1e293b', letterSpacing: '0.18em' }}>
          STELLAR PACT v0.2 · 宇宙星球登记系统 · 所有星球均受星际公约保护
        </p>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
      `}</style>
    </div>
  );
}

