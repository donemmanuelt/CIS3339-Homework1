import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000/api'

export const useManagementStore = defineStore('management', {
  state: function () {
    return {
      students: [],
      courses: [],
      enrollments: [],
      loading: false,
      error: ''
    }
  },

  actions: {
    async fetchStudents() {
      const response = await fetch(API_URL + '/students')

      if (!response.ok) {
        throw new Error('Unable to load students.')
      }

      this.students = await response.json()
    },

    async fetchCourses() {
      const response = await fetch(API_URL + '/courses')

      if (!response.ok) {
        throw new Error('Unable to load courses.')
      }

      this.courses = await response.json()
    },

    async fetchEnrollments() {
      const response = await fetch(API_URL + '/enrollments')

      if (!response.ok) {
        throw new Error('Unable to load enrollments.')
      }

      this.enrollments = await response.json()
    },

    async fetchAll() {
      this.loading = true
      this.error = ''

      try {
        await Promise.all([
          this.fetchStudents(),
          this.fetchCourses(),
          this.fetchEnrollments()
        ])
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addStudent(student) {
      const response = await fetch(API_URL + '/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
      })

      const result = await response.json()

      if (!response.ok) {
        return result.message || 'Unable to add student.'
      }

      this.students.push(result)
      return ''
    },

    async deleteStudent(studentId) {
      const response = await fetch(
        API_URL + '/students/' + encodeURIComponent(studentId),
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Unable to delete student.')
      }

      this.students = this.students.filter(function (student) {
        return student.id !== studentId
      })

      this.enrollments = this.enrollments.filter(function (enrollment) {
        return enrollment.studentId !== studentId
      })
    },

    async addCourse(course) {
      const response = await fetch(API_URL + '/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
      })

      const result = await response.json()

      if (!response.ok) {
        return result.message || 'Unable to add course.'
      }

      this.courses.push(result)
      return ''
    },

    async deleteCourse(courseId) {
      const response = await fetch(
        API_URL + '/courses/' + encodeURIComponent(courseId),
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Unable to delete course.')
      }

      this.courses = this.courses.filter(function (course) {
        return course.id !== courseId
      })

      this.enrollments = this.enrollments.filter(function (enrollment) {
        return enrollment.courseId !== courseId
      })
    },

    async addEnrollment(studentId, courseId) {
      const response = await fetch(API_URL + '/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: studentId,
          courseId: courseId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        return result.message || 'Unable to enroll student.'
      }

      this.enrollments.push(result)
      return ''
    },

    async removeEnrollment(studentId, courseId) {
      const response = await fetch(
        API_URL + '/enrollments/' +
        encodeURIComponent(studentId) + '/' +
        encodeURIComponent(courseId),
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Unable to remove enrollment.')
      }

      this.enrollments = this.enrollments.filter(function (enrollment) {
        return !(enrollment.studentId === studentId &&
                 enrollment.courseId === courseId)
      })
    }
  }
})
