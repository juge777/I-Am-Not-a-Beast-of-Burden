

import { JobConfig, Profession, GameAction, NPCConfig, SceneType, OriginConfig, OriginType, SkillConfig, RandomEvent } from './types';

// --- ORIGINS ---
export const ORIGINS: Record<OriginType, OriginConfig> = {
  GRINDER: {
    id: 'GRINDER',
    name: '小镇做题家',
    title: 'The Grinder',
    description: '背负巨额助学贷款，为了留在大城市只能拼命卷。',
    passive: '【内卷之王】工作收益+20%，但更容易积攒怒气。',
    avatarStyle: { skin: '#fde047', hair: '#000000', accessory: 'GLASSES' },
    baseStats: { money: -50000, charm: 10, intellect: 90 }
  },
  HEIR: {
    id: 'HEIR',
    name: '体验生活富二代',
    title: 'The Heir',
    description: '如果不努力工作，就只能回家继承亿万家产。',
    passive: '【钞能力】开局自带资金，可以使用金钱消除怒气。',
    avatarStyle: { skin: '#ffedd5', hair: '#f59e0b', accessory: 'SUNGLASSES' },
    baseStats: { money: 1000000, charm: 50, intellect: 40 }
  },
  SOCIALITE: {
    id: 'SOCIALITE',
    name: '精致白富美',
    title: 'The Socialite',
    description: '职场对你来说不仅是工作，更是社交场。',
    passive: '【八面玲珑】NPC好感度获取速度翻倍。',
    avatarStyle: { skin: '#fff1f2', hair: '#be123c', accessory: 'JEWELRY' },
    baseStats: { money: 50000, charm: 90, intellect: 60 }
  }
};

// --- SKILLS ---
export const SKILLS: SkillConfig[] = [
  // EFFICIENCY BRANCH
  {
    id: 'eff_typing',
    name: '键盘车神',
    description: '提升工作效率。每次【努力搬砖】获得的 Favor 增加 20%。',
    category: 'EFFICIENCY',
    cost: 1,
    maxLevel: 5,
    icon: 'Zap'
  },
  {
    id: 'eff_coffee',
    name: '咖啡续命',
    description: '减少工作冷却时间。你需要更多咖啡因！(冷却 -10%)',
    category: 'EFFICIENCY',
    cost: 2,
    maxLevel: 3,
    icon: 'Coffee',
    reqId: 'eff_typing'
  },
  {
    id: 'eff_auto',
    name: '摸鱼脚本',
    description: '每秒自动获得少量 Favor。解放双手！',
    category: 'EFFICIENCY',
    cost: 5,
    maxLevel: 1,
    icon: 'Bot',
    reqId: 'eff_coffee'
  },
  
  // POLITICS BRANCH
  {
    id: 'pol_smile',
    name: '职业假笑',
    description: '提升社交效果。【端茶倒水/PPT】类技能收益增加 25%。',
    category: 'POLITICS',
    cost: 1,
    maxLevel: 5,
    icon: 'Smile'
  },
  {
    id: 'pol_gossip',
    name: '情报网络',
    description: '茶水间八卦不仅能回怒气，还能少量增加 Favor。',
    category: 'POLITICS',
    cost: 2,
    maxLevel: 3,
    icon: 'Radio',
    reqId: 'pol_smile'
  },
  {
    id: 'pol_master',
    name: '画饼大师',
    description: '你也能给老板画饼。所有【Please】类技能有几率暴击（双倍收益）。',
    category: 'POLITICS',
    cost: 5,
    maxLevel: 1,
    icon: 'Crown',
    reqId: 'pol_gossip'
  },

  // SURVIVAL BRANCH
  {
    id: 'sur_zen',
    name: '禅定模式',
    description: '增加怒气上限 +100。更能忍了。',
    category: 'SURVIVAL',
    cost: 1,
    maxLevel: 5,
    icon: 'Heart'
  },
  {
    id: 'sur_gym',
    name: '健身卡',
    description: '提升武力值。【暴力】类技能伤害增加 30%。',
    category: 'SURVIVAL',
    cost: 2,
    maxLevel: 3,
    icon: 'Dumbbell',
    reqId: 'sur_zen'
  },
  {
    id: 'sur_law',
    name: '劳动法',
    description: '精通劳动法。离职/仲裁时获得巨额赔偿金。',
    category: 'SURVIVAL',
    cost: 5,
    maxLevel: 1,
    icon: 'Scale',
    reqId: 'sur_gym'
  }
];

