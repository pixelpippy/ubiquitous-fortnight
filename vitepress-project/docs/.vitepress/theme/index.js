import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'
import './custom.css'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {})
  }
}