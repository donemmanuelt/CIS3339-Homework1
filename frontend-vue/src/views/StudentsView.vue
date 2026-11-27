<script setup>
import { ref } from 'vue'

// Store the values entered into the form
const studentName = ref('')
const studentId = ref('')
const studentPhone = ref('')
const studentZip = ref('')

// Store the students added to the application
const students = ref([])

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

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Student ID</th>
        <th>Phone</th>
        <th>ZIP Code</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="student in students" :key="student.id">
        <td>{{ student.name }}</td>
        <td>{{ student.id }}</td>
        <td>{{ student.phone }}</td>
        <td>{{ student.zip }}</td>
      </tr>
    </tbody>
  </table>
</section>
  </div>
</template>