// --- EVENTS ---
export const RANDOM_EVENTS: RandomEvent[] = [
  // BOSS MISTRESS SCENARIO (The requested feature)
  {
    id: 'evt_boss_secret',
    title: '楼梯间的秘密',
    description: '午休时间你去楼梯间抽烟，意外撞见老板正抱着那个新来的实习生...他们举止亲密，并没有发现你。',
    npcRole: 'BOSS',
    triggerChance: 0.15,
    options: [
      {
        label: '拍照留存',
        description: '这可是核武器',
        outcome: { sp: 2, rage: -20, favor: 10, feedbackText: '咔嚓。视频非常清晰。你掌握了老板的命门！(获得技能点)' }
      },
      {
        label: '勒索加薪',
        description: '富贵险中求',
        outcome: { money: 20000, favor: 50, rage: -50, feedbackText: '老板脸色铁青地给你转了账，并承诺下月晋升你。' }
      },
      {
        label: '咳嗽一声',
        description: '提醒他们',
        outcome: { rage: 20, favor: -50, feedbackText: '老板吓了一跳，随后用要杀人的眼神瞪了你一眼。好感度大降！' }
      }
    ]
  },
  // OFFICE POLITICS SCENARIO
  {
    id: 'evt_betrayal',
    title: '被背刺了',
    description: '你发现你信任的同事Gary把你做的方案改成了他的名字发给了大老板，并且还获得了一致好评。',
    npcRole: 'COLLEAGUE',
    triggerChance: 0.2,
    options: [
      {
        label: '当众揭穿',
        description: '忍不了一点',
        outcome: { rage: -100, favor: -20, feedbackText: '你在会上大闹一场，虽然爽了，但大家觉得你情绪不稳定。' }
      },
      {
        label: '私下谈判',
        description: '利益交换',
        outcome: { money: 1000, rage: 10, feedbackText: 'Gary心虚地分了你一半奖金作为封口费。' }
      },
      {
        label: '隐忍不发',
        description: '君子报仇',
        outcome: { sp: 1, rage: 50, feedbackText: '你默默记下了这笔账。心机+1，获得技能点。' }
      }
    ]
  },
  // HEADHUNTER SCENARIO
  {
    id: 'evt_offer',
    title: '猎头来电',
    description: '竞争对手公司打来电话，开出了双倍薪资挖你，但要求你带走现在的核心代码。',
    npcRole: 'HR',
    triggerChance: 0.1,
    options: [
      {
        label: '严词拒绝',
        description: '职业操守',
        outcome: { favor: 40, money: 0, feedbackText: '老板无意中听到了你的拒绝，对你的忠诚度非常满意。' }
      },
      {
        label: '有些心动',
        description: '那可是双倍',
        outcome: { rage: 20, favor: -10, feedbackText: '你犹豫的态度被HR看在眼里，她开始提防你了。' }
      },
      {
        label: '双面间谍',
        description: '两头通吃',
        outcome: { money: 5000, favor: 20, sp: 1, feedbackText: '你假装答应猎头套取了竞对情报，反手汇报给老板。赢麻了！' }
      }
    ]
  },
  {
    id: 'evt_blame',
    title: '背锅侠降临',
    description: '线上系统崩溃了，虽然不是你写的代码，但你是最后提交的人。总监正在找人背锅。',
    npcRole: 'COLLEAGUE',
    triggerChance: 0.15,
    options: [
      {
        label: '甩锅给实习生',
        description: '他还年轻',
        outcome: { favor: 30, rage: -20, sp: 1, feedbackText: '实习生哭着背了锅，高层觉得你很有管理手腕。' }
      },
      {
        label: '主动背锅',
        description: '是个汉子',
        outcome: { favor: -30, rage: 50, sp: 2, feedbackText: '虽然被骂了，但你在团队中威望提升了。' }
      },
      {
        label: '通宵修复',
        description: '技术解决',
        outcome: { favor: 50, rage: 100, feedbackText: '问题解决了，但你的发际线后移了2厘米。' }
      }
    ]
  },
  {
    id: 'evt_coffee',
    title: '下午茶拼单',
    description: '行政部的小美问你要不要一起拼奶茶，满200减20。',
    npcRole: 'HR',
    triggerChance: 0.2,
    options: [
      {
        label: '请全组喝',
        description: '收买人心 -$200',
        outcome: { money: -200, favor: 25, rage: -30, feedbackText: '大家都说你大气！好感度UP！' }
      },
      {
        label: '只点自己的',
        description: ' -$20',
        outcome: { money: -20, rage: -10, feedbackText: '奶茶真好喝。' }
      },
      {
        label: '减肥，不喝',
        description: '不合群',
        outcome: { favor: -5, rage: 10, feedbackText: '你显得有点不合群。' }
      }
    ]
  }
];

