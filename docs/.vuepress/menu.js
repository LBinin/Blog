function getBlogSidebar(type) {
  switch (type) {
    case '前端':
      return [
        ['', '欢迎'],
        {
          title: 'HTML',
          // collapsable: false,
          children: [
            './HTML/Form表单提交方式、验证',
          ]
        },
        {
          title: 'JavaScript',
          // collapsable: false,
          children: [
            ['./JavaScript/JS-Array', 'Js 数组'],
            ['./JavaScript/JS-HOF', 'Js 高阶函数'],
            ['./JavaScript/JS-AOP', 'Js 面向切面编程 AOP'],
            ['./JavaScript/JS-Closure', '深入理解闭包及原理'],
            ['./JavaScript/JS-Prototype', '理解 JavaScript 的原型及原型链'],
            ['./JavaScript/JS-Event-Binding', 'Js 中事件绑定、事件代理和事件委托'],
            ['./JavaScript/Set-Map', 'Set 与 Map'],
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
          title: '基础知识',
          children: [
            ['./Base/Repaint-Reflow', '重绘与回流'],
            ['./Base/Regular-Expression', '正则表达式基础'],
            ['./Base/Meta-Programming', '关于元数据和元编程'],
          ]
          // collapsable: false,
        },
        {
          title: '网络协议',
          // collapsable: false,
        },
        // {
        //   title: '设计模式',
        //   // collapsable: false,
        // },
        // {
        //   title: '算法',
        //   // collapsable: false,
        // },
      ]

    case '后端':
      return [
        {
          title: '服务器',
          collapsable: false,
        }
      ]

    case '阅读':
      return [
        '使用webpack定制前端开发环境'
      ]

    case '日记':
      return [
        // ['', '欢迎'],
        {
          title: '日常',
          // collapsable: false,
        },
        {
          title: '工作',
          children: [
            '2018.7.10'
          ]
        }
      ]

    case '杂记':
      return [
        ['', '杂记'],
        ['Hope', '愿'],
        ['If-You-Love-Me', '如果你爱我'],
      ]

    // case 'todo':
    //   return [
    //     {
    //       title: "待写博客"
    //     }
    //   ]
  }
}

module.exports = {
  getBlogSidebar,
}