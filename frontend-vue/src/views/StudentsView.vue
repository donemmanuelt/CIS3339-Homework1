<script setup>
import { ref, computed, onMounted } from 'vue'
import { useManagementStore } from '../stores/management'

const store = useManagementStore()

const studentName = ref('')
const studentId = ref('')
const studentPhone = ref('')
const studentZip = ref('')
const errorMessage = ref('')
const searchQuery = ref('')

onMounted(async function () {
  try {
    await store.fetchStudents()
  } catch (error) {
    errorMessage.value = error.message
  }
})

const filteredStudents = computed(function () {
  const query = searchQuery.value.toLowerCase().trim()

  if (query === '') {
    return store.students
  }

  return store.students.filter(function (student) {
    return student.name.toLowerCase().includes(query) ||
           student.id.toLowerCase().includes(query)
  })
})

async function addStudent() {
  if (
    studentName.value.trim() === '' ||
    studentId.value.trim() === '' ||
    studentPhone.value.trim() === '' ||
    studentZip.value.trim() === ''
  ) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  const newStudent = {
    name: studentName.value.trim(),
    id: studentId.value.trim(),
    phone: studentPhone.value.trim(),
    zip: studentZip.value.trim()
  }

  const result = await store.addStudent(newStudent)

  if (result !== '') {
    errorMessage.value = result
    return
  }

  errorMessage.value = ''

  studentName.value = ''
  studentId.value = ''
  studentPhone.value = ''
  studentZip.value = ''
}

async function deleteStudent(studentId) {
  try {
    await store.deleteStudent(studentId)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class="students-page">
    <h1>Students</h1>

    <section class="student-form-section">
      <h2>Add New Student</h2>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <form @submit.prevent="addStudent">
        <div class="form-group">
          <label for="studentName">Student Name</label>
          <input
            id="studentName"
            v-model="studentName"
            type="text"
            placeholder="Enter student name"
          />
        </div>

        <div class="form-group">
          <label for="studentId">Student ID</label>
          <input
            id="studentId"
            v-model="studentId"
            type="text"
            placeholder="Enter student ID"
          />
        </div>

        <div class="form-group">
          <label for="studentPhone">Phone Number</label>
          <input
            id="studentPhone"
            v-model="studentPhone"
            type="text"
            placeholder="Enter phone number"
          />
        </div>

        <div class="form-group">
          <label for="studentZip">ZIP Code</label>
          <input
            id="studentZip"
            v-model="studentZip"
            type="text"
            placeholder="Enter ZIP code"
          />
        </div>

        <button type="submit">Add Student</button>
      </form>
    </section>

    <section class="student-list-section">
      <h2>Student List</h2>

      <div class="form-group">
        <label for="studentSearch">Search Students</label>
        <input
          id="studentSearch"
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or student ID"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Phone</th>
            <th>ZIP Code</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.students.length === 0">
            <td colspan="5">No students have been added yet.</td>
          </tr>

          <tr v-else-if="filteredStudents.length === 0">
            <td colspan="5">No students found matching your search.</td>
          </tr>

          <tr v-for="student in filteredStudents" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
            <td>
              <button @click="deleteStudent(student.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