// --- NPCS ---
export const NPCS: Record<string, NPCConfig> = {
  HR: {
    id: 'hr_linda',
    name: 'HR Linda',
    role: 'HR',
    avatarColor: '#ec4899',
    dialogues: [
      "亲爱的，这是你的入职合同，签了就是一家人。",
      "离职流程很复杂的，要走三十天流程哦。",
      "公司福利很好的，有免费的白开水。",
      "你的考勤有点问题..."
    ]
  },
  COLLEAGUE: {
    id: 'colleague_gary',
    name: '老油条 Gary',
    role: 'COLLEAGUE',
    avatarColor: '#3b82f6',
    dialogues: [
      "听说隔壁部门又裁员了。",
      "帮我看个Bug，我这有点急事（溜）。",
      "老板今天心情不好，别去触霉头。",
      "奶茶拼单吗？"
    ]
  }
};

// Actions available at different stages
const COMMON_VIOLENCE: GameAction[] = [
  { id: 'punch', label: '升龙拳', description: '耗油跟!', type: 'VIOLENCE', cost: 100, value: 20, cooldown: 500 },
  { id: 'kick', label: '旋风腿', description: '加加布鲁根!', type: 'VIOLENCE', cost: 100, value: 30, cooldown: 800 },
  { id: 'scold', label: '嘴炮', description: '含妈量极高', type: 'VIOLENCE', cost: 100, value: 15, cooldown: 200 },
  { id: 'combo', label: '超必杀', description: 'KO!!!', type: 'VIOLENCE', cost: 300, value: 100, cooldown: 2000 },
];

const WORK_ACTIONS: GameAction[] = [
  { id: 'work_hard', label: '努力搬砖', description: '+Favor -Rage', type: 'WORK', value: 10, cooldown: 1000, targetScene: 'WORKSTATION' },
  { id: 'gossip', label: '茶水间八卦', description: '触发奇遇', type: 'TALK', value: 15, cooldown: 2000, targetScene: 'WORKSTATION' },
  { id: 'help', label: '帮同事背锅', description: '+Favor ++Rage', type: 'PLEASE', value: 20, cooldown: 3000, targetScene: 'WORKSTATION' },
];

const HR_ACTIONS: GameAction[] = [
  { id: 'onboard', label: '办理入职', description: '开始牛马生涯', type: 'PLEASE', value: 0, cooldown: 10000, targetScene: 'HR' },
  { id: 'resign', label: '申请离职', description: '老子不干了', type: 'REBEL', value: 0, cooldown: 5000, targetScene: 'HR' },
  { id: 'argue_hr', label: '仲裁警告', description: '硬刚HR', type: 'VIOLENCE', cost: 50, value: 50, cooldown: 2000, targetScene: 'HR' }
];

export const SEAFOOD_INSULTS = [
  "咸鱼!", "扑街!", "香蕉皮!", "大闸蟹!", "牛马!", "收皮啦!", "顶你个肺!", "废物!", "哪位呀?"
];

