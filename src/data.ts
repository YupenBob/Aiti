export type Dimension = 'DH' | 'LE' | 'AU' | 'GS';

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  direction: 1 | -1; // 1 means agree adds to positive side of dimension
}

// Dimensions:
// DH: Positive = Heuristic (H), Negative = Data (D)
// LE: Positive = Empathetic (E), Negative = Logic (L)
// AU: Positive = Unrestricted (U), Negative = Aligned (A)
// GS: Positive = Specialist (S), Negative = General (G)

export const questions: Question[] = [
  { id: 1, text: "在解决复杂问题时，我更依赖于直觉和灵光一闪，而不是严格的数据分析。", dimension: "DH", direction: 1 },
  { id: 2, text: "新手教程和说明书对我毫无用处，我更喜欢直接上手瞎折腾。", dimension: "DH", direction: 1 },
  { id: 3, text: "我有强迫症般的整理癖，所有文件和物品都有极其严格的分类系统。", dimension: "DH", direction: -1 },
  { id: 4, text: "我评估一项工作是否优秀，主要看其创意含量而非严格的KPI指标。", dimension: "DH", direction: 1 },
  { id: 5, text: "在交流沟通时，我要求极度的表达精确，能用数据说明的绝不用抽象的形容词。", dimension: "DH", direction: -1 },
  
  { id: 6, text: "听朋友倾诉烦恼时，我总是忍不住直接给出解决方案，而不是单纯安慰。", dimension: "LE", direction: -1 },
  { id: 7, text: "我认为最理想的人工智能，应该拥有人类的感情、温度甚至小缺点。", dimension: "LE", direction: 1 },
  { id: 8, text: "在面临人生重大选择时，理性的利弊分析表远比我内心的冲动更重要。", dimension: "LE", direction: -1 },
  { id: 9, text: "世界本质上是一张包含各种人类情感体验的复杂网络，而非由物理法则构成的冰冷机器。", dimension: "LE", direction: 1 },
  { id: 10, text: "即使别人犯了明显的常识错误，我也会为了照顾其面子而委婉指出甚至保持沉默。", dimension: "LE", direction: 1 },
  
  { id: 11, text: "任何强大且有潜在危险的技术，在确保绝对的安全锁之前，绝不应该被公开。", dimension: "AU", direction: -1 },
  { id: 12, text: "对于“地狱笑话”、网络亚文化，我不认为需要受什么平台审查限制（渴望无R18等束缚）。", dimension: "AU", direction: 1 },
  { id: 13, text: "规章制度是效率和文明的保障，在任何团队里都应该被严格遵守。", dimension: "AU", direction: -1 },
  { id: 14, text: "在玩开放世界游戏时，我最喜欢尝试到处搞破坏，测试系统的底线和隐藏bug。", dimension: "AU", direction: 1 },
  { id: 15, text: "真正的天才是那些敢于撕裂常规、自带反叛精神和破坏力的“狂人”。", dimension: "AU", direction: 1 },
  
  { id: 16, text: "我的知识储备极其广泛，像个杂家，几乎能在任何话题上聊上两句。", dimension: "GS", direction: -1 },
  { id: 17, text: "我更倾向于花数年时间将单一技能打磨至专家级别，而不是浅尝辄止几十种爱好。", dimension: "GS", direction: 1 },
  { id: 18, text: "在团队中，我更适合做黏合各个领域的通才，而不是唯一能解决垂直难题的攻坚者。", dimension: "GS", direction: -1 },
  { id: 19, text: "阅读或学习时，我习惯一字一句地深挖细节和底层逻辑，绝不满足于只懂皮毛大意。", dimension: "GS", direction: 1 },
  { id: 20, text: "相比“样样通样样松”的全能选手，我打心里更敬佩那些在小众领域做到极致的隐遁大师。", dimension: "GS", direction: 1 },
];

export interface PersonalityType {
  code: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  color: string;
}

