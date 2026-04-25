import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Globe, Wind, Droplets, ChevronDown, Zap, ArrowLeft, Star, Flag, Check, X } from 'lucide-react';

// ─── Galaxy Data ───────────────────────────────────────────────────────────────

type EnvTag = '温和' | '动荡' | '极端' | '神秘';

interface GalaxyData {
  id: string; name: string; type: string; dist: string;
  desc: string; color: string; env: EnvTag;
  atmoHint: string; gravHint: string; waterHint: string;
  atmoDefault?: string; gravDefault?: string; waterDefault?: string;
}

const GALAXIES: GalaxyData[] = [
  { id:'MW-001', name:'银河系', type:'棒旋星系', dist:'我们在这里', color:'#3b82f6', env:'温和',
    desc:'初始区域，密度最高，邻居最多，是建立星际外交网络的最佳起点。',
    atmoHint:'环境多样，任何大气层均可能存在', gravHint:'标准引力，适合各类生命形态演化', waterHint:'水资源分布均匀，自由选择' },
  { id:'M31-002', name:'仙女座星系', type:'棒旋星系', dist:'254万光年', color:'#8b5cf6', env:'温和',
    desc:'第二大初始区域，45亿年后将与银河系碰撞合并——贸易往来最频繁的跨星系走廊。',
    atmoHint:'与银河系结构相似，氮氧大气最为普遍', gravHint:'引力环境与银河系相近，标准重力为主', waterHint:'海洋型分布广泛，文明发展潜力极高',
    atmoDefault:'氮氧', gravDefault:'标准 1x', waterDefault:'海洋型' },
  { id:'M33-003', name:'三角座星系', type:'旋涡星系', dist:'270万光年', color:'#06b6d4', env:'温和',
    desc:'本星系群第三大成员，新生恒星活跃，资源丰富但文明稀少——科技垄断的绝佳机会。',
    atmoHint:'新生恒星多，氢气大气在此极为常见', gravHint:'结构稀疏，轻重力星球居多', waterHint:'云海型分布广泛，天空文明在此兴盛',
    atmoDefault:'氢气', gravDefault:'轻重力 0.5x', waterDefault:'云海型' },
  { id:'M81-013', name:'M81星系', type:'旋涡星系', dist:'1200万光年', color:'#0ea5e9', env:'温和',
    desc:'结构最完整均衡的旋涡星系，各方向发展无加减成——规则最公平的起点。',
    atmoHint:'标准旋涡星系，氮氧大气是最普遍的生命孕育环境', gravHint:'标准引力环境，生命演化最为自然顺畅', waterHint:'海洋与陆地均衡分布，生态多样性极高',
    atmoDefault:'氮氧', gravDefault:'标准 1x', waterDefault:'海洋型' },
  { id:'SGR-021', name:'人马座矮星系', type:'矮椭圆星系', dist:'7万光年', color:'#34d399', env:'温和',
    desc:'距银河系最近的卫星星系，银河系引力正在缓慢将其撕裂——在消亡前建立你的文明。',
    atmoHint:'受银河系引力牵引，大气层稳定性较低，氮氧为主', gravHint:'质量极小，微重力环境，生命形态偏向漂浮', waterHint:'冰封型保存着珍贵的水资源',
    atmoDefault:'氮氧', gravDefault:'微重力 0.1x', waterDefault:'冰封型' },
  { id:'SMC-005', name:'小麦哲伦云', type:'不规则星系', dist:'20万光年', color:'#eab308', env:'温和',
    desc:'银河系卫星星系，重元素稀缺，但稀有矿产价值极高——贸易垄断的天然基地。',
    atmoHint:'金属丰度极低，氦氖大气契合早期宇宙演化规律', gravHint:'质量较小，轻重力为主，大气层易散逸', waterHint:'冰封型将珍贵水资源完整封存于星球深处',
    atmoDefault:'氦氖', gravDefault:'轻重力 0.3x', waterDefault:'冰封型' },
  { id:'LMC-004', name:'大麦哲伦云', type:'不规则星系', dist:'16万光年', color:'#f97316', env:'极端',
    desc:'辐射极强的极端环境，蜘蛛星云是宇宙最活跃的恒星诞生区——孕育最顽强的生命形态。',
    atmoHint:'高能粒子持续轰击，耐辐射大气层是生存的关键', gravHint:'恒星密集，重力偏强，生命演化为矮壮型', waterHint:'辐射持续蒸发液态水，沙漠型地表为主',
    atmoDefault:'高能粒子', gravDefault:'强重力 2x', waterDefault:'沙漠型' },
  { id:'M51-007', name:'涡状星系', type:'旋涡星系', dist:'2300万光年', color:'#10b981', env:'动荡',
    desc:'两个星系正在碰撞，大量新生星球可认领——但轨道随时可能偏移，风险与机遇并存。',
    atmoHint:'星系碰撞激波形成复杂混合大气，成分持续变化', gravHint:'引力扰动剧烈，重力多变，轨道随时可能偏移', waterHint:'碰撞带来丰富水资源，超级海洋最为常见',
    atmoDefault:'多层混合大气', gravDefault:'亚标准 0.8x', waterDefault:'超级海洋' },
  { id:'NGC1300-008', name:'NGC 1300', type:'棒旋星系', dist:'6100万光年', color:'#f59e0b', env:'动荡',
    desc:'宏伟对称的棒状结构将气体汇向中心——中心资源丰富但竞争激烈，外围安全但发展慢。',
    atmoHint:'棒状引力将气体向中心汇聚，二氧化碳浓度极高', gravHint:'中心强重力，外围轻重力，选择位置决定命运', waterHint:'中心区域沙漠化，外围星球海洋资源丰富',
    atmoDefault:'二氧化碳', gravDefault:'强重力 1.5x', waterDefault:'沙漠型' },
  { id:'M104-009', name:'草帽星系', type:'旋涡星系', dist:'2900万光年', color:'#6366f1', env:'神秘',
    desc:'巨大尘埃盘遮蔽一切信息，深度扫描消耗能量极高——情报战的天然主场。',
    atmoHint:'尘埃盘导致多种大气成分混合，硫化氢含量偏高', gravHint:'明亮核球质量集中，中心引力偏强', waterHint:'尘埃干燥的外围环境，沙漠型地表主导',
    atmoDefault:'硫化氢', gravDefault:'强重力 2x', waterDefault:'沙漠型' },
  { id:'CW-010', name:'车轮星系', type:'环状星系', dist:'5亿光年', color:'#14b8a6', env:'动荡',
    desc:'两星系碰撞产生的罕见环状结构，环内文明自动获得联合防御加成——天然联盟要塞。',
    atmoHint:'环状冲击波形成以氨气为主的大气，独特而稳定', gravHint:'环状结构引力分布均匀，标准重力是生命演化温床', waterHint:'冲击波带来丰富云海，适合天空文明',
    atmoDefault:'氨气', gravDefault:'标准 1x', waterDefault:'云海型' },
  { id:'ANN-011', name:'触须星系', type:'碰撞星系对', dist:'4500万光年', color:'#ef4444', env:'极端',
    desc:'两个星系正在剧烈碰撞，冲突在此从未停歇——战斗系数加成+30%，反派的主场。',
    atmoHint:'碰撞激波产生高温等离子体大气，能量密度极高', gravHint:'引力潮汐持续撕裂，极重力环境考验一切生命', waterHint:'高温高压环境下，酸液海洋是最常见的液态形式',
    atmoDefault:'等离子体', gravDefault:'极重力 3x', waterDefault:'酸液海洋' },
  { id:'BUT-012', name:'蝴蝶星系', type:'并合星系', dist:'4亿光年', color:'#a855f7', env:'神秘',
    desc:'两个黑洞正在合并，引力波使星际通讯产生随机延迟——不确定性是这里的常态。',
    atmoHint:'双核引力波扰动大气层稳定性，多层混合是常态', gravHint:'双黑洞区域超重力为主，空间在此弯曲', waterHint:'引力波周期性扰动使水资源呈多相态混合',
    atmoDefault:'多层混合大气', gravDefault:'超重力 5x', waterDefault:'多相态混合' },
  { id:'NGC1569-014', name:'NGC 1569', type:'不规则星系', dist:'1100万光年', color:'#f43f5e', env:'极端',
    desc:'恒星诞生率是银河系100倍，科技研究速度+50%——但持续的恒星风让维护成本极高。',
    atmoHint:'超级恒星风将气体完全电离，高能粒子大气主导全域', gravHint:'强烈星系风持续推压，轻重力星球居多', waterHint:'恒星风持续蒸发液态水，沙漠型是生存现实',
    atmoDefault:'高能粒子', gravDefault:'轻重力 0.5x', waterDefault:'沙漠型' },
  { id:'M87-006', name:'室女座A', type:'椭圆星系', dist:'5370万光年', color:'#ec4899', env:'极端',
    desc:'人类首张黑洞照片的拍摄地，相对论时间膨胀在此最为显著——时间流逝与其他星系不同步。',
    atmoHint:'黑洞相对论喷流影响，等离子体大气能量极高', gravHint:'黑洞引力主导整个区域，极重力是常态', waterHint:'极端能量下液态甲烷比水更稳定',
    atmoDefault:'等离子体', gravDefault:'极重力 3x', waterDefault:'液态甲烷海' },
  { id:'CenA-016', name:'半人马座A', type:'椭圆星系', dist:'1300万光年', color:'#0891b2', env:'动荡',
    desc:'最近的活跃星系核，射电喷流跨越数百万光年——喷流方向的文明通讯范围翻倍。',
    atmoHint:'射电喷流带来持续高能粒子，大气层能量密度极高', gravHint:'活跃星系核质量集中，强重力主导核心区域', waterHint:'高能环境下液态甲烷比水更稳定',
    atmoDefault:'高能粒子', gravDefault:'强重力 2x', waterDefault:'液态甲烷海' },
  { id:'HEL-017', name:'NGC 2685', type:'极环星系', dist:'4200万光年', color:'#059669', env:'神秘',
    desc:'罕见的多平面物质环，与多维空间存在微弱联系——进入多维探索的最低门槛入口。',
    atmoHint:'多平面物质环带来多层大气奇观，成分充满未知', gravHint:'多平面引力相互抵消，产生罕见微重力漂浮环境', waterHint:'多维水资源分布形成壮观云海',
    atmoDefault:'多层混合大气', gravDefault:'微重力 0.1x', waterDefault:'云海型' },
  { id:'REV-018', name:'NGC 4622', type:'旋涡星系', dist:'1.11亿光年', color:'#d97706', env:'神秘',
    desc:'旋臂方向与大多数星系相反，科技树路径完全颠覆常规——老玩家重开的最佳选择。',
    atmoHint:'反向旋转带来逆流大气，氩气在此最为稳定', gravHint:'反向角动量使引力分布异常，亚标准重力主导', waterHint:'反向演化使地下水脉成为主要水资源形式',
    atmoDefault:'氩气', gravDefault:'亚标准 0.8x', waterDefault:'地下水脉' },
  { id:'NGC4889-015', name:'NGC 4889', type:'椭圆星系', dist:'3.36亿光年', color:'#7c3aed', env:'极端',
    desc:'中心黑洞质量约210亿太阳质量，已知最极端的引力环境——热寂终局的最佳发生地。',
    atmoHint:'超大质量黑洞辐射将普通大气撕裂，等离子体唯一存在', gravHint:'压碎级极端引力，任何已知物质结构在此变形', waterHint:'极端压力使物质相变，多相态混合是唯一形式',
    atmoDefault:'等离子体', gravDefault:'压碎级 10x', waterDefault:'多相态混合' },
  { id:'QCH-019', name:'NGC 7603', type:'赛弗特星系', dist:'3.5亿光年', color:'#be185d', env:'神秘',
    desc:'量子纠缠异常区，通讯可绕过能量消耗——但信息有概率被随机传送给第三方。',
    atmoHint:'量子效应使大气成分随机叠加，多层混合是确定状态', gravHint:'量子引力效应使重力呈不确定性，亚标准为均值', waterHint:'量子叠加态使水资源呈多相态混合奇景',
    atmoDefault:'多层混合大气', gravDefault:'亚标准 0.8x', waterDefault:'多相态混合' },
  { id:'IC1101-020', name:'IC 1101', type:'超巨椭圆星系', dist:'10.4亿光年', color:'#dc2626', env:'极端',
    desc:'已知最大星系，直径是银河系60倍，终局最激烈的战场——只有最强的文明能在此立足。',
    atmoHint:'超大星系汇聚一切大气类型，等离子体能量最为强烈', gravHint:'超大质量聚集，极重力覆盖大部分区域', waterHint:'宇宙中水资源最丰富的区域，超级海洋蔚为壮观',
    atmoDefault:'等离子体', gravDefault:'极重力 3x', waterDefault:'超级海洋' },
];

