module.exports = {
  title: 'Bigno',
  description: '🤟🏻',
  contentLoading: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': '/'
      }
    }
  },
  locales: {
    '/': {
      lang: 'zh-CN',
    }
  },
  markdown: {
    // lineNumbers: true,
  },
  extendMarkdown: md => {
    // 使用 markdown 插件
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/images/61541493496_.pic.jpg' }],
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
          { text: '工具', link: '/tools/' },
          { text: '兴趣', link: '/interest/' },
        ]
      },
      { text: '📚学习', link: '/learn/' },
      { text: '✒️手记', link: '/words/' },
      { text: '🍃项目', link: '/project/' },
      { text: '💡Todo', link: '/todo/' },
      { text: '👨🏻‍💻关于', link: '/about/' },
    ],
    sidebar: {
      '/frontEnd/': getBlogSidebar('前端'),
      '/backEnd/': getBlogSidebar('后端'),
      '/tools/': getBlogSidebar('工具'),
      '/interest/': getBlogSidebar('兴趣'),
      '/learn/': getBlogSidebar('学习'),
      '/words/': getBlogSidebar('手记'),
      '/project/': getBlogSidebar('项目'),
    },
  },
  plugins: {
    '@vuepress/medium-zoom': true,
    '@vuepress/back-to-top': true,
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: {
        message: "遭遇！野生的博客之神！",
        buttonText: "点我更新"
      },
      popupComponent: 'update-popup',
    },
    '@vssue/vuepress-plugin-vssue': {
      // 设置 `platform` 而不是 `api`
      platform: 'github',

      // 其他的 Vssue 配置
      owner: 'LBinin',
      repo: 'blog',
      clientId: '3f1773bdba3e6412b1c3',
      clientSecret: 'c32ecbe171c0e428c6a201f119e6a343c9ff0e59',
    },
  }
};

