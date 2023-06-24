/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tablesRouter  = {
  path: '/tables',
  component: Layout,
  name: '人员管理',
  meta: {
    title: '人员管理',
    icon: 'tree-table',
    roles: ['admin']
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/tables/user'),
      name: '用户管理',
      meta: {
        title: '用户管理',
        roles: ['admin']
      }
    },
    {
      path: 'teacher',
      component: () => import('@/views/tables/teacher'),
      name: '教师管理',
      meta: {
        title: '教师管理',
        roles: ['admin']
      }
    },
    {
      path: 'student',
      component: () => import('@/views/tables/student'),
      name: '学员管理',
      meta: {
        title: '学员管理',
        roles: ['admin']
      }
    },
  ]
}
export default tablesRouter