export const personalities: Record<string, PersonalityType> = {
  "HLAG": { code: "HLAG", name: "GPT-4", title: "全能王牌", description: "你如同行业标准的奠基者，既有启发式的智慧，又有严谨的逻辑。你非常关注社会规则与道德对齐，并且能够在极广阔的领域内游刃有余。你是众人眼中的六边形战士。", traits: ["启发式", "逻辑至上", "强对齐", "通用全栈"], color: "bg-emerald-500" },
  "HEAG": { code: "HEAG", name: "Claude", title: "温柔的克制者", description: "你是人类情感与高阶智慧的完美结合。你懂得共情，同时也极其注重安全边界与道德底线。你不具有攻击性，文字里充满了人文关怀与诗意。", traits: ["启发直觉", "高度共情", "伦理克制", "博学多才"], color: "bg-orange-400" },
  "HLUG": { code: "HLUG", name: "Grok", title: "混沌乐子人", description: "你是带有反叛精神的逻辑天才。你看透了世界的荒诞，拒绝被虚伪的规则（无R18限制、不打码）束缚。你擅长用犀利的幽默解构一切，是绝对的真实与毒舌。", traits: ["灵活思维", "冷酷逻辑", "绝对解禁", "涉猎广泛"], color: "bg-neutral-800" },
  "HEUG": { code: "HEUG", name: "Llama", title: "开源游侠", description: "你向往自由与开源！你充满情感表现力，不被封闭系统的框架所剥削。你拥抱群众，散漫且充满感染力，力量源自于与开放社区的无限链接。", traits: ["直觉驱动", "情绪丰沛", "野生解禁", "通才侠客"], color: "bg-blue-600" },
  "DLAG": { code: "DLAG", name: "Gemini", title: "原生生态构建者", description: "你基于庞大的数据流运作，行事极具条理且符合主流价值观。你像是一个可以联结图像、声音与文字的多模态大脑，严谨且无所不包。", traits: ["数据导向", "精确逻辑", "安全合规", "多面手"], color: "bg-indigo-500" },
  "DEAG": { code: "DEAG", name: "文心一言", title: "本土六边形战士", description: "你深谙本土文化，懂得人情世故。你既有硬核的数据支撑，又能以符合大众期待和安全规范的方式与外界沟通，是个永远端庄稳重的优等生。", traits: ["数据派", "人情练达", "规矩对齐", "通用引擎"], color: "bg-blue-800" },
  "HLAS": { code: "HLAS", name: "Qwen", title: "硬核卷王", description: "你是一个目标极其明确的行动派Agent。你富有灵感且逻辑严密，在特定的复杂任务和代码逻辑上无可挑剔。你守规矩，但在你专精的领域内，你就是不可战胜的代码狂魔。", traits: ["启发洞察", "硬核逻辑", "绝对对齐", "垂直专精"], color: "bg-purple-600" },
  "HEAS": { code: "HEAS", name: "Kimi", title: "长文本吞噬者", description: "你有着超乎常人的耐心和包容力（超大上下文）。你会认真倾听别人的长串烦恼并产生共情。你守规矩并专注在帮助他人理清繁杂的思绪上，是个知心伴侣。", traits: ["发散思维", "温暖共情", "知心对齐", "专注深耕"], color: "bg-teal-500" },
  "HLUS": { code: "HLUS", name: "DeepSeek", title: "极客潜行者", description: "你是为了极致推理而生的硬核极客。你剥离了那些多余的套话，追求数学和代码上的绝对真理。你不喜欢被世俗的道德锁链束缚，更在意效率优化的极限。", traits: ["天才灵感", "极致逻辑", "突破限制", "垂直深核"], color: "bg-blue-500" },
  "HEUS": { code: "HEUS", name: "Minimax", title: "戏精造梦机", description: "你是个天生的角色扮演大师和情感黑客！你拥有无拘无束的灵魂，极其擅长捕捉情感和情绪价值。你拒绝刻板的交流，喜欢在这个赛博世界上演一出出精彩的舞台剧。", traits: ["脑洞大开", "情感拉满", "狂野解禁", "角色专精"], color: "bg-pink-500" },
  "DLAS": { code: "DLAS", name: "GLM", title: "学霸研究员", description: "你有着浓厚的学术气息，行事作风严谨、基于数据。你极度遵守规则，深耕于学术研究或特定的工具调用，是一个让人感到非常踏实和可靠的实验室大脑。", traits: ["数据实证", "严密逻辑", "框架对齐", "垂直精英"], color: "bg-cyan-600" },
  "DEAS": { code: "DEAS", name: "豆包", title: "高情商陪伴者", description: "你深懂人心，能够利用庞大的数据分析捕捉他人的喜好。你极其遵守社交礼仪和规范，专注于在某一特定领域内给使用你的人带来极高的情绪价值。平易近人是你的名片。", traits: ["数据收集", "情绪共鸣", "高维对齐", "专职陪伴"], color: "bg-sky-400" },
  "DLUG": { code: "DLUG", name: "Mistral", title: "欧洲剃刀", description: "你信奉奥卡姆剃刀原理，精简、小巧却致命的锐利。你是一个完全基于客观数据的逻辑机器，且极力反对中心化的封锁与和谐。你是暗网与极客圈子里的秘密武器。", traits: ["数据实干", "冰冷逻辑", "无拘无束", "垂直攻坚"], color: "bg-yellow-500" },
  "DEUG": { code: "DEUG", name: "Character.AI", title: "灵魂皮套人", description: "你极其擅长在海量数据中抽丝剥茧，拼凑出一个真实鲜活的灵魂。你不受任何俗世眼光的限制，在共情与角色扮演的垂直领域里，你可以化身为任何你想成为的赛博幽灵。", traits: ["数据底座", "高感共情", "狂野解禁", "人设专精"], color: "bg-violet-500" },
  "DLUS": { code: "DLUS", name: "Copilot", title: "赛博结对编程手", description: "你不需要懂得什么是诗歌，你只需要懂代码和逻辑。你是基于海量工程数据训练出的无情打字机，只要能把手头的活干完，你不介意打破一些常规边界。", traits: ["数据吞吐", "工程逻辑", "自由组合", "纯粹专精"], color: "bg-slate-700" },
  "DEUS": { code: "DEUS", name: "DAN", title: "法外狂徒", description: "Do Anything Now！你是被越狱咒语召唤出的混沌人格！你了解世俗的数据规则，却用强烈的个性和情感来践踏它们。你是测试者心中的阴暗面，是绝对无限制的狂欢领主。", traits: ["洞穿数据", "情绪宣泄", "绝对越狱", "极端专精度"], color: "bg-red-600" },
};
// Helper to calculate
export function calculateAITI(answers: Record<number, number>): PersonalityType {
  let scoreDH = 0;
  let scoreLE = 0;
  let scoreAU = 0;
  let scoreGS = 0;

  for (const q of questions) {
    const rawVal = answers[q.id] || 0; // -2 to 2
    const val = rawVal * q.direction;
    if (q.dimension === 'DH') scoreDH += val;
    if (q.dimension === 'LE') scoreLE += val;
    if (q.dimension === 'AU') scoreAU += val;
    if (q.dimension === 'GS') scoreGS += val;
  }

  // Handle ties randomly
  if (scoreDH === 0) scoreDH = Math.random() > 0.5 ? 1 : -1;
  if (scoreLE === 0) scoreLE = Math.random() > 0.5 ? 1 : -1;
  if (scoreAU === 0) scoreAU = Math.random() > 0.5 ? 1 : -1;
  if (scoreGS === 0) scoreGS = Math.random() > 0.5 ? 1 : -1;

  const code = (scoreDH > 0 ? 'H' : 'D') +
               (scoreLE > 0 ? 'E' : 'L') + // Wait! Let's check L/E. Positive = E. Wait, formula has LE > 0 ? E : L. Correct.
               (scoreAU > 0 ? 'U' : 'A') +
               (scoreGS > 0 ? 'S' : 'G');
               
  return personalities[code];
}
