<script setup>
import { ref, computed, onMounted } from 'vue'
import { useManagementStore } from '../stores/management'

const store = useManagementStore()

const selectedStudentId = ref('')
const selectedCourseId = ref('')
const viewingCourseId = ref('')
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async function () {
  try {
    await store.fetchAll()
  } catch (error) {
    errorMessage.value = error.message
  }
})

const enrolledStudents = computed(function () {
  if (viewingCourseId.value === '') {
    return []
  }

  const courseEnrollments = store.enrollments.filter(function (enrollment) {
    return enrollment.courseId === viewingCourseId.value
  })

  return courseEnrollments.map(function (enrollment) {
    return store.students.find(function (student) {
      return student.id === enrollment.studentId
    })
  }).filter(function (student) {
    return student !== undefined
  })
})

async function enrollStudent() {
  if (
    selectedStudentId.value === '' ||
    selectedCourseId.value === ''
  ) {
    errorMessage.value = 'Please select both a student and a course.'
    successMessage.value = ''
    return
  }

  const result = await store.addEnrollment(
    selectedStudentId.value,
    selectedCourseId.value
  )

  if (result !== '') {
    errorMessage.value = result
    successMessage.value = ''
    return
  }

  errorMessage.value = ''
  successMessage.value = 'Student successfully enrolled!'

  viewingCourseId.value = selectedCourseId.value
}

async function removeEnrollment(studentId, courseId) {
  try {
    await store.removeEnrollment(studentId, courseId)

    successMessage.value = 'Enrollment removed successfully.'
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.message
    successMessage.value = ''
  }
}
</script>

<template>
  <div class="enrollments-page">
    <h1>Enrollments</h1>

    <p v-if="store.loading">
      Loading data...
    </p>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <section class="enrollment-form-section">
      <h2>Enroll a Student</h2>

      <form @submit.prevent="enrollStudent">
        <div class="form-group">
          <label for="studentSelect">Select Student</label>

          <select id="studentSelect" v-model="selectedStudentId">
            <option value="">Choose a student</option>

            <option
              v-for="student in store.students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }} ({{ student.id }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="courseSelect">Select Course</label>

          <select id="courseSelect" v-model="selectedCourseId">
            <option value="">Choose a course</option>

            <option
              v-for="course in store.courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.id }} - {{ course.name }}
            </option>
          </select>
        </div>

        <button type="submit">Enroll Student</button>
      </form>
    </section>

    <section class="enrollment-list-section">
      <h2>View Course Enrollments</h2>

      <div class="form-group">
        <label for="viewCourseSelect">Select Course</label>

        <select id="viewCourseSelect" v-model="viewingCourseId">
          <option value="">Choose a course</option>

          <option
            v-for="course in store.courses"
            :key="course.id"
            :value="course.id"
          >
            {{ course.id }} - {{ course.name }}
          </option>
        </select>
      </div>

      <div v-if="viewingCourseId">
        <h3>Enrolled Students</h3>

        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Phone</th>
              <th>ZIP Code</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="enrolledStudents.length === 0">
              <td colspan="5">
                No students are enrolled in this course yet.
              </td>
            </tr>

            <tr
              v-for="student in enrolledStudents"
              :key="student.id"
            >
              <td>{{ student.name }}</td>
              <td>{{ student.id }}</td>
              <td>{{ student.phone }}</td>
              <td>{{ student.zip }}</td>
              <td>
                <button
                  @click="removeEnrollment(student.id, viewingCourseId)"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else>
        Select a course to view its enrolled students.
      </p>
    </section>
  </div>
</template>