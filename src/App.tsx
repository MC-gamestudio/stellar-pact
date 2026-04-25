import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Globe, Wind, Droplets, ChevronDown, Zap, ArrowLeft, Star } from 'lucide-react';

// ─── Galaxy Data ───────────────────────────────────────────────────────────────

interface GalaxyData {
  id: string; name: string; type: string; dist: string;
  desc: string; hint: string; color: string; difficulty: '新手' | '进阶' | '高级' | '传说';
  atmoHint?: string; gravHint?: string; waterHint?: string;
  atmoDefault?: string; gravDefault?: string; waterDefault?: string;
}

const GALAXIES: GalaxyData[] = [
  { id: 'MW-001', name: '银河系', type: '棒旋星系', dist: '我们在这里', color: '#3b82f6', difficulty: '新手',
    desc: '初始区域，密度最高，新手起点，竞争激烈但邻居多。', hint: '适合热爱社交、从繁华起点开始的玩家',
    atmoHint: '银河系环境多样，任何大气层皆有可能存在', gravHint: '标准引力环境，适合各类生命形态演化', waterHint: '水资源分布均匀，自由选择最适合你的类型' },
  { id: 'M31-002', name: '仙女座星系', type: '棒旋星系', dist: '254万光年', color: '#8b5cf6', difficulty: '新手',
    desc: '第二大初始区域，跨星系外交网络起点，贸易往来最频繁。', hint: '适合想建立跨星系外交网络的玩家',
    atmoHint: '与银河系结构相似，氮氧大气最为常见', gravHint: '引力环境与银河系相近，标准重力为主', waterHint: '海洋型分布广泛，文明发展潜力极高',
    atmoDefault: '氮氧', gravDefault: '标准 1x', waterDefault: '海洋型' },
  { id: 'M33-003', name: '三角座星系', type: '旋涡星系', dist: '270万光年', color: '#06b6d4', difficulty: '新手',
    desc: '新兴星系，资源丰富但文明稀少，适合科技垄断。', hint: '适合喜欢独立发展的科技树玩家',
    atmoHint: '新生恒星活跃，氢气大气层在此星系极为常见', gravHint: '结构稀疏，轻重力星球居多，生命形态偏向漂浮型', waterHint: '云海型分布广泛，天空文明在此起源',
    atmoDefault: '氢气', gravDefault: '轻重力 0.5x', waterDefault: '云海型' },
  { id: 'LMC-004', name: '大麦哲伦云', type: '不规则星系', dist: '16万光年', color: '#f97316', difficulty: '进阶',
    desc: '辐射极强的极端环境区域，孕育特殊耐辐射生命形态。', hint: '适合想走极端路线的玩家',
    atmoHint: '高能粒子轰击持续不断，耐辐射大气层是生存关键', gravHint: '恒星密集区域，重力偏强，生命演化为矮壮型', waterHint: '辐射持续蒸发液态水，沙漠型地表为主要形态',
    atmoDefault: '高能粒子', gravDefault: '强重力 2x', waterDefault: '沙漠型' },
  { id: 'SMC-005', name: '小麦哲伦云', type: '不规则星系', dist: '20万光年', color: '#eab308', difficulty: '进阶',
    desc: '重元素稀缺，但稀有矿产价值极高，天然贸易垄断区。', hint: '适合走贸易垄断路线的玩家',
    atmoHint: '金属丰度极低，氦氖大气更契合早期宇宙的演化规律', gravHint: '星系质量较小，轻重力为主导，大气层易散逸', waterHint: '冰封型将珍贵水资源完整保存于星球深处',
    atmoDefault: '氦氖', gravDefault: '轻重力 0.3x', waterDefault: '冰封型' },
  { id: 'M87-006', name: '室女座A', type: '椭圆星系', dist: '5370万光年', color: '#ec4899', difficulty: '高级',
    desc: '人类首张黑洞照片的拍摄地，时间在此流逝极慢。', hint: '适合想体验热寂终局的高级玩家',
    atmoHint: '黑洞相对论喷流影响，等离子体大气能量极高', gravHint: '黑洞引力主导整个区域，极重力是常态', waterHint: '极端能量环境下，液态甲烷比水更稳定',
    atmoDefault: '等离子体', gravDefault: '极重力 3x', waterDefault: '液态甲烷海' },
  { id: 'M51-007', name: '涡状星系', type: '旋涡星系', dist: '2300万光年', color: '#10b981', difficulty: '进阶',
    desc: '双星系碰撞，大量新生星球可认领，但轨道不稳定。', hint: '适合喜欢高风险高回报的冒险型玩家',
    atmoHint: '星系碰撞激波形成复杂混合大气，成分不断变化', gravHint: '引力扰动剧烈，重力多变，轨道随时可能偏移', waterHint: '碰撞带来丰富水资源，超级海洋在此最为常见',
    atmoDefault: '多层混合大气', gravDefault: '亚标准 0.8x', waterDefault: '超级海洋' },
  { id: 'NGC1300-008', name: 'NGC 1300', type: '棒旋星系', dist: '6100万光年', color: '#f59e0b', difficulty: '进阶',
    desc: '宏伟对称棒状结构，中心资源丰富，外围相对安全。', hint: '适合喜欢策略性选择地理位置的玩家',
    atmoHint: '棒状引力结构将气体向中心汇聚，二氧化碳浓度极高', gravHint: '中心强重力，外围轻重力，选择位置决定命运', waterHint: '中心区域沙漠化，外围星球海洋资源丰富',
    atmoDefault: '二氧化碳', gravDefault: '强重力 1.5x', waterDefault: '沙漠型' },
  { id: 'M104-009', name: '草帽星系', type: '旋涡星系', dist: '2900万光年', color: '#6366f1', difficulty: '进阶',
    desc: '巨大尘埃盘遮蔽信息，深度扫描消耗能量极高。', hint: '适合情报战专家玩家',
    atmoHint: '尘埃盘导致多种大气成分混合，硫化氢在此含量偏高', gravHint: '明亮核球质量集中，中心引力偏强不利于低技术文明', waterHint: '尘埃干燥的外围环境，沙漠型地表主导',
    atmoDefault: '硫化氢', gravDefault: '强重力 2x', waterDefault: '沙漠型' },
  { id: 'CW-010', name: '车轮星系', type: '环状星系', dist: '5亿光年', color: '#14b8a6', difficulty: '进阶',
    desc: '碰撞产生的环状结构，天然联盟防御要塞。', hint: '适合喜欢多人联盟战略的玩家',
    atmoHint: '环状冲击波形成以氨气为主的大气层，独特而稳定', gravHint: '环状结构引力分布均匀，标准重力是生命演化温床', waterHint: '冲击波带来丰富云海资源，适合天空文明',
    atmoDefault: '氨气', gravDefault: '标准 1x', waterDefault: '云海型' },
  { id: 'ANN-011', name: '触须星系', type: '碰撞星系对', dist: '4500万光年', color: '#ef4444', difficulty: '高级',
    desc: '两个星系正在碰撞，冲突频发，战斗系数加成+30%。', hint: '适合喜欢冲突、愿意当反派的玩家',
    atmoHint: '碰撞激波产生高温等离子体大气，能量密度极高', gravHint: '引力潮汐持续撕裂，极重力环境考验一切生命', waterHint: '高温高压环境下，酸液海洋是最常见的液态形式',
    atmoDefault: '等离子体', gravDefault: '极重力 3x', waterDefault: '酸液海洋' },
  { id: 'BUT-012', name: '蝴蝶星系', type: '并合星系', dist: '4亿光年', color: '#a855f7', difficulty: '高级',
    desc: '双黑洞合并中，引力波使星际通讯有随机延迟。', hint: '适合喜欢不确定性随机事件的玩家',
    atmoHint: '双核引力波持续扰动大气层稳定性，多层混合是常态', gravHint: '双黑洞区域超重力为主，空间本身在此弯曲', waterHint: '引力波周期性扰动使水资源呈现多相态混合奇景',
    atmoDefault: '多层混合大气', gravDefault: '超重力 5x', waterDefault: '多相态混合' },
  { id: 'M81-013', name: 'M81星系', type: '旋涡星系', dist: '1200万光年', color: '#0ea5e9', difficulty: '新手',
    desc: '结构完整均衡，各类科技树发展无加减成，最公平起点。', hint: '适合第一次玩、想先熟悉规则的新手玩家',
    atmoHint: '标准旋涡星系，氮氧大气是最普遍的生命孕育环境', gravHint: '标准引力环境，生命演化最为自然顺畅', waterHint: '海洋与陆地均衡分布，生态多样性极高',
    atmoDefault: '氮氧', gravDefault: '标准 1x', waterDefault: '海洋型' },
  { id: 'NGC1569-014', name: 'NGC 1569', type: '不规则星系', dist: '1100万光年', color: '#f43f5e', difficulty: '进阶',
    desc: '恒星诞生率是银河系100倍，科技树研究速度+50%。', hint: '适合想快速发展科技的玩家',
    atmoHint: '超级恒星风将气体完全电离，高能粒子大气主导全域', gravHint: '强烈星系风持续推压，轻重力星球居多', waterHint: '持续恒星风蒸发液态水，沙漠型地表是生存现实',
    atmoDefault: '高能粒子', gravDefault: '轻重力 0.5x', waterDefault: '沙漠型' },
  { id: 'NGC4889-015', name: 'NGC 4889', type: '椭圆星系', dist: '3.36亿光年', color: '#7c3aed', difficulty: '传说',
    desc: '已知最大黑洞之一，热寂终局的最佳发生地。', hint: '适合冲着热寂死亡、想看宇宙消亡的玩家',
    atmoHint: '超大质量黑洞辐射将一切普通大气撕裂，等离子体唯一存在', gravHint: '压碎级极端引力，任何已知物质结构在此变形', waterHint: '极端压力与温度使物质相变，多相态混合是唯一形式',
    atmoDefault: '等离子体', gravDefault: '压碎级 10x', waterDefault: '多相态混合' },
  { id: 'CenA-016', name: '半人马座A', type: '椭圆星系', dist: '1300万光年', color: '#0891b2', difficulty: '高级',
    desc: '最强射电源之一，喷流方向通讯范围翻倍。', hint: '适合建立超远程通讯网络的玩家',
    atmoHint: '射电喷流带来持续高能粒子轰击，大气层能量密度极高', gravHint: '活跃星系核质量集中，强重力主导核心区域', waterHint: '高能环境下液态甲烷比水更稳定，甲烷海分布广泛',
    atmoDefault: '高能粒子', gravDefault: '强重力 2x', waterDefault: '液态甲烷海' },
  { id: 'HEL-017', name: 'NGC 2685', type: '极环星系', dist: '4200万光年', color: '#059669', difficulty: '高级',
    desc: '多平面结构与多维空间有联系，进入多维的最低门槛。', hint: '适合率先进入多维空间探索的技术型玩家',
    atmoHint: '多平面物质环带来多层大气奇观，混合大气充满未知', gravHint: '多平面引力相互抵消，产生罕见的微重力漂浮环境', waterHint: '多维水资源分布形成壮观云海，天空文明在此最发达',
    atmoDefault: '多层混合大气', gravDefault: '微重力 0.1x', waterDefault: '云海型' },
  { id: 'REV-018', name: 'NGC 4622', type: '旋涡星系', dist: '1.11亿光年', color: '#d97706', difficulty: '高级',
    desc: '旋臂方向与大多数星系相反，科技树路径颠覆常规。', hint: '适合第二次重开、想体验完全不同路线的老玩家',
    atmoHint: '反向旋转带来逆流大气，氩气在此成为最稳定的大气成分', gravHint: '反向角动量使引力分布异常，亚标准重力主导', waterHint: '反向演化使地下水脉成为主要水资源储存形式',
    atmoDefault: '氩气', gravDefault: '亚标准 0.8x', waterDefault: '地下水脉' },
  { id: 'QCH-019', name: 'NGC 7603', type: '赛弗特星系', dist: '3.5亿光年', color: '#be185d', difficulty: '传说',
    desc: '量子纠缠区，通讯可绕过能量消耗，但有泄露风险。', hint: '适合喜欢冒险、不介意信息泄露风险的玩家',
    atmoHint: '量子效应使大气成分随机叠加，多层混合是唯一确定的状态', gravHint: '量子引力效应使重力呈不确定性，亚标准为观测均值', waterHint: '量子叠加态使水资源呈现多相态混合的奇异景观',
    atmoDefault: '多层混合大气', gravDefault: '亚标准 0.8x', waterDefault: '多相态混合' },
  { id: 'IC1101-020', name: 'IC 1101', type: '超巨椭圆星系', dist: '10.4亿光年', color: '#dc2626', difficulty: '传说',
    desc: '已知最大星系，银河系60倍，终局最激烈的战场。', hint: '适合历经多次重开、寻求终极挑战的资深玩家',
    atmoHint: '超大星系汇聚宇宙中所有大气类型，等离子体能量最为强烈', gravHint: '超大质量聚集，极重力覆盖大部分区域', waterHint: '宇宙中水资源最丰富的区域，超级海洋蔚为壮观',
    atmoDefault: '等离子体', gravDefault: '极重力 3x', waterDefault: '超级海洋' },
];

