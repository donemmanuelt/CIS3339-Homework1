<script setup>
import { ref, computed } from 'vue'

// Store the values entered into the form
const studentName = ref('')
const studentId = ref('')
const studentPhone = ref('')
const studentZip = ref('')

// Store the students added to the application
const students = ref([])

const searchQuery = ref('')

// Filter students based on the search input
const filteredStudents = computed(function () {
  const searchTerm = searchQuery.value.trim().toLowerCase()

  if (searchTerm === '') {
    return students.value
  }

  return students.value.filter(function (student) {
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.id.toLowerCase().includes(searchTerm)
    )
  })
})


// Add a student to the student list
function addStudent() {
  // Check that all fields are filled out
  if (
    studentName.value.trim() === '' ||
    studentId.value.trim() === '' ||
    studentPhone.value.trim() === '' ||
    studentZip.value.trim() === ''
  ) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  // Check for duplicate student IDs
  const duplicateStudent = students.value.some(function (student) {
    return student.id === studentId.value.trim()
  })

  if (duplicateStudent) {
    errorMessage.value = 'A student with this ID already exists.'
    return
  }

  // Create a new student object
  const newStudent = {
    name: studentName.value.trim(),
    id: studentId.value.trim(),
    phone: studentPhone.value.trim(),
    zip: studentZip.value.trim()
  }

  // Add the student to the list
  students.value.push(newStudent)

  // Clear any previous error message
  errorMessage.value = ''

  // Clear the form after a successful submission
  studentName.value = ''
  studentId.value = ''
  studentPhone.value = ''
  studentZip.value = ''
}

// Delete a student from the list
function deleteStudent(studentId) {
  students.value = students.value.filter(function (student) {
    return student.id !== studentId
  })
}

const errorMessage = ref('')
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
          <label for="studentName">Name</label>
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
          <label for="studentPhone">Phone</label>
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

  <div class="search-box">
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
  <tr v-if="students.length === 0">
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
      <button @click="deleteStudent(student.id)">Delete</button>
    </td>
  </tr>
</tbody>
  </table>
</section>
  </div>
</template>




