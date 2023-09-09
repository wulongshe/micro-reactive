import { basename } from 'path'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import fg from 'fast-glob'

const docs = treeToItems(
  fg
    .sync(['./doc/**/*.md'])
    .map((path) => basename(path))
    .reduce((tree, file) => (getTree(file, '', tree), tree), {}),
)
const project = 'micro-reactive'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Micro Reactive',
  description: 'Reactive core based on Function and Proxy',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/doc/index' },
      { text: 'API', link: `/doc/${project}` },
    ],
    sidebar: [
      {
        text: 'API',
        items: docs,
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/wulongshe/micro-reactive' }],
    search: {
      provider: 'local',
    },
  },
  markdown: {
    theme: {
      light: 'light-plus',
      dark: 'github-dark',
    },
  },
})

interface IndexTree {
  [index: string]: {
    link: string
    items?: IndexTree
  }
}

// 目录标题去除utils.前缀
function resolveTitle(title: string) {
  return title === project ? title : title.replace(`${project}.`, '')
}

// 将md文档列表转为树结构
function getTree(file: string, prefix: string, tree = {}) {
  const [cur, ...rest] = file.replace('.md', '').split('.')
  const curPath = prefix + cur
  if (!tree[curPath]) {
    tree[curPath] = {
      link: '/doc/' + curPath + '.md',
    }
  }
  if (rest.length > 0) {
    if (!tree[curPath].items) {
      tree[curPath].items = {}
    }
    getTree(rest.join('.'), curPath + '.', tree[curPath].items)
  }
}

// 将树结构转为目录数组
function treeToItems(tree: IndexTree): DefaultTheme.SidebarItem[] {
  const items: DefaultTheme.SidebarItem[] = []
  Object.keys(tree).forEach((key) => {
    const item: DefaultTheme.SidebarItem = {
      text: resolveTitle(key),
      link: tree[key].link,
    }
    if (tree[key].items) {
      if (!item.items) {
        item.items = []
      }
      item.items.push(...treeToItems(tree[key].items!))
    }
    items.push(item)
  })
  return items
}