const DIFFICULTY_COLORS = { '新手': '#10b981', '进阶': '#f59e0b', '高级': '#ef4444', '传说': '#a855f7' };

// ─── Options ──────────────────────────────────────────────────────────────────

const ATMOSPHERE_OPTIONS = ['氮氧','氦氖','二氧化碳','甲烷','氨气','氢气','硫化氢','氩气','高能粒子','多层混合大气','等离子体'];
const GRAVITY_OPTIONS = ['微重力 0.1x','轻重力 0.3x','轻重力 0.5x','亚标准 0.8x','标准 1x','强重力 1.5x','强重力 2x','极重力 3x','超重力 5x','压碎级 10x'];
const WATER_OPTIONS = ['无水干燥','地下水脉','冰封型','沙漠型','云海型','海洋型','超级海洋','酸液海洋','液态甲烷海','多相态混合'];

// ─── Planet palette + size by gravity ────────────────────────────────────────

const getPlanetPalette = (atmo: string) => {
  const map: Record<string, { base: string; shine: string; detail: string; glow: string; mid: string }> = {
    '氮氧':      { base:'#1a3a7a', shine:'#4a9eff', detail:'#93c5fd', glow:'#60a5fa', mid:'#2563eb' },
    '氦氖':      { base:'#5b1a9a', shine:'#c084fc', detail:'#e879f9', glow:'#a855f7', mid:'#7c3aed' },
    '二氧化碳':  { base:'#7f1d1d', shine:'#f87171', detail:'#fca5a5', glow:'#f97316', mid:'#dc2626' },
    '甲烷':      { base:'#713f12', shine:'#fbbf24', detail:'#fcd34d', glow:'#f59e0b', mid:'#d97706' },
    '氨气':      { base:'#064e3b', shine:'#34d399', detail:'#6ee7b7', glow:'#10b981', mid:'#059669' },
    '氢气':      { base:'#0c4a6e', shine:'#38bdf8', detail:'#7dd3fc', glow:'#0ea5e9', mid:'#0284c7' },
    '硫化氢':    { base:'#713f12', shine:'#facc15', detail:'#fde68a', glow:'#eab308', mid:'#ca8a04' },
    '氩气':      { base:'#1e1b4b', shine:'#818cf8', detail:'#a5b4fc', glow:'#6366f1', mid:'#4f46e5' },
    '高能粒子':  { base:'#4c0519', shine:'#fb7185', detail:'#fda4af', glow:'#f43f5e', mid:'#e11d48' },
    '多层混合大气':{ base:'#1a1a2e', shine:'#c4b5fd', detail:'#ddd6fe', glow:'#8b5cf6', mid:'#7c3aed' },
    '等离子体':  { base:'#0f172a', shine:'#f0abfc', detail:'#f5d0fe', glow:'#d946ef', mid:'#a21caf' },
  };
  return map[atmo] ?? map['氮氧'];
};