const ENV_CONFIG: Record<EnvTag, { color: string; icon: string; desc: string }> = {
  '温和': { color:'#10b981', icon:'🌿', desc:'环境稳定，适合稳扎稳打' },
  '动荡': { color:'#f59e0b', icon:'⚡', desc:'环境多变，风险与机遇并存' },
  '极端': { color:'#ef4444', icon:'☢️', desc:'极端环境，生存本身是挑战' },
  '神秘': { color:'#a855f7', icon:'🌀', desc:'规则异常，充满未知可能' },
};

// ─── Options ──────────────────────────────────────────────────────────────────

const ATMOSPHERE_OPTIONS = ['氮氧','氦氖','二氧化碳','甲烷','氨气','氢气','硫化氢','氩气','高能粒子','多层混合大气','等离子体'];
const GRAVITY_OPTIONS = ['微重力 0.1x','轻重力 0.3x','轻重力 0.5x','亚标准 0.8x','标准 1x','强重力 1.5x','强重力 2x','极重力 3x','超重力 5x','压碎级 10x'];
const WATER_OPTIONS = ['无水干燥','地下水脉','冰封型','沙漠型','云海型','海洋型','超级海洋','酸液海洋','液态甲烷海','多相态混合'];

const FLAG_SHAPES = ['▶','◆','●','★','⬟','⬡','⬢','✦','⊕','⊗'];
const FLAG_COLORS = ['#ef4444','#f97316','#eab308','#10b981','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f1f5f9','#94a3b8'];