function getBlogSidebar(type) {
  switch (type) {
    case '前端':
      return [
        ['', '欢迎'],
        {
          // collapsable: false,
          title: 'JavaScript',
          children: [
            ['./JavaScript/JS-Array', 'Js 数组'],
            ['./JavaScript/JS-HOF', 'Js 高阶函数 HOF'],
            ['./JavaScript/JS-AOP', 'Js 面向切面编程 AOP'],
            ['./JavaScript/Curry', '柯里化 Curry'],
            ['./JavaScript/JS-Closure', '深入理解闭包及原理'],
            ['./JavaScript/JS-Prototype', '理解 JavaScript 的原型及原型链'],
            ['./JavaScript/JS-Event-Binding', 'Js 中事件绑定、事件代理和事件委托'],
            ['./JavaScript/Set-Map', 'Set 与 Map'],
            ['./JavaScript/Module-Import', '模块化中的 import 和 require'],
            ['./JavaScript/JS-Equality-Comparisons', 'Js 中的相等判断及类型转换'],
          ]
        },
        {
          title: 'React',
          children: [
            ['./React/React-HOC', 'React 高阶组件 HOC'],
            ['./React/React-SFC', 'React SFC 无状态组件及多种组件写法'],
            ['./React/React-Lifecycle', 'React 生命周期'],
          ]
        },
        {
          title: 'Vue',
          children: [
            ['./Vue/ssr', 'Vue SSR 指南'],
          ],
        },
        {
          title: 'HTML',
          children: [
            ['./HTML/Form-Submit-Vaild', 'Form 表单提交方式、验证'],
          ]
        },
        {
          title: 'CSS',
          children: [
            // ['./CSS/zindex', 'z-index 详解'],
            ['./CSS/css-stacking-context', '深入理解 CSS 层叠上下文'],
            // ['./CSS/block-formatting-context', '深入理解块级格式化上下文（BFC）及应用'],
            ['./CSS/mix-blend-mode', 'CSS 混合模式及 isolation 的作用和表现'],
            ['./CSS/utils', 'CSS 工具库'],
            ['./CSS/NormalizeCSS', 'Normalize.css'],
            ['./CSS/CSS-Hover-Perceptual', '利用纯 CSS 完成感知悬停'],
            ['./CSS/will-change', '关于 will-change 的用法以及一些 web 动画渲染优化'],
            ['./CSS/animation-connection', '论不同动画衔接之间的小技巧'],
          ]
        },
        {
          title: '基础知识',
          children: [
            ['./base/HTML5-New-Tags', 'HTML5 新标签'],
            ['./base/Repaint-Reflow', '重绘与回流'],
            ['./base/Regular-Expression', '正则表达式基础'],
            ['./base/Critical-Rendering-Path', '浏览器渲染中的「关键渲染路径」CRP'],
            ['./base/Meta-Programming', '关于元数据和元编程'],
            ['./base/Nginx-Reverse-Proxy-Cross-Origin', '利用 Nginx 反向代理实现前端跨域'],
            ['./base/Unicode', '彻底搞懂 Unicode'],
          ]
        },
        {
          title: '网络协议',
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
        {
          title: '算法',
          children: [
            ['./algorithm/Sorting-Algorithm', '排序算法'],
          ]
        },
        {
          title: '设计模式',
          children: [
          ]
        },
        {
          title: '源码阅读',
          children: [
            ['./SourceCode/pangu', '「空格之神」源码分析']
          ]
        },
      ]

    case '后端':
      return [
        {
          title: '服务器',
          children: [
            ['./ESC/server-php', '服务器配置 —— 安装 PHP'],
            ['./ESC/server-mysql', '服务器配置 —— 安装 Mysql'],
            ['./ESC/server-nginx', '服务器配置 —— Nginx 的安装和配置'],
            ['./ESC/server-nginx-domain', '服务器配置 —— Nginx 添加多个二级子域名'],
            ['./ESC/server-vsftpd', '服务器配置 —— 安装 vsftpd 及配置'],
            ['./ESC/ESC-Backup', '阿里云跨实例数据迁移'],
          ]
          // collapsable: false,
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
            ['./Mac/mac-tree', 'Mac 下 tree 命令使用'],
          ]
        },
        ['./FiraCode', 'Fira Code —— 程序员专用字体'],
      ]

    case '兴趣':
      return [
        // ['', '兴趣导航'],
        ['./USB', 'USB 各版本区别及基本知识'],
        ['./Newifi-Padavan', 'Newifi Mini 刷机教程'],
        // ['./WiFi', '有关 WiFi 的基本知识'],
        {
          title: '装机',
          children: [
            ['./Computer/CPU', '如何选购 CPU'],
            ['./Computer/Power', '如何选购电源'],
            ['./Computer/Radiator', '如何选购散热器'],
            ['./Computer/SSD', '如何选购固态硬盘'],
            ['./Computer/RAM', '如何选购内存条'],
            ['./Computer/Monitor', '如何选购显示器'],
            ['./Computer/GraphicsCard', '如何选购显卡'],
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
          title: 'Google Developers',
          children: [
            // ['./Google-Developers/', '目录'],
            // ['./Google-Developers/Lighthouse', 'Lighthouse 使用入门'],
          ]
        },
        {
          title: '微信小程序',
          children: [
            ['./mp/', '小程序入手'],
            ['./mp/Logic-Layer', '逻辑层'],
            ['./mp/View-Layer', '视图层'],
          ]
        },
        {
          title: '你不知道的 JavaScript',
          children: [
            ['./you-dont-konw-javascript/volume1', '你不知道的 JavaScript（上卷）']
          ]
        },
        {
          title: '掘金',
          children: [
            ['./juejin/webpack', '使用 webpack 定制前端开发环境']
          ]
        },
        {
          title: '日语',
          children: [
            './japanese/gojūon'
          ]
        },
        {
          title: 'League of Legends',
          children: [
            ['./lol/rune', '符文系统']
          ]
        }
      ]

    case '手记':
      return [
        ['', '手记'],
        {
          title: '✈️旅行',
          children: [
            ['./travel/shanghai', '🚆 上海'],
          ]
        },
        {
          title: '⛅️日常',
        },
        {
          title: '🖥工作',
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
        },
        {
          title: '🍳杂记',
          children: [
            ['./note/Hope', '愿'],
            ['./note/If-You-Love-Me', '如果你爱我'],
          ]
        },
        ['./note/mind', '💊 一言']
      ]

    case '项目':
      return [
        ['./jianshu', 'XXX']
      ]
  }
}