const getGravityScale = (grav: string) => {
  const map: Record<string, { r: number; scaleY: number }> = {
    '微重力 0.1x': { r: 52, scaleY: 1.08 },
    '轻重力 0.3x': { r: 55, scaleY: 1.05 },
    '轻重力 0.5x': { r: 57, scaleY: 1.04 },
    '亚标准 0.8x': { r: 60, scaleY: 1.02 },
    '标准 1x':     { r: 62, scaleY: 1.00 },
    '强重力 1.5x': { r: 65, scaleY: 0.96 },
    '强重力 2x':   { r: 67, scaleY: 0.93 },
    '极重力 3x':   { r: 70, scaleY: 0.88 },
    '超重力 5x':   { r: 73, scaleY: 0.83 },
    '压碎级 10x':  { r: 76, scaleY: 0.76 },
  };
  return map[grav] ?? { r: 62, scaleY: 1.0 };
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanetData { name: string; atmosphere: string; gravity: string; water: string; galaxy: GalaxyData; }

// ─── Starfield ────────────────────────────────────────────────────────────────

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2, alpha: Math.random(),
      delta: (Math.random() - 0.5) * 0.006,
      color: Math.random() > 0.82 ? `hsl(${200 + Math.random() * 60},80%,85%)` : 'white',
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.delta; if (s.alpha <= 0.02 || s.alpha >= 1) s.delta *= -1;
        ctx.globalAlpha = Math.max(0.02, Math.min(1, s.alpha));
        ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }); ctx.globalAlpha = 1; raf = requestAnimationFrame(draw);
    };
    draw(); return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Pixel Planet (improved) ──────────────────────────────────────────────────

