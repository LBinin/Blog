// const { getBlogSidebar } = require('./menu')

module.exports = {
  title: 'Bigno',
  description: '🤟🏻',
  serviceWorker: true,
  contentLoading: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': '/'
      }
    }
  },
  markdown: {
    // lineNumbers: true,
    config: md => {
      // 使用 markdown-it 插件
      md.use(require('markdown-it-task-lists'))
    },
  },
  head: [
    // ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_906851_perbidcu3te.css' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],
  themeConfig: {
    sideBar: 'auto',
    sidebarDepth: 3,
    lastUpdated: '上次更新',
    repo: 'LBinin/blog',
    nav: [
      {
        text: '🌟博客',
        items: [
          { text: '导航', link: '/archives/' },
          { text: '前端', link: '/frontEnd/' },
          { text: '后端', link: '/backEnd/' },
          { text: '工具', link: '/tools/' }
        ]
      },
      { text: '📚学习', link: '/learn/' },
      { text: '⛅️日记', link: '/diary/' },
      { text: '🍃项目', link: '/project/' },
      { text: '💡Todo', link: '/todo/' },
      { text: '🍳杂记', link: '/note/' },
      { text: '👨🏻‍💻关于', link: '/about/' },
    ],
    sidebar: {
      '/frontEnd/': getBlogSidebar('前端'),
      '/backEnd/': getBlogSidebar('后端'),
      '/tools/': getBlogSidebar('工具'),
      '/learn/': getBlogSidebar('学习'),
      '/diary/': getBlogSidebar('日记'),
      '/note/': getBlogSidebar('杂记'),
      '/project/': getBlogSidebar('项目'),
    },
  },
  plugins: {
    'medium-zoom': true,
    '@vuepress/back-to-top': true,
  }
};

function getBlogSidebar(type) {
  switch (type) {
    case '前端':
      return [
        ['', '欢迎'],
        {
          title: 'JavaScript',
          // collapsable: false,
          children: [
            ['./JavaScript/JS-Array', 'Js 数组'],
            ['./JavaScript/JS-HOF', 'Js 高阶函数'],
            ['./JavaScript/JS-AOP', 'Js 面向切面编程 AOP'],
            ['./JavaScript/Curry', '柯里化 Curry'],
            ['./JavaScript/JS-Closure', '深入理解闭包及原理'],
            ['./JavaScript/JS-Prototype', '理解 JavaScript 的原型及原型链'],
            ['./JavaScript/JS-Event-Binding', 'Js 中事件绑定、事件代理和事件委托'],
            ['./JavaScript/Set-Map', 'Set 与 Map'],
            ['./JavaScript/Module-Import', '模块化中的 import 和 require'],
          ]
        },
        {
          title: 'React',
          // collapsable: false,
          children: [
            ['./React/React-HOC', 'React 高阶组件 HOC'],
            ['./React/React-Lifecycle', 'React 生命周期'],
          ]
        },
        {
          title: 'Vue',
          // collapsable: false,
        },
        {
          title: 'HTML',
          // collapsable: false,
          children: [
            ['./HTML/Form-Submit-Vaild', 'Form 表单提交方式、验证'],
          ]
        },
        {
          title: 'CSS',
          children: [
            ['./CSS/utils', 'CSS 工具库'],
          ]
        },
        {
          title: '基础知识',
          children: [
            ['./base/HTML5-New-Tags', 'HTML5 新标签'],
            ['./base/Repaint-Reflow', '重绘与回流'],
            ['./base/Regular-Expression', '正则表达式基础'],
            ['./base/Meta-Programming', '关于元数据和元编程'],
          ]
          // collapsable: false,
        },
        {
          title: '网络协议',
          // collapsable: false,
          children: [
            ['./network-protocol/CDN', '初探 CDN'],
            ['./network-protocol/DNS', '深入理解 DNS'],
          ]
        },
        {
          title: 'Git',
          children: [
            ['./Git/Personal-Work', '个人工作常用 Git 操作'],
            ['./Git/Merge-Rebase', 'merge 和 rebase 区别'],
            ['./Git/Travis-CI', '使用 Travis CI 实现 GitHub + Serve 自动部署'],
          ]
        },
        {
          title: '函数式编程',
          children: [
          ]
        },
        // {
        //   title: '设计模式',
        //   // collapsable: false,
        // },
        {
          title: '算法',
          children: [
            ['./algorithm/Sorting-Algorithm', '排序算法'],
          ]
        },
      ]

    case '后端':
      return [
        {
          title: '服务器',
          collapsable: false,
        }
      ]

    case '工具':
      return [
        ['', '工具集合'],
        {
          title: 'Mac',
          children: [
            ['./Mac/brew', 'Homebrew - Mac 下的包管理工具'],
            ['./Mac/zsh', '强大的 zsh 及 oh my zsh'],
          ]
        }
      ]

    case '学习':
      return [
        ['', '学无止境'],
        {
          title: 'TypeScript',
          children: [
            ['./typescript/introduction', 'TS 简介'],
            ['./typescript/base', 'TS 基础'],
            ['./typescript/advance', 'TS 进阶'],
          ]
        },
        {
          title: '掘金',
          children: [
            ['./juejin/webpack', '使用 webpack 定制前端开发环境']
          ]
        }
      ]

    case '日记':
      return [
        {
          title: '旅行',
          children: [
            ['./travel/shanghai/', '🚆 上海'],
          ]
        },
        {
          title: '日常',
        },
        {
          title: '工作',
          children: [
            ['./work/2018.11.21', '2018.11.21 Chart.js Resize 探究'],
            ['./work/2018.11.19', '2018.11.19 模块化探究'],
            ['./work/2018.09.21', '2018.09.21 探秘 visibility: collapse'],
            ['./work/2018.08.22', '2018.08.22 对象比较注意点'],
            ['./work/2018.08.21', '2018.08.21 webpack 编译带前缀 CSS 属性'],
            ['./work/2018.08.08', '2018.08.08 异步中使用 Event'],
            ['./work/2018.07.19', '2018.07.19 react-router 默认路由'],
            ['./work/2018.07.10', '2018.07.10 React Unmount 注意点'],
          ]
        }
      ]

    case '项目':
      return [
        ['./jianshu', 'XXX']
      ]


    case '杂记':
      return [
        ['', '杂记'],
        ['Hope', '愿'],
        ['If-You-Love-Me', '如果你爱我'],
      ]
  }
}