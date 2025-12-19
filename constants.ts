import { SearchEngine, SearchEngineType, Quote } from './types';
import { BaiduIcon, GoogleIcon, BingIcon, BilibiliIcon, GeminiIcon, DuckDuckGoIcon } from './components/Icons';

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    type: SearchEngineType.BAIDU,
    name: '百度',
    icon: BaiduIcon,
    urlTemplate: 'https://www.baidu.com/s?wd={query}',
    placeholder: '百度一下，你就知道'
  },
  {
    type: SearchEngineType.GOOGLE,
    name: 'Google',
    icon: GoogleIcon,
    urlTemplate: 'https://www.google.com/search?q={query}',
    placeholder: '在 Google 上搜索...'
  },
  {
    type: SearchEngineType.BING,
    name: 'Bing',
    icon: BingIcon,
    urlTemplate: 'https://www.bing.com/search?q={query}',
    placeholder: '微软 Bing 搜索...'
  },
  {
    type: SearchEngineType.BILIBILI,
    name: 'Bilibili',
    icon: BilibiliIcon,
    urlTemplate: 'https://search.bilibili.com/all?keyword={query}',
    placeholder: '搜索 B 站视频...'
  },
  {
    type: SearchEngineType.GEMINI,
    name: 'Gemini',
    icon: GeminiIcon,
    urlTemplate: 'https://gemini.google.com/app?q={query}',
    placeholder: '询问 Gemini AI...'
  },
  {
    type: SearchEngineType.DUCKDUCKGO,
    name: 'DuckDuckGo',
    icon: DuckDuckGoIcon,
    urlTemplate: 'https://duckduckgo.com/?q={query}',
    placeholder: '隐私搜索...'
  }
];

export const QUOTES: Quote[] = [
  // --- 古典哲学与诗词 ---
  { text: "知行合一", author: "王阳明" },
  { text: "逝者如斯夫，不舍昼夜", author: "孔子" },
  { text: "不积跬步，无以至千里", author: "荀子" },
  { text: "天行健，君子以自强不息", author: "周易" },
  { text: "海纳百川，有容乃大", author: "林则徐" },
  { text: "路漫漫其修远兮，吾将上下而求索", author: "屈原" },
  { text: "大漠孤烟直，长河落日圆", author: "王维" },
  { text: "行到水窮處，坐看雲起時", author: "王维" },
  { text: "非淡泊无以明志，非宁静无以致远", author: "诸葛亮" },
  { text: "曾经沧海难为水，除却巫山不是云", author: "元稹" },
  { text: "人生若只如初见", author: "纳兰性德" },
  { text: "仰天大笑出门去，我辈岂是蓬蒿人", author: "李白" },
  { text: "众里寻他千百度", author: "辛弃疾" },
  { text: "此时无声胜有声", author: "白居易" },
  { text: "心远地自偏", author: "陶渊明" },

  // --- 现代文学与随笔 ---
  { text: "生如夏花之绚烂，死如秋叶之静美", author: "泰戈尔" },
  { text: "不乱于心，不困于情", author: "丰子恺" },
  { text: "从前的日色变得慢，车，马，邮件都慢", author: "木心" },
  { text: "这里有最好的时代，这里有最坏的时代", author: "狄更斯" },
  { text: "满地都是六便士，他却抬头看见了月亮", author: "毛姆" },
  { text: "我见青山多妩媚，料青山见我应如是", author: "辛弃疾" },
  { text: "生活在别处", author: "兰波" },
  { text: "万物皆有裂痕，那是光照进来的地方", author: "莱昂纳德" },
  { text: "未经审视的人生不值得过", author: "苏格拉底" },
  { text: "给岁月以文明，而不是给文明以岁月", author: "刘慈欣" },
  { text: "人不是为了失败而生的", author: "海明威" },
  { text: "世界上只有一种英雄主义", author: "罗曼·罗兰" },
  { text: "你的负担将变成礼物，你受的苦将照亮你的路", author: "泰戈尔" },
  
  // --- 短句与格言 ---
  { text: "慎独", author: "曾国藩" },
  { text: "上善若水", author: "老子" },
  { text: "初心", author: "华严经" },
  { text: "无问西东", author: "清华校歌" },
  { text: "道法自然", author: "老子" },
  { text: "凡属过去，皆为序章", author: "莎士比亚" },
  { text: "Stay Hungry, Stay Foolish", author: "Jobs" },
  { text: "凛冬将至", author: "权力的游戏" }
];

export const WALLPAPER_URL_BASE = "https://picsum.photos/1920/1080?random=";