function PixelPlanet({ atmosphere, water, gravity }: { atmosphere: string; water: string; gravity: string }) {
  const pal = getPlanetPalette(atmosphere);
  const { r, scaleY } = getGravityScale(gravity);
  const size = 180; const cx = size / 2; const cy = size / 2;
  const ry = r * scaleY;
  const uid = `${atmosphere.slice(0,2)}${water.slice(0,2)}`.replace(/\s/g,'');

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow aura */}
      <div className="absolute rounded-full" style={{ width: r*2+60, height: r*2+60, background: `radial-gradient(circle, ${pal.glow}22 0%, transparent 68%)`, top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'pulse 3s ease-in-out infinite' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow:'visible' }}>
        <defs>
          {/* Base sphere gradient */}
          <radialGradient id={`base-${uid}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={pal.shine} stopOpacity="0.95"/>
            <stop offset="40%" stopColor={pal.mid} stopOpacity="0.9"/>
            <stop offset="75%" stopColor={pal.base} stopOpacity="0.95"/>
            <stop offset="100%" stopColor={pal.base} stopOpacity="0.6"/>
          </radialGradient>
          {/* Shadow overlay */}
          <radialGradient id={`shadow-${uid}`} cx="70%" cy="72%" r="55%">
            <stop offset="0%" stopColor="#000010" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#000010" stopOpacity="0"/>
          </radialGradient>
          {/* Atmosphere rim */}
          <radialGradient id={`rim-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="transparent"/>
            <stop offset="88%" stopColor={pal.glow} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={pal.glow} stopOpacity="0.35"/>
          </radialGradient>
          <clipPath id={`clip-${uid}`}><ellipse cx={cx} cy={cy} rx={r} ry={ry}/></clipPath>
        </defs>

        {/* Orbital ring */}
        <ellipse cx={cx} cy={cy} rx={r+22} ry={9} fill="none" stroke={pal.detail} strokeWidth={2} opacity={0.18} transform={`rotate(-18,${cx},${cy})`}/>

        {/* Planet body */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#base-${uid})`}/>

        {/* Surface details by water type */}
        <g clipPath={`url(#clip-${uid})`}>
          {(water === '海洋型' || water === '超级海洋') && <>
            {/* Continents */}
            <ellipse cx={cx-14} cy={cy-18} rx={18} ry={12} fill={pal.detail} opacity={0.38} transform={`rotate(-15,${cx-14},${cy-18})`}/>
            <ellipse cx={cx+18} cy={cy+10} rx={12} ry={8} fill={pal.detail} opacity={0.32}/>
            <ellipse cx={cx-22} cy={cy+16} rx={10} ry={7} fill={pal.detail} opacity={0.28}/>
            {/* Ocean shimmer lines */}
            {[0,1,2].map(i=><line key={i} x1={cx-r+8} y1={cy+4+i*8} x2={cx+r-8} y2={cy+6+i*8} stroke={pal.shine} strokeWidth={0.8} opacity={0.12}/>)}
          </>}
          {(water === '沙漠型' || water === '无水干燥') && <>
            {/* Crack lines */}
            {[[-20,-25,10,15],[15,-10,-5,28],[0,5,-25,20],[20,10,5,-15]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={cx+x1} y1={cy+y1} x2={cx+x2} y2={cy+y2} stroke={pal.shine} strokeWidth={1.2} opacity={0.22}/>
            ))}
            <ellipse cx={cx+5} cy={cy-8} rx={20} ry={12} fill={pal.detail} opacity={0.14}/>
          </>}
          {water === '冰封型' && <>
            {/* Polar caps */}
            <ellipse cx={cx} cy={cy-ry+8} rx={r*0.65} ry={14} fill="white" opacity={0.52}/>
            <ellipse cx={cx} cy={cy+ry-8} rx={r*0.5} ry={11} fill="white" opacity={0.42}/>
            {/* Ice cracks */}
            {[[-8,4,12,-18],[10,-5,-14,8]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={cx+x1} y1={cy-ry+18+i*6} x2={cx+x2} y2={cy-ry+22+i*6} stroke="white" strokeWidth={0.8} opacity={0.35}/>
            ))}
          </>}
          {(water === '云海型' || water === '多相态混合') && <>
            {/* Swirling cloud bands */}
            {[-16,-4,8,20].map((dy,i)=>(
              <ellipse key={i} cx={cx+(i%2===0?4:-4)} cy={cy+dy} rx={r-4} ry={5+i} fill="white" opacity={0.10+(i*0.025)}/>
            ))}
            {/* Vortex hint */}
            <ellipse cx={cx-10} cy={cy-8} rx={10} ry={7} fill="white" opacity={0.13} transform={`rotate(-30,${cx-10},${cy-8})`}/>
          </>}
          {(water === '酸液海洋') && <>
            <ellipse cx={cx} cy={cy+12} rx={r-4} ry={16} fill={pal.glow} opacity={0.28}/>
            {[0,1,2].map(i=><ellipse key={i} cx={cx-15+i*15} cy={cy+5+i*4} rx={6} ry={3} fill={pal.shine} opacity={0.18}/>)}
          </>}
          {water === '액态甲烷海' && <>
            <ellipse cx={cx} cy={cy+14} rx={r-6} ry={14} fill={pal.mid} opacity={0.35}/>
          </>}
          {water === '地下水脉' && <>
            {[-20,-8,8,20].map((dx,i)=>(
              <line key={i} x1={cx+dx} y1={cy+10} x2={cx+dx+(i%2===0?3:-3)} y2={cy+ry-4} stroke={pal.detail} strokeWidth={1.5} opacity={0.3}/>
            ))}
          </>}
        </g>

        {/* Shadow overlay for 3D depth */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#shadow-${uid})`}/>

        {/* Specular highlight */}
        <ellipse cx={cx-r*0.28} cy={cy-ry*0.28} rx={r*0.22} ry={ry*0.15} fill="white" opacity={0.22}/>
        <ellipse cx={cx-r*0.32} cy={cy-ry*0.32} rx={r*0.08} ry={ry*0.06} fill="white" opacity={0.45}/>

        {/* Atmosphere rim glow */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#rim-${uid})`}/>

        {/* Outer glow ring */}
        <ellipse cx={cx} cy={cy} rx={r+1} ry={ry+1} fill="none" stroke={pal.glow} strokeWidth={2} opacity={0.4}/>
      </svg>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

function PixelSelect({ label, icon, value, options, onChange, galaxyHint, challengeHint }: {
  label: string; icon: React.ReactNode; value: string; options: string[];
  onChange: (v: string) => void; galaxyHint?: string; challengeHint?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative w-full">
      <label className="block mb-1" style={{ fontFamily:"'VT323',monospace", fontSize:'1rem', color:'#94a3b8', letterSpacing:'0.05em' }}>
        <span className="inline-flex items-center gap-1.5">{icon} {label}</span>
      </label>
      {/* Line 1: galaxy environment context */}
      {galaxyHint && <p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.72rem', color:'#64748b', lineHeight:1.5, marginBottom:'3px', paddingLeft:'2px' }}>{galaxyHint}</p>}
      {/* Line 2: player agency prompt */}
      {challengeHint && <p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.72rem', color:'#7c3aed', lineHeight:1.5, marginBottom:'5px', paddingLeft:'2px' }}>{challengeHint}</p>}
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 transition-all duration-200 focus:outline-none"
        style={{ background:'rgba(15,10,40,0.85)', border:`1px solid ${open?'rgba(139,92,246,0.7)':'rgba(139,92,246,0.35)'}`, boxShadow: open?'0 0 14px rgba(139,92,246,0.35)':'0 0 4px rgba(139,92,246,0.1)', fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.95rem', color:'#e2e8f0', letterSpacing:'0.04em', fontWeight:300 }}>
        <span>{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open?'rotate-180':''}`} style={{ color:'#a855f7' }}/>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-0.5 max-h-56 overflow-y-auto" style={{ background:'rgba(8,3,24,0.98)', border:'1px solid rgba(139,92,246,0.5)', boxShadow:'0 8px 32px rgba(139,92,246,0.25)' }}>
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-4 py-2 transition-colors duration-150"
              style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.9rem', color:opt===value?'#c084fc':'#cbd5e1', letterSpacing:'0.03em', fontWeight:300, borderBottom:'1px solid rgba(139,92,246,0.1)', background:opt===value?'rgba(88,28,135,0.25)':'transparent' }}
              onMouseEnter={e=>{if(opt!==value)(e.currentTarget as HTMLElement).style.background='rgba(88,28,135,0.2)';}}
              onMouseLeave={e=>{if(opt!==value)(e.currentTarget as HTMLElement).style.background='transparent';}}>
              {opt===value?'▶ ':'\u00A0\u00A0'}{opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Galaxy Card (improved) ───────────────────────────────────────────────────

function GalaxyCard({ galaxy, onSelect }: { galaxy: GalaxyData; onSelect: () => void }) {
  const diffColor = DIFFICULTY_COLORS[galaxy.difficulty];
  const isFeatured = galaxy.difficulty === '新手';
  return (
    <button onClick={onSelect} className="w-full text-left p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
      style={{ background:`linear-gradient(135deg, rgba(10,5,30,0.7) 0%, rgba(${galaxy.color.slice(1).match(/../g)?.map(h=>parseInt(h,16)).join(',')},0.06) 100%)`, border:`1px solid ${galaxy.color}25`, boxShadow:`0 0 16px ${galaxy.color}08`, position:'relative', overflow:'hidden' }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.border=`1px solid ${galaxy.color}55`;(e.currentTarget as HTMLElement).style.boxShadow=`0 0 24px ${galaxy.color}18`;}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.border=`1px solid ${galaxy.color}25`;(e.currentTarget as HTMLElement).style.boxShadow=`0 0 16px ${galaxy.color}08`;}}>
      {/* Color accent bar */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:galaxy.color, opacity:0.7 }}/>
      <div className="flex items-start justify-between gap-2 mb-2 pl-2">
        <div>
          {/* Galaxy name - larger and clearer */}
          <div style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'1rem', fontWeight:500, color:'#f1f5f9', marginBottom:'2px', letterSpacing:'0.02em' }}>{galaxy.name}</div>
          <div style={{ fontFamily:"'VT323',monospace", fontSize:'0.72rem', color:'#334155', letterSpacing:'0.12em' }}>{galaxy.id}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.68rem', color:'#475569' }}>{galaxy.dist}</span>
          <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.68rem', color:diffColor, background:`${diffColor}18`, padding:'1px 7px', borderRadius:'3px', fontWeight:500 }}>{galaxy.difficulty}</span>
        </div>
      </div>
      <div className="pl-2">
        <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.7rem', color:galaxy.color, background:`${galaxy.color}12`, padding:'1px 8px', borderRadius:'2px', marginBottom:'6px', display:'inline-block' }}>{galaxy.type}</span>
        <p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.75rem', color:'#64748b', lineHeight:1.55, marginTop:'5px', fontWeight:300 }}>{galaxy.desc}</p>
      </div>
      {isFeatured && <div style={{ position:'absolute', top:8, right:8, fontFamily:"'VT323',monospace", fontSize:'0.65rem', color:'#10b981', letterSpacing:'0.08em' }}>推荐起点</div>}
    </button>
  );
}

// ─── Planet Card ──────────────────────────────────────────────────────────────

function PlanetCard({ planet }: { planet: PlanetData }) {
  const [visible, setVisible] = useState(false);
  const [civDesc, setCivDesc] = useState('正在解析星球数据...');
  const [loading, setLoading] = useState(true);
  const idRef = useRef(Math.random().toString(36).slice(2,8).toUpperCase());
  const pal = getPlanetPalette(planet.atmosphere);

  useEffect(() => { const t = setTimeout(()=>setVisible(true),60); return ()=>clearTimeout(t); }, []);

  useEffect(() => {
    setLoading(true); setCivDesc('正在解析星球数据...');
    const go = async () => {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, messages:[{ role:'user', content:`你是一个科幻宇宙的星球档案生成器。根据以下属性，写一段55字以内的文明简介。要求：参考《三体》语言风格，有诗意，有张力，直接描述这颗星球上生命的存在方式，不要出现"文明"二字，不要有前缀说明，只输出正文。\n\n星系：${planet.galaxy.name}（${planet.galaxy.type}，${planet.galaxy.dist}）\n大气层：${planet.atmosphere}\n重力：${planet.gravity}\n水资源：${planet.water}\n星球名：${planet.name}` }] })
        });
        const data = await res.json();
        setCivDesc(data.content?.[0]?.text ?? '这颗星球的密码尚待破译，宇宙在沉默中等待第一声呼唤。');
      } catch { setCivDesc('这颗星球的密码尚待破译，宇宙在沉默中等待第一声呼唤。'); }
      finally { setLoading(false); }
    };
    go();
  }, [planet]);

  return (
    <div className="flex flex-col h-full" style={{ opacity:visible?1:0, transform:visible?'translateX(0)':'translateX(28px)', transition:'opacity 0.45s ease, transform 0.45s ease' }}>
      <div className="flex justify-center mb-3">
        <PixelPlanet atmosphere={planet.atmosphere} water={planet.water} gravity={planet.gravity}/>
      </div>
      <div className="text-center mb-3">
        <div style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'1.1rem', fontWeight:500, color:'#7dd3fc', letterSpacing:'0.08em', wordBreak:'break-all' }}>{planet.name}</div>
        <div style={{ fontFamily:"'VT323',monospace", fontSize:'0.75rem', color:'#334155', letterSpacing:'0.15em', marginTop:'3px' }}>ID: {idRef.current} · {planet.galaxy.name}</div>
      </div>
      <div className="w-full mb-3" style={{ height:'1px', background:'linear-gradient(to right,transparent,rgba(139,92,246,0.5),transparent)' }}/>
      <div className="space-y-2 mb-3">
        {[{icon:<Wind size={11}/>, label:'大气层', value:planet.atmosphere},{icon:<Zap size={11}/>, label:'重力强度', value:planet.gravity},{icon:<Droplets size={11}/>, label:'水资源', value:planet.water}].map(({icon,label,value})=>(
          <div key={label} className="px-3 py-2 flex items-center gap-2" style={{ background:'rgba(10,5,30,0.5)', borderLeft:`2px solid ${pal.glow}80` }}>
            <span style={{ color:pal.glow }}>{icon}</span>
            <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.75rem', color:'#7c3aed', fontWeight:400 }}>{label}</span>
            <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.85rem', color:'#e2e8f0', marginLeft:'auto', fontWeight:300 }}>{value}</span>
          </div>
        ))}
      </div>
      <div className="w-full mb-3" style={{ height:'1px', background:'linear-gradient(to right,transparent,rgba(56,189,248,0.35),transparent)' }}/>
      <div className="p-4 flex-1" style={{ background:'rgba(12,7,35,0.65)', border:'1px solid rgba(56,189,248,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={11} style={{ color:'#38bdf8' }}/>
          <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.8rem', color:'#38bdf8', fontWeight:400, letterSpacing:'0.08em' }}>文明档案</span>
          {loading && <span style={{ fontFamily:"'VT323',monospace", fontSize:'0.7rem', color:'#475569', animation:'blink 0.8s step-end infinite' }}>▮ AI解析中</span>}
        </div>
        <p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.875rem', color:loading?'#475569':'#cbd5e1', lineHeight:1.9, fontWeight:300, fontStyle:loading?'italic':'normal' }}>{civDesc}</p>
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
    if (!name.trim()) { setNameError(true); setTimeout(()=>setNameError(false),700); return; }
    setGenerating(true); setPlanet(null);
    setTimeout(() => { setPlanet({ name:name.trim(), atmosphere, gravity, water, galaxy:selectedGalaxy! }); setCardKey(k=>k+1); setGenerating(false); }, 900);
  }, [name, atmosphere, gravity, water, selectedGalaxy]);

  const filtered = GALAXIES.filter(g => g.name.includes(search)||g.type.includes(search)||g.id.toUpperCase().includes(search.toUpperCase())||g.difficulty.includes(search));

  const challengeHint = selectedGalaxy
    ? `已根据${selectedGalaxy.name}星系环境预设重力/大气/水资源。顺从设定，还是偏离轨道——挑战更奇妙的未知世界？`
    : undefined;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background:'#03020f' }}>
      <Starfield/>
      <div className="fixed pointer-events-none" style={{ top:'-8%',left:'-8%',width:'42vw',height:'42vw',background:'radial-gradient(circle,rgba(88,28,135,0.10) 0%,transparent 70%)',borderRadius:'50%',zIndex:0 }}/>
      <div className="fixed pointer-events-none" style={{ bottom:'-12%',right:'-8%',width:'48vw',height:'48vw',background:'radial-gradient(circle,rgba(12,74,110,0.12) 0%,transparent 70%)',borderRadius:'50%',zIndex:0 }}/>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe size={16} style={{ color:'#38bdf8' }}/>
            <h1 style={{ fontFamily:"'Press Start 2P',monospace", fontSize:'clamp(0.8rem,2.5vw,1.3rem)', color:'#f1f5f9', letterSpacing:'0.22em', textShadow:'0 0 18px rgba(56,189,248,0.55)' }}>STELLAR PACT</h1>
            <Globe size={16} style={{ color:'#38bdf8' }}/>
          </div>
          <p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.9rem', color:'#7dd3fc', letterSpacing:'0.25em', fontWeight:300 }}>
            {step==='galaxy' ? '选择你的星系' : `在 ${selectedGalaxy?.name} 认领星球`}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div style={{ width:8,height:8,borderRadius:'50%',background:'#7c3aed' }}/>
            <div style={{ width:28,height:1,background:step==='planet'?'#7c3aed':'#1e293b',transition:'background 0.4s' }}/>
            <div style={{ width:8,height:8,borderRadius:'50%',background:step==='planet'?'#7c3aed':'#1e293b',transition:'background 0.4s' }}/>
          </div>
        </div>

        {/* Step 1: Galaxy */}
        {step === 'galaxy' && (
          <div className="w-full max-w-5xl" style={{ background:'rgba(7,3,22,0.82)', border:'1px solid rgba(109,40,217,0.3)', backdropFilter:'blur(14px)', padding:'20px' }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={12} style={{ color:'#7c3aed' }}/>
              <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.8rem', color:'#475569', letterSpacing:'0.12em', fontWeight:300 }}>宇宙星系登记处 · 选择一个星系，开始你的文明之旅</span>
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索星系名称、类型或难度..."
              className="w-full px-4 py-2.5 mb-5 focus:outline-none"
              style={{ background:'rgba(12,7,32,0.9)', border:'1px solid rgba(109,40,217,0.3)', fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.9rem', color:'#e2e8f0', letterSpacing:'0.04em', fontWeight:300 }}/>
            {/* Difficulty legend */}
            <div className="flex gap-4 mb-4">
              {Object.entries(DIFFICULTY_COLORS).map(([d,c])=>(
                <div key={d} className="flex items-center gap-1.5">
                  <div style={{ width:8,height:8,borderRadius:'50%',background:c }}/>
                  <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.72rem', color:c, fontWeight:400 }}>{d}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filtered.map(g=><GalaxyCard key={g.id} galaxy={g} onSelect={()=>handleSelectGalaxy(g)}/>)}
            </div>
          </div>
        )}

        {/* Step 2: Planet */}
        {step === 'planet' && selectedGalaxy && (
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5">
            <div className="flex-1 p-5 md:p-6" style={{ background:'rgba(7,3,22,0.82)', border:'1px solid rgba(109,40,217,0.3)', backdropFilter:'blur(14px)' }}>
              <button onClick={()=>{setStep('galaxy');setPlanet(null);}} className="flex items-center gap-1.5 mb-4 transition-opacity hover:opacity-70"
                style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.78rem', color:'#475569', letterSpacing:'0.08em', fontWeight:300 }}>
                <ArrowLeft size={12}/> 返回星系选择
              </button>
              <div className="flex items-center gap-2 mb-4 px-3 py-2" style={{ background:`${selectedGalaxy.color}10`, border:`1px solid ${selectedGalaxy.color}30` }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:selectedGalaxy.color }}/>
                <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.9rem', fontWeight:500, color:selectedGalaxy.color }}>{selectedGalaxy.name}</span>
                <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.72rem', color:'#475569', fontWeight:300 }}>{selectedGalaxy.id} · {selectedGalaxy.dist}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1" style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.85rem', color:'#94a3b8', letterSpacing:'0.05em', fontWeight:300 }}>
                    <span className="inline-flex items-center gap-1.5"><Sparkles size={13}/> 星球名称</span>
                  </label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleGenerate()}
                    placeholder="为你的星球命名..." maxLength={20} className="w-full px-4 py-2.5 focus:outline-none"
                    style={{ background:'rgba(12,7,32,0.9)', border:`1px solid ${nameError?'rgba(239,68,68,0.65)':'rgba(109,40,217,0.4)'}`, fontFamily:"'Noto Sans SC',sans-serif", fontSize:'1rem', color:'#e2e8f0', letterSpacing:'0.06em', fontWeight:300, animation:nameError?'shake 0.35s ease':'none' }}/>
                  {nameError&&<p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.78rem', color:'#ef4444', marginTop:'3px' }}>▶ 请为你的星球命名</p>}
                </div>
                <PixelSelect label="大气层成分" icon={<Wind size={13}/>} value={atmosphere} options={ATMOSPHERE_OPTIONS} onChange={setAtmosphere}
                  galaxyHint={selectedGalaxy.atmoHint} challengeHint={challengeHint}/>
                <PixelSelect label="重力强度" icon={<Zap size={13}/>} value={gravity} options={GRAVITY_OPTIONS} onChange={setGravity}
                  galaxyHint={selectedGalaxy.gravHint}/>
                <PixelSelect label="水资源分布" icon={<Droplets size={13}/>} value={water} options={WATER_OPTIONS} onChange={setWater}
                  galaxyHint={selectedGalaxy.waterHint}/>
                <button onClick={handleGenerate} disabled={generating} className="w-full py-3.5 relative overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
                  style={{ background:generating?'rgba(67,20,107,0.5)':'linear-gradient(135deg,rgba(88,28,135,0.92) 0%,rgba(12,74,110,0.92) 100%)', border:'1px solid rgba(139,92,246,0.55)', fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.9rem', fontWeight:400, color:'#f1f5f9', letterSpacing:'0.12em', cursor:generating?'wait':'pointer' }}>
                  {generating?<span className="inline-flex items-center justify-center gap-2"><span style={{ animation:'blink 0.65s step-end infinite' }}>▮</span> 正在生成...</span>:'生成我的星球'}
                </button>
              </div>
            </div>
            <div className="flex-1 p-5 md:p-6" style={{ background:'rgba(4,2,16,0.78)', border:`1px solid ${planet?'rgba(56,189,248,0.25)':'rgba(30,41,59,0.4)'}`, backdropFilter:'blur(14px)', minHeight:500, transition:'border-color 0.5s' }}>
              {planet ? (
                <div key={cardKey} className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div style={{ width:6,height:6,background:'#0284c7' }}/>
                    <span style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.8rem', color:'#475569', letterSpacing:'0.12em', fontWeight:300 }}>星球档案</span>
                  </div>
                  <PlanetCard planet={planet}/>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center" style={{ minHeight:420 }}>
                  <div className="text-center">
                    <div style={{ fontSize:'4rem', opacity:0.07, fontFamily:'monospace' }}>◯</div>
                    <p style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.85rem', color:'#1e293b', letterSpacing:'0.15em', lineHeight:2.4, marginTop:'12px', fontWeight:300 }}>配置参数<br/>点击生成<br/>查看档案</p>
                    <div className="flex justify-center gap-2.5 mt-5">
                      {[0,0.4,0.8].map((delay,i)=><div key={i} style={{ width:5,height:5,background:'#1e293b', animation:`blink 1.4s step-end ${delay}s infinite` }}/>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center select-none" style={{ fontFamily:"'Noto Sans SC',sans-serif", fontSize:'0.68rem', color:'#1e293b', letterSpacing:'0.15em', fontWeight:300 }}>
          STELLAR PACT · 宇宙星球登记系统 · 所有星球均受星际公约保护
        </p>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
        @keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}}
      `}</style>
    </div>
  );
}
