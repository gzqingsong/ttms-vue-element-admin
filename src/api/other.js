import request from '@/utils/request'
import axios from 'axios'
const qs = require('qs')

/**
 * 查询所有班级信息
 */
export function classList(searchFrom) {
  return request({
    url: '/class/list',
    method: 'post',
    data: qs.stringify(searchFrom)
  })
}

/**
 * 保存或更新班级信息
 * @param {*} classFrom 
 * @returns 
 */
export function saveOrUpdateClass(classFrom) {
  return request({
    url: '/class/saveOrUpdateClass',
    method: 'post',
    data: qs.stringify(classFrom)
  })
}

/**
 * 通过id获取班级信息
 * @param {*} id 
 * @returns 
 */
export function getClass(id) {
  return request({
    url: '/class/getClassById',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 通过id删除班级信息
 * @param {*} id 
 * @returns 
 */
export function deleteClassById(id) {
  return request({
    url: '/class/deleteClassById',
    method: 'get',
    params: {
      id
    }
  })
}

/*********************************************课程****************************************** */

/**
 * 查询所有课程信息
 */
export function courseList(searchFrom) {
  return request({
    url: '/course/list',
    method: 'post',
    data: qs.stringify(searchFrom)
  })
}

/**
 * 保存或更新课程信息
 * @param {*} courseFrom 
 * @returns 
 */
export function saveOrUpdateCourse(courseForm) {
  return request({
    url: '/course/saveOrUpdate',
    method: 'post',
    data: qs.stringify(courseForm)
  })
}

/**
 * 通过id获取课程信息
 * @param {*} id 
 * @returns 
 */
export function getCourse(id) {
  return request({
    url: '/course/getCourseById',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 通过id删除课程信息
 * @param {*} id 
 * @returns 
 */
export function deleteCourseById(id) {
  return request({
    url: '/course/deleteCourseById',
    method: 'get',
    params: {
      id
    }
  })
}

/******************************************课室信息管理************************************************ */

/**
 * 查询所有课室信息
 */
export function classroomList(searchFrom) {
  return request({
    url: '/classroom/list',
    method: 'post',
    data: qs.stringify(searchFrom)
  })
}


/**
 * 保存或更新课室信息
 * @param {*} classroomForm
 * @returns 
 */
export function saveOrUpdateClassroom(classroomForm) {
  return request({
    url: '/classroom/saveOrUpdate',
    method: 'post',
    data: qs.stringify(classroomForm)
  })
}


/**
 * 通过id删除课室信息
 * @param {*} id 
 * @returns 
 */
export function deleteClassroomById(id) {
  return request({
    url: '/classroom/deleteClassroomById',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 通过id获取课室信息
 * @param {*} id 
 * @returns 
 */
export function getClassroomById(id) {
  return request({
    url: '/classroom/getClassroomById',
    method: 'get',
    params: {
      id
    }
  })
}

/*********************************************课室安排***************************************************************** */
/** 
  保存或更新课室安排信息
 */
export function saveOrUpdateClassroomScheduling(from) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/classroomScheduling/saveOrUpdate',
    method: 'post',
    data: from
  })
}
/** 
  根据条件查询课室安排信息
 */
export function classroomSchedulingList(params) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/classroomScheduling/list',
    method: 'post',
    data: params
  })
}

/** 
  根据id查询课室安排信息
 */
export function getClassroomScheduling(id) {
  return request({
    url: '/classroomScheduling/getClassroomScheduling',
    method: 'get',
    params: {
      id
    }
  })
}

/** 
  根据id删除课室安排信息
 */
export function deleteClassroomScheduling(id) {
  return request({
    url: '/classroomScheduling/deleteClassroomScheduling',
    method: 'post',
    params: {
      id
    }
  })
}



/*********************************************排课信息****************************************************************** */
/**
 * 批量保存
 * @param {*} params 
 * @returns 
 */
export function batchSaveCourseScheduling(params) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/courseScheduling/batch',
    method: 'post',
    data: params
  })
}

export function getCourseSchedulingList(params) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/courseScheduling/list',
    method: 'post',
    data: params
  })
}

/**
 * 获取该天对应有多少节课
 * @param {*} params 
 * @returns 
 */
export function getCourseSchedulingCourseCount(params) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/courseScheduling/count',
    method: 'post',
    data: params
  })
}

/**
 * 根据id获取相应排课信息
 * @param {*} id 
 * @returns 
 */
export function getCourseSchedulingById(id) {
  return request({
    url: '/courseScheduling/getCourseScheduling',
    method: 'post',
    data: qs.stringify({
      id: id
    })
  })
}


/**
 * 根据id删除相应排课信息
 * @param {*} id 
 * @returns 
 */
export function deleteCourseSchedulingById(id) {
  return request({
    url: '/courseScheduling/delete',
    method: 'post',
    data: qs.stringify({
      id: id
    })
  })
}


/**
 * 新增或修改排课信息
 * @param {*} id 
 * @returns 
 */
export function saveOrUpdateCourseScheduling(params) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/courseScheduling/saveOrUpdate',
    method: 'post',
    data: params
  })
}

/***********************************************教师和课程关系******************************************************* */
/**
 * 新增教师上课课程
 * @param {*} form 
 */
export function saveTeacherCourse(form) {
  return request({
    url: '/teacherCourse/save',
    method: 'post',
    data: qs.stringify(form)
  })
}

/**
 * 删除教师上课课程
 * @param {*} form 
 */
export function deleteTeacherCourse(form) {
  return request({
    url: '/teacherCourse/delete',
    method: 'post',
    data: qs.stringify(form)
  })
}
/***********************************************学员和课程关系******************************************************* */
/**
 * 新增学员上课课程
 * @param {*} form 
 */
export function saveStudentCourse(form) {
  return request({
    url: '/studentCourse/save',
    method: 'post',
    data: qs.stringify(form)
  })
}

/**
 * 删除教师上课课程
 * @param {*} form 
 */
export function deleteStudentCourse(form) {
  return request({
    url: '/studentCourse/delete',
    method: 'post',
    data: qs.stringify(form)
  })
}

/*********************************************事务处理************************************************************ */
export function saveOrUpdateTransactionProcessing(form) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8;'
    },
    url: '/transactionProcessing/saveOrUpdate',
    method: 'post',
    data: form
  })
}


export function transactionProcessingList(form) {
  return request({
    url: '/transactionProcessing/list',
    method: 'post',
    data: qs.stringify(form)
  })
}


/**
 * 根据id删除相应事务信息
 * @param {*} id 
 * @returns 
 */
export function deleteTransactionProcessingById(id) {
  return request({
    url: '/transactionProcessing/delete',
    method: 'post',
    data: qs.stringify({
      id: id
    })
  })
}

/**
 * 根据id获取相应事务信息
 * @param {*} id 
 * @returns 
 */
export function getTransactionProcessingById(id) {
  return request({
    url: '/transactionProcessing/getTransactionProcessing',
    method: 'post',
    data: qs.stringify({
      id: id
    })
  })
}