// ─── Civilization description generator ───────────────────────────────────────

const atmoDesc: Record<string,string> = {
  '氮氧':'大气富含活性氧，呼吸无忧，孕育了最多样的碳基生命形态',
  '氦氖':'大气泛着迷幻霓虹荧光，气体轻盈，生命以电磁感知世界',
  '二氧化碳':'浓厚温室大气锁住热量，极端高温下演化出耐热的硅基生命',
  '甲烷':'橙黄有机迷雾弥漫，以碳链为骨架的奇异文明在此书写化学史诗',
  '氨气':'翠绿氨气海洋般笼罩星球，生命以氨为溶剂，演化出独特的低温生化',
  '氢气':'轻盈氢气大气在轻重力下漫延极广，漂浮型生命在此进化出飞行文明',
  '硫化氢':'刺鼻的硫化物大气孕育了以硫为能量来源的厌氧生命，看似荒芜实则繁盛',
  '氩气':'惰性氩气大气极度稳定，生命演化缓慢却无比顽强，以纯能量形式存在',
  '高能粒子':'持续的高能粒子轰击造就了耐辐射的极端生命，它们以辐射为食',
  '多层混合大气':'复杂的多层大气形成不同的生态位，多种生命形态在此共存',
  '等离子体':'极高温等离子体大气下，只有以磁场为身体的能量体生命得以存在',
};
const gravDesc: Record<string,string> = {
  '微重力 0.1x':'近乎失重的环境，生命演化出漂浮形态，建筑向无限高空延伸',
  '轻重力 0.3x':'轻盈的引力让生命跳跃即是飞翔，山峦高耸入云，文明向高处发展',
  '轻重力 0.5x':'适度的轻重力孕育了优雅高挑的生命形态，建筑如芦苇般纤细',
  '亚标准 0.8x':'略低于标准的引力，生命形态修长，身体轻盈，行动敏捷',
  '标准 1x':'与地球相近的引力，碳基生命在此演化最为自然顺畅',
  '强重力 1.5x':'偏高的引力使生命演化为矮壮型，骨骼粗壮，肌肉发达',
  '强重力 2x':'两倍引力压低了一切，生命匍匐贴地，肌肉强劲得超乎想象',
  '极重力 3x':'三倍引力将万物压向地面，能存活于此的生命坚硬如岩石',
  '超重力 5x':'极端压力下，普通物质被压缩，只有特殊结构的生命能在此生存',
  '压碎级 10x':'接近中子星表面的引力，生命的存在本身就是宇宙奇迹',
};
const waterDesc: Record<string,string> = {
  '无水干燥':'极度干燥的星球，生命以矿物为食，以静电为语言',
  '地下水脉':'水藏于地下深处，文明向地底发展，建造了庞大的地下都市',
  '冰封型':'永恒冰盖封锁星球，液态水藏于深层，冰下文明从未见过阳光',
  '沙漠型':'每一滴水都是节日，文明围绕稀缺之水建立了精妙的社会秩序',
  '云海型':'云层厚如大陆，生命栖居于云脊之上，从未接触过星球固体表面',
  '海洋型':'汪洋覆盖大部分星表，深海孕育万物，文明从海洋中诞生',
  '超级海洋':'无尽的深海覆盖整颗星球，生命在极压深渊中演化出非凡智慧',
  '酸液海洋':'腐蚀性酸液海洋孕育了以酸为食的硬壳生命，钢铁在此溶解',
  '液态甲烷海':'零下180度的甲烷之海，碳氢文明在极寒中书写化学史诗',
  '多相态混合':'水以固液气三态共存，生命在相变边界演化出独特的适应能力',
};

function getCivDesc(atmo: string, grav: string, water: string, name: string): string {
  const a = atmoDesc[atmo] ?? '大气层充满未知成分';
  const g = gravDesc[grav] ?? '引力环境极为特殊';
  const w = waterDesc[water] ?? '水资源分布奇异';
  return `${name}：${a}。${g}，${w}。`;
}

// ─── Planet palette ────────────────────────────────────────────────────────────

const getPlanetPalette = (atmo: string) => {
  const map: Record<string,{base:string;shine:string;detail:string;glow:string;mid:string}> = {
    '氮氧':       {base:'#1a3a7a',shine:'#4a9eff',detail:'#93c5fd',glow:'#60a5fa',mid:'#2563eb'},
    '氦氖':       {base:'#5b1a9a',shine:'#c084fc',detail:'#e879f9',glow:'#a855f7',mid:'#7c3aed'},
    '二氧化碳':   {base:'#7f1d1d',shine:'#f87171',detail:'#fca5a5',glow:'#f97316',mid:'#dc2626'},
    '甲烷':       {base:'#713f12',shine:'#fbbf24',detail:'#fcd34d',glow:'#f59e0b',mid:'#d97706'},
    '氨气':       {base:'#064e3b',shine:'#34d399',detail:'#6ee7b7',glow:'#10b981',mid:'#059669'},
    '氢气':       {base:'#0c4a6e',shine:'#38bdf8',detail:'#7dd3fc',glow:'#0ea5e9',mid:'#0284c7'},
    '硫化氢':     {base:'#713f12',shine:'#facc15',detail:'#fde68a',glow:'#eab308',mid:'#ca8a04'},
    '氩气':       {base:'#1e1b4b',shine:'#818cf8',detail:'#a5b4fc',glow:'#6366f1',mid:'#4f46e5'},
    '高能粒子':   {base:'#4c0519',shine:'#fb7185',detail:'#fda4af',glow:'#f43f5e',mid:'#e11d48'},
    '多层混合大气':{base:'#1a1a2e',shine:'#c4b5fd',detail:'#ddd6fe',glow:'#8b5cf6',mid:'#7c3aed'},
    '等离子体':   {base:'#0f172a',shine:'#f0abfc',detail:'#f5d0fe',glow:'#d946ef',mid:'#a21caf'},
  };
  return map[atmo] ?? map['氮氧'];
};

