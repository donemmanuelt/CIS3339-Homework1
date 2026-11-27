import { defineStore } from 'pinia'

export const useManagementStore = defineStore('management', {
  state: function () {
    return {
      students: [],
      courses: [],
      enrollments: []
    }
  },

  actions: {
    addStudent(student) {
      const duplicate = this.students.some(function (item) {
        return item.id === student.id
      })

      if (duplicate) {
        return 'A student with this ID already exists.'
      }

      this.students.push(student)
      return ''
    },

    deleteStudent(studentId) {
      this.students = this.students.filter(function (student) {
        return student.id !== studentId
      })

      // Remove enrollments associated with this student
      this.enrollments = this.enrollments.filter(function (enrollment) {
        return enrollment.studentId !== studentId
      })
    },

    addCourse(course) {
      const duplicate = this.courses.some(function (item) {
        return item.id === course.id
      })

      if (duplicate) {
        return 'A course with this ID already exists.'
      }

      this.courses.push(course)
      return ''
    },

    deleteCourse(courseId) {
      this.courses = this.courses.filter(function (course) {
        return course.id !== courseId
      })

      // Remove enrollments associated with this course
      this.enrollments = this.enrollments.filter(function (enrollment) {
        return enrollment.courseId !== courseId
      })
    },

    addEnrollment(studentId, courseId) {
      const duplicate = this.enrollments.some(function (enrollment) {
        return enrollment.studentId === studentId &&
               enrollment.courseId === courseId
      })

      if (duplicate) {
        return 'This student is already enrolled in this course.'
      }

      this.enrollments.push({
        studentId: studentId,
        courseId: courseId
      })

      return ''
    }
  }
})