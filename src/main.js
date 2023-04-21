/* eslint-disable */
import ChildRoutes from './router/router'
import './assets/css/sys-theme.scss'

// --- 微服务环境 ---
window.AppData.registerChildRoutes(ChildRoutes)
console.log('oneforall sys module loading completed')