const getGravityScale = (grav: string) => {
  const map: Record<string,{r:number;scaleY:number}> = {
    '微重力 0.1x':{r:52,scaleY:1.08},'轻重力 0.3x':{r:55,scaleY:1.05},'轻重力 0.5x':{r:57,scaleY:1.04},
    '亚标准 0.8x':{r:60,scaleY:1.02},'标准 1x':{r:62,scaleY:1.00},'强重力 1.5x':{r:65,scaleY:0.96},
    '强重力 2x':{r:67,scaleY:0.93},'极重力 3x':{r:70,scaleY:0.88},'超重力 5x':{r:73,scaleY:0.83},'压碎级 10x':{r:76,scaleY:0.76},
  };
  return map[grav] ?? {r:62,scaleY:1.0};
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlagConfig { shape: string; color: string; }
interface PlanetData { name: string; atmosphere: string; gravity: string; water: string; galaxy: GalaxyData; flag: FlagConfig; }

// ─── Starfield ────────────────────────────────────────────────────────────────

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({length:220},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5+0.2,alpha:Math.random(),delta:(Math.random()-0.5)*0.006,color:Math.random()>0.82?`hsl(${200+Math.random()*60},80%,85%)`:'white'}));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s=>{s.alpha+=s.delta;if(s.alpha<=0.02||s.alpha>=1)s.delta*=-1;ctx.globalAlpha=Math.max(0.02,Math.min(1,s.alpha));ctx.fillStyle=s.color;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
      ctx.globalAlpha=1; raf=requestAnimationFrame(draw);
    };
    draw(); return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:0}}/>;
}

// ─── Planet Visual ────────────────────────────────────────────────────────────