export const JOBS: Record<Profession, JobConfig> = {
  [Profession.INTERN]: {
    id: Profession.INTERN,
    title: "卑微实习生",
    bossName: "苛刻主管",
    bossAvatarColor: "#475569",
    playerAvatarColor: "#94a3b8",
    maxFavor: 100,
    actions: [
      { id: 'tea', label: '端茶倒水', description: '老板请喝茶', type: 'PLEASE', value: 10, cooldown: 1500, targetScene: 'BOSS_OFFICE' },
      { id: 'clean', label: '打扫卫生', description: '我爱扫地', type: 'PLEASE', value: 15, cooldown: 2000, targetScene: 'BOSS_OFFICE' },
      { id: 'slack', label: '厕所摸鱼', description: '带薪拉屎', type: 'REBEL', value: 10, cooldown: 1000, targetScene: 'BOSS_OFFICE' },
    ],
    enemyTexts: ['杂活', '复印', '跑腿', '订饭'],
    color: '#94a3b8',
    machineName: '碎纸机'
  },
  [Profession.JUNIOR]: {
    id: Profession.JUNIOR,
    title: "初级社畜",
    bossName: "画饼经理",
    bossAvatarColor: "#7c2d12",
    playerAvatarColor: "#3b82f6",
    maxFavor: 250,
    actions: [
      { id: 'ot', label: '主动加班', description: '007是福报', type: 'PLEASE', value: 20, cooldown: 2500, targetScene: 'BOSS_OFFICE' },
      { id: 'laugh', label: '尬笑', description: '老板真幽默', type: 'PLEASE', value: 15, cooldown: 1500, targetScene: 'BOSS_OFFICE' },
      { id: 'refuse', label: '准点下班', description: '到点就跑', type: 'REBEL', value: 20, cooldown: 2000, targetScene: 'BOSS_OFFICE' },
    ],
    enemyTexts: ['Bug', '需求', '周报', '会议'],
    color: '#3b82f6',
    machineName: '背锅侠'
  },
  [Profession.SENIOR]: {
    id: Profession.SENIOR,
    title: "资深油条",
    bossName: "更年期总监",
    bossAvatarColor: "#be123c",
    playerAvatarColor: "#10b981",
    maxFavor: 500,
    actions: [
      { id: 'pot', label: '替老板背锅', description: '是我的错', type: 'PLEASE', value: 40, cooldown: 4000, targetScene: 'BOSS_OFFICE' },
      { id: 'teach', label: '反向画饼', description: '我也能忽悠', type: 'REBEL', value: 35, cooldown: 3000, targetScene: 'BOSS_OFFICE' },
    ],
    enemyTexts: ['架构', '评审', '带人', '规划'],
    color: '#10b981',
    machineName: '太极拳'
  },
  [Profession.MANAGER]: {
    id: Profession.MANAGER,
    title: "小组长",
    bossName: "空降高管",
    bossAvatarColor: "#4c1d95",
    playerAvatarColor: "#f59e0b",
    maxFavor: 1000,
    actions: [
      { id: 'report', label: '精美PPT', description: '全是废话', type: 'PLEASE', value: 80, cooldown: 4000, targetScene: 'BOSS_OFFICE' },
      { id: 'spy', label: '打小报告', description: '不仅卷还坏', type: 'PLEASE', value: 100, cooldown: 6000, targetScene: 'BOSS_OFFICE' },
      { id: 'deny', label: '直接回怼', description: '你行你上', type: 'REBEL', value: 80, cooldown: 3000, targetScene: 'BOSS_OFFICE' },
    ],
    enemyTexts: ['汇报', '预算', '招聘', '画饼'],
    color: '#f59e0b',
    machineName: 'PPT机'
  },
  [Profession.DIRECTOR]: {
    id: Profession.DIRECTOR,
    title: "合伙人",
    bossName: "董事长",
    bossAvatarColor: "#000000",
    playerAvatarColor: "#dc2626",
    maxFavor: 9999,
    actions: [
      { id: 'ipo', label: '上市敲钟', description: '财务自由', type: 'PLEASE', value: 500, cooldown: 10000, targetScene: 'BOSS_OFFICE' },
      { id: 'coup', label: '篡位', description: '我才是老板', type: 'REBEL', value: 1000, cooldown: 10000, targetScene: 'BOSS_OFFICE' },
    ],
    enemyTexts: ['战略', '融资', '上市', '收购'],
    color: '#dc2626',
    machineName: '印钞机'
  }
};

export const GET_SCENE_ACTIONS = (job: Profession, scene: SceneType): GameAction[] => {
  if (scene === 'HR') return HR_ACTIONS;
  if (scene === 'WORKSTATION') return WORK_ACTIONS;
  
  // Boss Office
  return [...JOBS[job].actions, ...COMMON_VIOLENCE];
};

export const BOSS_QUOTES = [
  "年轻人要多吃苦！",
  "这个需求很简单，下班前给我。",
  "公司就是你的家。",
  "不要问公司给了你什么...",
  "我看好你，明年给你加薪。",
  "这点压力都顶不住？",
  "周末稍微加个班。",
  "由于大环境影响...",
  "要有狼性！"
];