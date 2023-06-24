import request from '@/utils/request'
const qs = require('qs')

/**
 * 用户登录
 * @param {*} data 
 * @returns 
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data:qs.stringify(data)
  })
}

/**
 * 获取用户id，即token
 * @param {*} token 
 * @returns 
 */
export function getInfo(token) {
  return request({
    url: '/user/getUserById',
    method: 'get',
    params: { token }
  })
}

/**
 * 
 * @returns 
 */
export function logout() {
  return {status:200}
  // return request({
    // url: '/vue-element-admin/user/logout',
    // method: 'post'
  // })
}

/**
 * 查询所有用户信息
 */
export function userList(searchFrom){
  return request({
    url:'/user/list',
    method:'post',
    data:qs.stringify(searchFrom)
  })
}


/**
 * 保存或更新用户信息
 * @param {*} user 
 * @returns 
 */
export function saveOrUpdateUser(user) {
  return request({
    url: '/user/saveOrUpdate',
    method:'post',
    data:qs.stringify(user)
  })
}

/**
 * 根据用户id删除用户相关信息
 * @param {*} id 
 * @returns 
 */
export function deleteUserById(id) {
  return request({
    url: '/user/deleteUserById',
    method:'get',
    params: {
      id
    }
  })
}

/****************************************************教师信息管理************************************************************ */
/**
 * 查询所有教师信息
 */
export function teacherList(searchFrom) {
  return request({
    url: '/teacher/list',
    method: 'post',
    data: qs.stringify(searchFrom)
  })
}


/**
 * 保存或更新教师信息
 * @param {*} teacher 
 * @returns 
 */
export function saveOrUpdateTeacher(teacher) {
  return request({
    url: '/teacher/saveOrUpdate',
    method:'post',
    data: qs.stringify(teacher)
  })
}

/**
 * 获取教师信息
 * @param {*} token 
 * @returns 
 */
export function getTeacherInfo(id) {
  return request({
    url: '/teacher/getTeacherById',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据教师id查询教师信息
 * @param {*} id 
 * @returns 
 */
export function deleteTeacherById(id) {
  return request({
    url: '/teacher/deleteTeacherById',
    method: 'get',
    params: {
      id
    }
  })
}

/**************************************************学员管理***************************************************************** */
export function studentList(searchFrom) {
  return request({
    url: '/student/list',
    method: 'post',
    data: qs.stringify(searchFrom)
  })
}


/**
 * 保存或更新学员信息
 * @param {*} student 
 * @returns 
 */
export function saveOrUpdateStudent(student) {
  return request({
    url: '/student/saveOrUpdate',
    method: 'post',
    data: qs.stringify(student)
  })
}

/**
 * 获取学员信息
 * @param {*} id 
 * @returns 
 */
export function getStudentInfo(id) {
  return request({
    url: '/student/getStudentById',
    method: 'get',
    params: { id }
  })
}