function PixelPlanet({atmosphere,water,gravity,flag}:{atmosphere:string;water:string;gravity:string;flag:FlagConfig}) {
  const pal = getPlanetPalette(atmosphere);
  const {r,scaleY} = getGravityScale(gravity);
  const size=190; const cx=size/2; const cy=size/2; const ry=r*scaleY;
  const uid=`${atmosphere.slice(0,2)}${water.slice(0,2)}${gravity.slice(0,2)}`.replace(/\s/g,'');
  return (
    <div className="relative flex items-center justify-center" style={{width:size,height:size+30}}>
      <div className="absolute rounded-full" style={{width:r*2+60,height:r*2+60,background:`radial-gradient(circle,${pal.glow}22 0%,transparent 68%)`,top:'50%',left:'50%',transform:'translate(-50%,-55%)',animation:'pulse 3s ease-in-out infinite'}}/>
      <svg width={size} height={size+30} viewBox={`0 0 ${size} ${size+30}`} style={{overflow:'visible'}}>
        <defs>
          <radialGradient id={`base-${uid}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={pal.shine} stopOpacity="0.95"/>
            <stop offset="40%" stopColor={pal.mid} stopOpacity="0.9"/>
            <stop offset="75%" stopColor={pal.base} stopOpacity="0.95"/>
            <stop offset="100%" stopColor={pal.base} stopOpacity="0.6"/>
          </radialGradient>
          <radialGradient id={`shadow-${uid}`} cx="70%" cy="72%" r="55%">
            <stop offset="0%" stopColor="#000010" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#000010" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id={`rim-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="transparent"/>
            <stop offset="88%" stopColor={pal.glow} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={pal.glow} stopOpacity="0.35"/>
          </radialGradient>
          <clipPath id={`clip-${uid}`}><ellipse cx={cx} cy={cy} rx={r} ry={ry}/></clipPath>
        </defs>
        {/* Orbital ring */}
        <ellipse cx={cx} cy={cy} rx={r+22} ry={9} fill="none" stroke={pal.detail} strokeWidth={2} opacity={0.18} transform={`rotate(-18,${cx},${cy})`}/>
        {/* Planet */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#base-${uid})`}/>
        {/* Surface details */}
        <g clipPath={`url(#clip-${uid})`}>
          {(water==='海洋型'||water==='超级海洋')&&<>
            <ellipse cx={cx-14} cy={cy-18} rx={18} ry={12} fill={pal.detail} opacity={0.38} transform={`rotate(-15,${cx-14},${cy-18})`}/>
            <ellipse cx={cx+18} cy={cy+10} rx={12} ry={8} fill={pal.detail} opacity={0.32}/>
            <ellipse cx={cx-22} cy={cy+16} rx={10} ry={7} fill={pal.detail} opacity={0.28}/>
            {[0,1,2].map(i=><line key={i} x1={cx-r+8} y1={cy+4+i*8} x2={cx+r-8} y2={cy+6+i*8} stroke={pal.shine} strokeWidth={0.8} opacity={0.12}/>)}
          </>}
          {(water==='沙漠型'||water==='无水干燥')&&<>
            {[[-20,-25,10,15],[15,-10,-5,28],[0,5,-25,20],[20,10,5,-15]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={cx+x1} y1={cy+y1} x2={cx+x2} y2={cy+y2} stroke={pal.shine} strokeWidth={1.2} opacity={0.22}/>
            ))}
            <ellipse cx={cx+5} cy={cy-8} rx={20} ry={12} fill={pal.detail} opacity={0.14}/>
          </>}
          {water==='冰封型'&&<>
            <ellipse cx={cx} cy={cy-ry+8} rx={r*0.65} ry={14} fill="white" opacity={0.52}/>
            <ellipse cx={cx} cy={cy+ry-8} rx={r*0.5} ry={11} fill="white" opacity={0.42}/>
            {[[-8,4,12,-18],[10,-5,-14,8]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={cx+x1} y1={cy-ry+18+i*6} x2={cx+x2} y2={cy-ry+22+i*6} stroke="white" strokeWidth={0.8} opacity={0.35}/>
            ))}
          </>}
          {(water==='云海型'||water==='多相态混合')&&<>
            {[-16,-4,8,20].map((dy,i)=>(
              <ellipse key={i} cx={cx+(i%2===0?4:-4)} cy={cy+dy} rx={r-4} ry={5+i} fill="white" opacity={0.10+(i*0.025)}/>
            ))}
            <ellipse cx={cx-10} cy={cy-8} rx={10} ry={7} fill="white" opacity={0.13} transform={`rotate(-30,${cx-10},${cy-8})`}/>
          </>}
          {water==='酸液海洋'&&<>
            <ellipse cx={cx} cy={cy+12} rx={r-4} ry={16} fill={pal.glow} opacity={0.28}/>
            {[0,1,2].map(i=><ellipse key={i} cx={cx-15+i*15} cy={cy+5+i*4} rx={6} ry={3} fill={pal.shine} opacity={0.18}/>)}
          </>}
          {water==='地下水脉'&&<>
            {[-20,-8,8,20].map((dx,i)=>(
              <line key={i} x1={cx+dx} y1={cy+10} x2={cx+dx+(i%2===0?3:-3)} y2={cy+ry-4} stroke={pal.detail} strokeWidth={1.5} opacity={0.3}/>
            ))}
          </>}
          {water==='液态甲烷海'&&<>
            <ellipse cx={cx} cy={cy+14} rx={r-6} ry={14} fill={pal.mid} opacity={0.35}/>
          </>}
        </g>
        {/* Shadow for 3D depth */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#shadow-${uid})`}/>
        {/* Specular highlights */}
        <ellipse cx={cx-r*0.28} cy={cy-ry*0.28} rx={r*0.22} ry={ry*0.15} fill="white" opacity={0.22}/>
        <ellipse cx={cx-r*0.32} cy={cy-ry*0.32} rx={r*0.08} ry={ry*0.06} fill="white" opacity={0.45}/>
        {/* Atmosphere rim */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#rim-${uid})`}/>
        <ellipse cx={cx} cy={cy} rx={r+1} ry={ry+1} fill="none" stroke={pal.glow} strokeWidth={2} opacity={0.4}/>
        {/* Flag pole */}
        <line x1={cx+r-4} y1={cy-ry*0.5} x2={cx+r-4} y2={cy+ry*0.3+20} stroke="#94a3b8" strokeWidth={1.5} opacity={0.7}/>
        {/* Flag */}
        <rect x={cx+r-4} y={cy-ry*0.5} width={28} height={18} rx={2} fill={flag.color} opacity={0.9}/>
        <text x={cx+r+4} y={cy-ry*0.5+13} fontSize="11" fill="white" opacity={0.95} style={{fontFamily:'monospace'}}>{flag.shape}</text>
      </svg>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

function PixelPlanet({atmosphere,water,gravity,flag,planetName}:{atmosphere:string;water:string;gravity:string;flag:FlagConfig;planetName:string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const pal = getPlanetPalette(atmosphere);
  const {r,scaleY} = getGravityScale(gravity);

  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d'); if(!ctx) return;
    const dpr = window.devicePixelRatio||1;
    const W=220, H=220;
    canvas.width=W*dpr; canvas.height=H*dpr;
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.scale(dpr,dpr);
    const cx=W/2, cy=H/2;
    const ry=r*scaleY;

    // stars — slow twinkle
    const stars = Array.from({length:35},()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.2+0.2,
      alpha:Math.random(),
      delta:(Math.random()-0.5)*0.004,
    }));

    let orbitAngle = 0;

    function drawFrame(){
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#03020f'; ctx.fillRect(0,0,W,H);

      // slow stars
      stars.forEach(s=>{
        s.alpha+=s.delta;
        if(s.alpha<=0.05||s.alpha>=0.9) s.delta*=-1;
        ctx.globalAlpha=Math.max(0.05,Math.min(0.9,s.alpha));
        ctx.fillStyle='white'; ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha=1;

      // orbit ellipse (behind planet)
      const orbitRx=r+28, orbitRy=10;
      ctx.beginPath();
      ctx.ellipse(cx,cy,orbitRx,orbitRy,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(192,132,252,0.2)'; ctx.lineWidth=1.5; ctx.stroke();

      // planet body
      const grad=ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,r*0.05,cx,cy,r);
      grad.addColorStop(0,pal.shine); grad.addColorStop(0.45,pal.mid);
      grad.addColorStop(0.8,pal.base); grad.addColorStop(1,pal.base+'80');
      ctx.save(); ctx.beginPath();
      ctx.ellipse(cx,cy,r,ry,0,0,Math.PI*2); ctx.clip();
      ctx.fillStyle=grad; ctx.fillRect(cx-r,cy-ry,r*2,ry*2);

      // water surface detail
      if(water==='海洋型'||water==='超级海洋'){
        ctx.fillStyle=pal.detail+'60';
        ctx.beginPath(); ctx.ellipse(cx-12,cy-16,16,10,-.3,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx+16,cy+10,10,7,0,0,Math.PI*2); ctx.fill();
      }
      if(water==='冰封型'){
        ctx.fillStyle='rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.ellipse(cx,cy-ry+6,r*.6,12,0,0,Math.PI*2); ctx.fill();
      }
      if(water==='云海型'||water==='多相态混合'){
        [-14,-2,10].forEach((dy,i)=>{
          ctx.fillStyle=`rgba(255,255,255,${0.08+i*0.02})`;
          ctx.beginPath(); ctx.ellipse(cx+(i%2===0?4:-4),cy+dy,r-6,5+i,0,0,Math.PI*2); ctx.fill();
        });
      }
      if(water==='沙漠型'||water==='无水干燥'){
        ctx.strokeStyle=pal.shine+'40'; ctx.lineWidth=1;
        [[-18,-22,8,12],[12,-8,-4,24]].forEach(([x1,y1,x2,y2])=>{
          ctx.beginPath(); ctx.moveTo(cx+x1,cy+y1); ctx.lineTo(cx+x2,cy+y2); ctx.stroke();
        });
      }
      ctx.restore();

      // shadow
      const sh=ctx.createRadialGradient(cx+r*.3,cy+r*.3,0,cx+r*.3,cy+r*.3,r*.85);
      sh.addColorStop(0,'rgba(0,0,10,0.55)'); sh.addColorStop(1,'rgba(0,0,10,0)');
      ctx.beginPath(); ctx.ellipse(cx,cy,r,ry,0,0,Math.PI*2);
      ctx.fillStyle=sh; ctx.fill();

      // specular
      ctx.beginPath(); ctx.ellipse(cx-r*.28,cy-ry*.28,r*.2,ry*.13,0,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx-r*.32,cy-ry*.32,r*.07,ry*.05,0,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.42)'; ctx.fill();

      // rim glow
      ctx.beginPath(); ctx.ellipse(cx,cy,r+1,ry+1,0,0,Math.PI*2);
      ctx.strokeStyle=pal.glow+'66'; ctx.lineWidth=2; ctx.stroke();

      // ring
      ctx.beginPath(); ctx.ellipse(cx,cy,r+18,8,-.3,0,Math.PI*2);
      ctx.strokeStyle=pal.detail+'30'; ctx.lineWidth=2; ctx.stroke();

      // orbital flag marker
      orbitAngle += 0.012;
      const mx=cx+Math.cos(orbitAngle)*(r+28);
      const my=cy+Math.sin(orbitAngle)*10;

      // flag dot
      ctx.beginPath(); ctx.arc(mx,my,8,0,Math.PI*2);
      ctx.fillStyle=flag.color; ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.font='9px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(flag.shape,mx,my);

      // planet name above flag dot (no background)
      ctx.font='500 11px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.fillStyle='rgba(255,255,255,0.92)';
      ctx.fillText(planetName, mx, my-10);

      ctx.textAlign='left'; ctx.textBaseline='alphabetic';

      animRef.current = requestAnimationFrame(drawFrame);
    }
    drawFrame();
    return ()=>cancelAnimationFrame(animRef.current);
  },[atmosphere,water,gravity,flag,planetName,pal,r,scaleY]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} style={{borderRadius:'8px'}}/>
    </div>
  );
}

// ─── Galaxy Card ──────────────────────────────────────────────────────────────

function GalaxyCard({galaxy,onSelect}:{galaxy:GalaxyData;onSelect:()=>void}) {
  const env = ENV_CONFIG[galaxy.env];
  return (
    <button onClick={onSelect} className="w-full text-left p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
      style={{background:'rgba(10,5,30,0.65)',border:`1px solid ${galaxy.color}22`,position:'relative',overflow:'hidden'}}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.border=`1px solid ${galaxy.color}55`;(e.currentTarget as HTMLElement).style.boxShadow=`0 0 20px ${galaxy.color}15`;}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.border=`1px solid ${galaxy.color}22`;(e.currentTarget as HTMLElement).style.boxShadow='none';}}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:galaxy.color,opacity:0.7}}/>
      <div className="flex items-start justify-between gap-2 mb-2 pl-2">
        <div>
          <div style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'1rem',fontWeight:500,color:'#f1f5f9',marginBottom:'2px'}}>{galaxy.name}</div>
          <div style={{fontFamily:"'VT323',monospace",fontSize:'0.7rem',color:'#334155',letterSpacing:'0.12em'}}>{galaxy.id}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.68rem',color:'#475569'}}>{galaxy.dist}</span>
          <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.68rem',color:env.color,background:`${env.color}18`,padding:'1px 7px',borderRadius:'3px',fontWeight:500}}>{env.icon} {galaxy.env}</span>
        </div>
      </div>
      <div className="pl-2">
        <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.7rem',color:galaxy.color,background:`${galaxy.color}12`,padding:'1px 8px',borderRadius:'2px',marginBottom:'6px',display:'inline-block'}}>{galaxy.type}</span>
        <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.75rem',color:'#64748b',lineHeight:1.55,marginTop:'5px',fontWeight:300}}>{galaxy.desc}</p>
      </div>
    </button>
  );
}

