<script setup>
import { ref } from 'vue'
import { useManagementStore } from '../stores/management'

const store = useManagementStore()

const courseId = ref('')
const courseName = ref('')
const errorMessage = ref('')

function addCourse() {
  if (
    courseId.value.trim() === '' ||
    courseName.value.trim() === ''
  ) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  const newCourse = {
    id: courseId.value.trim(),
    name: courseName.value.trim()
  }

  const result = store.addCourse(newCourse)

  if (result !== '') {
    errorMessage.value = result
    return
  }

  errorMessage.value = ''
  courseId.value = ''
  courseName.value = ''
}
</script>

<template>
  <div class="courses-page">
    <h1>Courses</h1>

    <section class="course-form-section">
      <h2>Add New Course</h2>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <form @submit.prevent="addCourse">
        <div class="form-group">
          <label for="courseId">Course ID</label>
          <input
            id="courseId"
            v-model="courseId"
            type="text"
            placeholder="Enter course ID"
          />
        </div>

        <div class="form-group">
          <label for="courseName">Course Name</label>
          <input
            id="courseName"
            v-model="courseName"
            type="text"
            placeholder="Enter course name"
          />
        </div>

        <button type="submit">Add Course</button>
      </form>
    </section>

    <section class="course-list-section">
      <h2>Course List</h2>

      <table>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.courses.length === 0">
            <td colspan="3">No courses have been added yet.</td>
          </tr>

          <tr v-for="course in store.courses" :key="course.id">
            <td>{{ course.id }}</td>
            <td>{{ course.name }}</td>
            <td>
              <button @click="store.deleteCourse(course.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>