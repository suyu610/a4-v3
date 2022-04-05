// config.js
const config = {

  // 域名前缀 
  // api_base_url: 'https://beta.opentext.press/v1',
  // api_base_url: 'http://localhost:6110/v2', 
  api_base_url: 'http://192.168.43.29:6110/v2',
  // api_base_url: 'http://10.195.247.202:6110/v2', 

  // 词书信息
  dictInfo: {
    "0101": {
      name: "人教版一年级上",
      totalWordNum: 53,
      desc: "完整收录四级大纲词汇，高级备考之选"
    }, 
    "0201": {
      name: "初中英语词汇",
      totalWordNum: 1849,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0202": {
      name: "中考核心词汇",
      totalWordNum: 2140,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0203": {
      name: "中考英语词汇",
      totalWordNum: 2559,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0301": {
      name: "高中英语词汇",
      totalWordNum: 3786,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0302": {
      name: "高考大纲词汇",
      totalWordNum: 3635,
      desc: "完整收录四级大纲词汇，高级备考之选",
      isHot: true
    },
    "0303": {
      name: "高考英语词汇",
      totalWordNum: 4077,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0401": {
      name: "四级核心词汇",
      totalWordNum: 5193,
      isHot: true,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0402": {
      name: "四级大纲词汇",
      totalWordNum: 6298,
      desc: "完整收录四级大纲词汇，高级备考之选"

    },
    "0403": {
      name: "六级核心词汇",
      totalWordNum: 5328,
      isHot: true,
      desc: "完整收录四级大纲词汇，高级备考之选完整收录四级大纲词汇，高级备考之选完整收录四级大纲词汇，高级备考之选完整收录四级大纲词汇，高级备考之选完整收录四级大纲词汇，高级备考之选"
    },
    "0404": {
      name: "六级大纲词汇",
      totalWordNum: 8013,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0405": {
      name: "专四词汇",
      totalWordNum: 4875,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0406": {
      name: "专八词汇",
      totalWordNum: 5829,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0407": {
      name: "专升本词汇",
      totalWordNum: 3218,
      isHot: true,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0501": {
      name: "考研核心词汇",
      totalWordNum: 2015,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0502": {
      name: "考研大纲词汇",
      totalWordNum: 5617,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0503": {
      name: "考研英语词汇",
      totalWordNum: 6088,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0601": {
      name: "托福核心词汇",
      totalWordNum: 4264,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0602": {
      name: "托福词汇",
      totalWordNum: 5224,
      isHot: true,

      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0603": {
      name: "雅思核心词汇",
      totalWordNum: 3838,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0604": {
      name: "雅思词汇",
      totalWordNum: 5470,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0605": {
      name: "GRE核心词汇",
      totalWordNum: 2968,
      desc: "完整收录四级大纲词汇，高级备考之选"
    },
    "0606": {
      name: "GRE词汇",
      totalWordNum: 6513,
      desc: "完整收录四级大纲词汇，高级备考之选"
    }
  },

  abbrDict: {
    "noun": ["noun", "名词"],
    "verb": ["verb", "动词"],
    "adverb": ["adv", "副词"],
    "conjunction": ["conj", "连词"],
    "adjective": ["adj", "形容词"],
    "preposition": ["prep", "介词"],
    "pronoun": ["pron", "代词"],
    "interjection": ["int", "感叹词"],
    "adjective suffix": ["", "形容词后缀"],
    "abbreviation": ["abbr", "缩写"],
    "noun suffix": ["", "名词后缀"],
    "definite article": ["", "定冠词"],
    "adjective or adverb": ["adj or adv", "形容词或副词"],
    "indefinite article": ["", "非定冠词"],
    "preposition or conjunction": ["prep or conj", "介词或连词"],
    "": ["blank", "缺省"]
  }
}

export default config