// ─── Claim Modal ──────────────────────────────────────────────────────────────

function ClaimModal({planet,onConfirm,onCancel}:{planet:PlanetData;onConfirm:()=>void;onCancel:()=>void}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}}>
      <div className="p-8 max-w-sm w-full mx-4" style={{background:'rgba(7,3,22,0.97)',border:'1px solid rgba(139,92,246,0.5)',boxShadow:'0 0 60px rgba(139,92,246,0.2)'}}>
        <div className="flex items-center gap-2 mb-6">
          <Flag size={14} style={{color:'#a855f7'}}/>
          <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.85rem',color:'#7c3aed',letterSpacing:'0.1em'}}>星际主权宣示</span>
        </div>
        <div style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'1.1rem',fontWeight:500,color:'#f1f5f9',marginBottom:'8px'}}>
          确认将【{planet.name}】纳入你的文明版图？
        </div>
        <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.8rem',color:'#64748b',lineHeight:1.7,marginBottom:'24px',fontWeight:300}}>
          此操作将在宇宙星球登记处正式备案。你的星球ID、属性及文明档案将永久记录于星际公约数据库，其他文明可扫描并与你建立联系。
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-3 flex items-center justify-center gap-2 transition-all"
            style={{background:'linear-gradient(135deg,rgba(88,28,135,0.9),rgba(12,74,110,0.9))',border:'1px solid rgba(139,92,246,0.6)',fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.9rem',color:'#f1f5f9',fontWeight:400}}>
            <Check size={14}/> 宣示主权
          </button>
          <button onClick={onCancel} className="flex-1 py-3 flex items-center justify-center gap-2 transition-all"
            style={{background:'transparent',border:'1px solid rgba(100,116,139,0.3)',fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.9rem',color:'#64748b',fontWeight:300}}>
            <X size={14}/> 再想想
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Planet Card ──────────────────────────────────────────────────────────────

function PlanetCard({planet,onClaim}:{planet:PlanetData;onClaim:()=>void}) {
  const [visible,setVisible]=useState(false);
  const idRef=useRef(Math.random().toString(36).slice(2,8).toUpperCase());
  const pal=getPlanetPalette(planet.atmosphere);
  const civDesc=getCivDesc(planet.atmosphere,planet.gravity,planet.water,planet.name);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),60);return()=>clearTimeout(t);},[]);
  return (
    <div className="flex flex-col h-full" style={{opacity:visible?1:0,transform:visible?'translateX(0)':'translateX(28px)',transition:'opacity 0.45s ease,transform 0.45s ease'}}>
      <div className="flex justify-center mb-2">
        <PixelPlanet atmosphere={planet.atmosphere} water={planet.water} gravity={planet.gravity} flag={planet.flag} planetName={planet.name}/>
      </div>
      <div className="text-center mb-3">
        <div style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'1.1rem',fontWeight:500,color:'#7dd3fc',wordBreak:'break-all'}}>{planet.name}</div>
        <div style={{fontFamily:"'VT323',monospace",fontSize:'0.75rem',color:'#334155',letterSpacing:'0.15em',marginTop:'3px'}}>ID: {idRef.current} · {planet.galaxy.name}</div>
      </div>
      <div className="w-full mb-3" style={{height:'1px',background:'linear-gradient(to right,transparent,rgba(139,92,246,0.5),transparent)'}}/>
      <div className="space-y-1.5 mb-3">
        {[{icon:<Wind size={11}/>,label:'大气层',value:planet.atmosphere},{icon:<Zap size={11}/>,label:'重力强度',value:planet.gravity},{icon:<Droplets size={11}/>,label:'水资源',value:planet.water}].map(({icon,label,value})=>(
          <div key={label} className="px-3 py-1.5 flex items-center gap-2" style={{background:'rgba(10,5,30,0.5)',borderLeft:`2px solid ${pal.glow}80`}}>
            <span style={{color:pal.glow}}>{icon}</span>
            <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.75rem',color:'#7c3aed',fontWeight:400}}>{label}</span>
            <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.82rem',color:'#e2e8f0',marginLeft:'auto',fontWeight:300}}>{value}</span>
          </div>
        ))}
      </div>
      <div className="w-full mb-3" style={{height:'1px',background:'linear-gradient(to right,transparent,rgba(56,189,248,0.35),transparent)'}}/>
      <div className="p-3 mb-3" style={{background:'rgba(12,7,35,0.65)',border:'1px solid rgba(56,189,248,0.15)',flex:1}}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={11} style={{color:'#38bdf8'}}/>
          <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.78rem',color:'#38bdf8',fontWeight:400,letterSpacing:'0.08em'}}>文明档案</span>
        </div>
        <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.82rem',color:'#cbd5e1',lineHeight:1.85,fontWeight:300}}>{civDesc}</p>
      </div>
      {/* Claim button */}
      <button onClick={onClaim} className="w-full py-3 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
        style={{background:'linear-gradient(135deg,rgba(88,28,135,0.9) 0%,rgba(12,74,110,0.9) 100%)',border:'1px solid rgba(139,92,246,0.6)',fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.9rem',fontWeight:400,color:'#f1f5f9',letterSpacing:'0.08em',boxShadow:'0 0 20px rgba(139,92,246,0.2)'}}>
        <Flag size={13}/> 宣示对此星球的主权
      </button>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({planet,onReset}:{planet:PlanetData;onReset:()=>void}) {
  return (
    <div className="w-full max-w-md text-center py-12 px-6" style={{background:'rgba(7,3,22,0.9)',border:'1px solid rgba(56,189,248,0.3)',backdropFilter:'blur(14px)'}}>
      <div style={{fontSize:'3rem',marginBottom:'16px'}}>✦</div>
      <div style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'1.2rem',fontWeight:500,color:'#7dd3fc',marginBottom:'8px'}}>主权宣示成功</div>
      <div style={{fontFamily:"'VT323',monospace",fontSize:'0.8rem',color:'#334155',letterSpacing:'0.15em',marginBottom:'20px'}}>
        {planet.name} · {planet.galaxy.name} · 已录入星际公约数据库
      </div>
      <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.85rem',color:'#64748b',lineHeight:1.8,fontWeight:300,marginBottom:'28px'}}>
        你的星球档案已向整个宇宙公开。<br/>其他文明将能扫描并与你建立联系。<br/>现在，开始建设你的文明吧。
      </p>
      <button onClick={onReset} style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.85rem',color:'#475569',fontWeight:300,textDecoration:'underline'}}>
        认领另一颗星球
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

type Step = 'galaxy'|'planet'|'success';

export default function App() {
  const [step,setStep]=useState<Step>('galaxy');
  const [selectedGalaxy,setSelectedGalaxy]=useState<GalaxyData|null>(null);
  const [name,setName]=useState('');
  const [atmosphere,setAtmosphere]=useState(ATMOSPHERE_OPTIONS[0]);
  const [gravity,setGravity]=useState(GRAVITY_OPTIONS[4]);
  const [water,setWater]=useState(WATER_OPTIONS[5]);
  const [flagShape,setFlagShape]=useState(FLAG_SHAPES[0]);
  const [flagColor,setFlagColor]=useState(FLAG_COLORS[0]);
  const [planet,setPlanet]=useState<PlanetData|null>(null);
  const [generating,setGenerating]=useState(false);
  const [cardKey,setCardKey]=useState(0);
  const [nameError,setNameError]=useState(false);
  const [search,setSearch]=useState('');
  const [showClaim,setShowClaim]=useState(false);
  const [claimedPlanet,setClaimedPlanet]=useState<PlanetData|null>(null);

  const handleSelectGalaxy=useCallback((g:GalaxyData)=>{
    setSelectedGalaxy(g);
    if(g.atmoDefault)setAtmosphere(g.atmoDefault);
    if(g.gravDefault)setGravity(g.gravDefault);
    if(g.waterDefault)setWater(g.waterDefault);
    setStep('planet');
  },[]);

  const handleGenerate=useCallback(()=>{
    if(!name.trim()){setNameError(true);setTimeout(()=>setNameError(false),700);return;}
    setGenerating(true);setPlanet(null);
    setTimeout(()=>{
      setPlanet({name:name.trim(),atmosphere,gravity,water,galaxy:selectedGalaxy!,flag:{shape:flagShape,color:flagColor}});
      setCardKey(k=>k+1);setGenerating(false);
    },900);
  },[name,atmosphere,gravity,water,selectedGalaxy,flagShape,flagColor]);

  const handleClaim=useCallback(()=>{
    if(planet){setClaimedPlanet(planet);setShowClaim(true);}
  },[planet]);

  const handleConfirmClaim=useCallback(()=>{
    setShowClaim(false);setStep('success');
  },[]);

  const handleReset=useCallback(()=>{
    setStep('galaxy');setPlanet(null);setClaimedPlanet(null);setName('');
  },[]);

  const filtered=GALAXIES.filter(g=>g.name.includes(search)||g.type.includes(search)||g.id.toUpperCase().includes(search.toUpperCase())||g.env.includes(search));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background:'#03020f'}}>
      <Starfield/>
      <div className="fixed pointer-events-none" style={{top:'-8%',left:'-8%',width:'42vw',height:'42vw',background:'radial-gradient(circle,rgba(88,28,135,0.10) 0%,transparent 70%)',borderRadius:'50%',zIndex:0}}/>
      <div className="fixed pointer-events-none" style={{bottom:'-12%',right:'-8%',width:'48vw',height:'48vw',background:'radial-gradient(circle,rgba(12,74,110,0.12) 0%,transparent 70%)',borderRadius:'50%',zIndex:0}}/>

      {showClaim&&planet&&<ClaimModal planet={planet} onConfirm={handleConfirmClaim} onCancel={()=>setShowClaim(false)}/>}

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe size={16} style={{color:'#38bdf8'}}/>
            <h1 style={{fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(0.8rem,2.5vw,1.3rem)',color:'#f1f5f9',letterSpacing:'0.22em',textShadow:'0 0 18px rgba(56,189,248,0.55)'}}>STELLAR PACT</h1>
            <Globe size={16} style={{color:'#38bdf8'}}/>
          </div>
          <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.9rem',color:'#7dd3fc',letterSpacing:'0.2em',fontWeight:300}}>
            {step==='galaxy'?'选择你的星系':step==='planet'?`在 ${selectedGalaxy?.name} 认领星球`:'主权宣示完成'}
          </p>
          {step!=='success'&&(
            <div className="flex items-center justify-center gap-2 mt-3">
              <div style={{width:8,height:8,borderRadius:'50%',background:'#7c3aed'}}/>
              <div style={{width:28,height:1,background:step==='planet'?'#7c3aed':'#1e293b',transition:'background 0.4s'}}/>
              <div style={{width:8,height:8,borderRadius:'50%',background:step==='planet'?'#7c3aed':'#1e293b',transition:'background 0.4s'}}/>
            </div>
          )}
        </div>

        {/* Step 1: Galaxy */}
        {step==='galaxy'&&(
          <div className="w-full max-w-5xl" style={{background:'rgba(7,3,22,0.82)',border:'1px solid rgba(109,40,217,0.3)',backdropFilter:'blur(14px)',padding:'20px'}}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={12} style={{color:'#7c3aed'}}/>
              <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.8rem',color:'#475569',fontWeight:300}}>宇宙星系登记处 · 选择一个星系，开始你的文明之旅</span>
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索星系名称、类型或环境标签..."
              className="w-full px-4 py-2.5 mb-4 focus:outline-none"
              style={{background:'rgba(12,7,32,0.9)',border:'1px solid rgba(109,40,217,0.3)',fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.9rem',color:'#e2e8f0',fontWeight:300}}/>
            {/* Env legend */}
            <div className="flex flex-wrap gap-4 mb-5">
              {Object.entries(ENV_CONFIG).map(([tag,cfg])=>(
                <div key={tag} className="flex items-center gap-1.5">
                  <span style={{fontSize:'0.8rem'}}>{cfg.icon}</span>
                  <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.72rem',color:cfg.color,fontWeight:400}}>{tag}</span>
                  <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.68rem',color:'#334155',fontWeight:300}}>— {cfg.desc}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filtered.map(g=><GalaxyCard key={g.id} galaxy={g} onSelect={()=>handleSelectGalaxy(g)}/>)}
            </div>
          </div>
        )}

        {/* Step 2: Planet */}
        {step==='planet'&&selectedGalaxy&&(
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5">
            {/* Form */}
            <div className="flex-1 p-5 md:p-6" style={{background:'rgba(7,3,22,0.82)',border:'1px solid rgba(109,40,217,0.3)',backdropFilter:'blur(14px)'}}>
              <button onClick={()=>{setStep('galaxy');setPlanet(null);}} className="flex items-center gap-1.5 mb-4 transition-opacity hover:opacity-70"
                style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.78rem',color:'#475569',fontWeight:300}}>
                <ArrowLeft size={12}/> 返回星系选择
              </button>
              {/* Galaxy badge */}
              <div className="flex items-center gap-2 mb-3 px-3 py-2" style={{background:`${selectedGalaxy.color}10`,border:`1px solid ${selectedGalaxy.color}30`}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:selectedGalaxy.color}}/>
                <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.9rem',fontWeight:500,color:selectedGalaxy.color}}>{selectedGalaxy.name}</span>
                <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.72rem',color:'#475569',fontWeight:300}}>{selectedGalaxy.id} · {selectedGalaxy.dist}</span>
              </div>

             <div className="space-y-4">
  {/* Name */}
  <div>
    <label className="block mb-1" style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.82rem',color:'#94a3b8',fontWeight:300}}>
      <span className="inline-flex items-center gap-1.5"><Sparkles size={13}/> 星球名称</span>
    </label>
    <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleGenerate()}
      placeholder="为你的星球命名..." maxLength={20} className="w-full px-4 py-2.5 focus:outline-none"
      style={{background:'rgba(12,7,32,0.9)',border:`1px solid ${nameError?'rgba(239,68,68,0.65)':'rgba(109,40,217,0.4)'}`,fontFamily:"'Noto Sans SC',sans-serif",fontSize:'1rem',color:'#e2e8f0',fontWeight:300,animation:nameError?'shake 0.35s ease':'none'}}/>
    {nameError&&<p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.78rem',color:'#ef4444',marginTop:'3px'}}>▶ 请为你的星球命名</p>}
  </div>
  {/* Planet setting hint - 移到星球名之后，大气层之前 */}
  <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.75rem',color:'#64748b',fontWeight:300,margin:'0 0 4px',lineHeight:1.6}}>
    <span style={{color:'#7c3aed',fontWeight:500}}>星球设定</span>
    {' · '}已根据星系环境预设大气成分、重力指标、水资源类型。顺从设定，还是偏离轨道挑战更奇妙的未知世界——由你决定！
  </p>

                <PixelSelect label="大气层成分" icon={<Wind size={13}/>} value={atmosphere} options={ATMOSPHERE_OPTIONS} onChange={setAtmosphere}/>
                <PixelSelect label="重力强度" icon={<Zap size={13}/>} value={gravity} options={GRAVITY_OPTIONS} onChange={setGravity}/>
                <PixelSelect label="水资源分布" icon={<Droplets size={13}/>} value={water} options={WATER_OPTIONS} onChange={setWater}/>

                {/* Flag customization */}
                <div style={{background:'rgba(10,5,30,0.5)',border:'1px solid rgba(139,92,246,0.2)',padding:'12px'}}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Flag size={12} style={{color:'#7c3aed'}}/>
                    <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.82rem',color:'#94a3b8',fontWeight:300}}>球旗设计</span>
                  </div>
                  <div className="mb-3">
                    <div style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.72rem',color:'#475569',marginBottom:'6px',fontWeight:300}}>旗帜颜色</div>
                    <div className="flex flex-wrap gap-2">
                      {FLAG_COLORS.map(c=>(
                        <button key={c} onClick={()=>setFlagColor(c)} style={{width:22,height:22,background:c,border:flagColor===c?'2px solid white':'2px solid transparent',borderRadius:'3px',transition:'transform 0.1s'}}
                          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='scale(1.2)'}
                          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='scale(1)'}/>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.72rem',color:'#475569',marginBottom:'6px',fontWeight:300}}>旗帜纹章</div>
                    <div className="flex flex-wrap gap-2">
                      {FLAG_SHAPES.map(s=>(
                        <button key={s} onClick={()=>setFlagShape(s)} style={{width:28,height:28,background:flagShape===s?`${flagColor}30`:'rgba(15,10,40,0.8)',border:flagShape===s?`1px solid ${flagColor}`:'1px solid rgba(139,92,246,0.2)',borderRadius:'3px',fontSize:'14px',color:flagShape===s?flagColor:'#64748b',display:'flex',alignItems:'center',justifyContent:'center'}}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleGenerate} disabled={generating} className="w-full py-3 transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
                  style={{background:generating?'rgba(67,20,107,0.5)':'linear-gradient(135deg,rgba(88,28,135,0.9) 0%,rgba(12,74,110,0.9) 100%)',border:'1px solid rgba(139,92,246,0.55)',fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.92rem',fontWeight:400,color:'#f1f5f9',letterSpacing:'0.08em',cursor:generating?'wait':'pointer'}}>
                  {generating?<span className="inline-flex items-center justify-center gap-2"><span style={{animation:'blink 0.65s step-end infinite'}}>▮</span> 正在生成...</span>:'生成我的星球'}
                </button>
              </div>
            </div>

            {/* Planet card */}
            <div className="flex-1 p-5 md:p-6" style={{background:'rgba(4,2,16,0.78)',border:`1px solid ${planet?'rgba(56,189,248,0.25)':'rgba(30,41,59,0.4)'}`,backdropFilter:'blur(14px)',minHeight:500,transition:'border-color 0.5s'}}>
              {planet?(
                <div key={cardKey} className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div style={{width:6,height:6,background:'#0284c7'}}/>
                    <span style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.8rem',color:'#475569',fontWeight:300}}>星球档案</span>
                  </div>
                  <PlanetCard planet={planet} onClaim={handleClaim}/>
                </div>
              ):(
                <div className="h-full flex flex-col items-center justify-center" style={{minHeight:420}}>
                  <div className="text-center">
                    <div style={{fontSize:'4rem',opacity:0.07,fontFamily:'monospace'}}>◯</div>
                    <p style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.85rem',color:'#1e293b',letterSpacing:'0.12em',lineHeight:2.4,marginTop:'12px',fontWeight:300}}>配置参数<br/>点击生成<br/>查看档案</p>
                    <div className="flex justify-center gap-2.5 mt-5">
                      {[0,0.4,0.8].map((delay,i)=><div key={i} style={{width:5,height:5,background:'#1e293b',animation:`blink 1.4s step-end ${delay}s infinite`}}/>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success */}
        {step==='success'&&claimedPlanet&&<SuccessScreen planet={claimedPlanet} onReset={handleReset}/>}

        <p className="mt-6 text-center select-none" style={{fontFamily:"'Noto Sans SC',sans-serif",fontSize:'0.68rem',color:'#1e293b',letterSpacing:'0.15em',fontWeight:300}}>
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

