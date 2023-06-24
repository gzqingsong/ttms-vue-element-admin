/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const courseSchedulingRouter = {
  path: '/course-scheduling',
  component: Layout,
  name: '排课管理',
  meta: {
    title: '排课管理',
    icon: 'tree-table',
    roles: ['admin','teacher','student']
  },
  children: [{
      path: 'CourseScheduling',
      component: () => import('@/views/course-scheduling/CourseScheduling'),
      name: '排课管理',
      meta: {
        title: '排课管理',
        roles: ['admin', 'teacher', 'student']
      }
    },
  ]
}
export default courseSchedulingRouter
