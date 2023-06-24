import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import tablesRouter from './modules/tables'
import nestedRouter from './modules/nested'
import courseSchedulingRouter from './modules/course-scheduling'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: 'Dashboard',
        icon: 'dashboard',
        affix: true
      }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/profile/index'),
      name: 'Profile',
      meta: {
        title: 'Profile',
        icon: 'user',
        noCache: true
      }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/tables',
    component: Layout,
    children: [{
      path: 'userInfo',
      component: () => import('@/views/tables/userInfo'),
      name: '个人信息',
      meta: {
        title: '个人信息',
        icon: 'table',
        noCache: true,
      }
    }]
  },
  tablesRouter,
  {
    path: '/other',
    component: Layout,
    children: [{
      path: 'class',
      component: () => import('@/views/other/class'),
      name: '班级管理',
      meta: {
        title: '班级管理',
        icon: 'table',
        noCache: true,
        roles: ['admin']
      }
    }]
  },
  {
    path: '/other',
    component: Layout,
    children: [{
      path: 'course',
      component: () => import('@/views/other/course'),
      name: '课程管理',
      meta: {
        title: '课程管理',
        icon: 'table',
        noCache: true,
        roles: ['admin','teacher','student']
      }
    }]
  },
  {
    path: '/other',
    component: Layout,
    children: [{
      path: 'classroom',
      component: () => import('@/views/other/classroom'),
      name: '课室管理',
      meta: {
        title: '课室管理',
        icon: 'table',
        noCache: true,
        roles: ['admin']
      }
    }]
  },

  courseSchedulingRouter,
  {
    path: '/other',
    component: Layout,
    children: [{
      path: 'transactionProcessing',
      component: () => import('@/views/other/transactionProcessing'),
      name: '事务处理',
      meta: {
        title: '事务处理',
        icon: 'table',
        noCache: true,
        roles: ['admin','teacher']
      }
    }]
  },
  // courseSchedulingRouter,
  /** when your routing map is too long, you can split it into small modules **/


  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
