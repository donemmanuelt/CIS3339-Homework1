const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const Student = require('./models/Student')
const Course = require('./models/Course')
const Enrollment = require('./models/Enrollment')

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(function () {
    console.log('Connected to MongoDB')
  })
  .catch(function (error) {
    console.error('MongoDB connection error:', error.message)
  })

// -------------------- STUDENTS --------------------

// Get all students
app.get('/api/students', async function (req, res) {
  try {
    const students = await Student.find()
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve students.' })
  }
})

// Add a student
app.post('/api/students', async function (req, res) {
  try {
    const student = new Student({
      name: req.body.name,
      id: req.body.id,
      phone: req.body.phone,
      zip: req.body.zip
    })

    await student.save()
    res.status(201).json(student)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A student with this ID already exists.'
      })
    }

    res.status(400).json({
      message: 'Unable to add student. Please check the information.'
    })
  }
})

// Delete a student
app.delete('/api/students/:id', async function (req, res) {
  try {
    const student = await Student.findOneAndDelete({
      id: req.params.id
    })

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' })
    }

    // Delete enrollments belonging to this student
    await Enrollment.deleteMany({
      studentId: req.params.id
    })

    res.json({ message: 'Student deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete student.' })
  }
})

// -------------------- COURSES --------------------

// Get all courses
app.get('/api/courses', async function (req, res) {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve courses.' })
  }
})

// Add a course
app.post('/api/courses', async function (req, res) {
  try {
    const course = new Course({
      id: req.body.id,
      name: req.body.name
    })

    await course.save()
    res.status(201).json(course)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A course with this ID already exists.'
      })
    }

    res.status(400).json({
      message: 'Unable to add course. Please check the information.'
    })
  }
})

// Delete a course
app.delete('/api/courses/:id', async function (req, res) {
  try {
    const course = await Course.findOneAndDelete({
      id: req.params.id
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' })
    }

    // Delete enrollments belonging to this course
    await Enrollment.deleteMany({
      courseId: req.params.id
    })

    res.json({ message: 'Course deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete course.' })
  }
})

// -------------------- ENROLLMENTS --------------------

// Get all enrollments
app.get('/api/enrollments', async function (req, res) {
  try {
    const enrollments = await Enrollment.find()
    res.json(enrollments)
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve enrollments.' })
  }
})

// Enroll a student in a course
app.post('/api/enrollments', async function (req, res) {
  try {
    const studentId = req.body.studentId
    const courseId = req.body.courseId

    // Confirm student exists
    const student = await Student.findOne({ id: studentId })

    if (!student) {
      return res.status(400).json({
        message: 'The selected student does not exist.'
      })
    }

    // Confirm course exists
    const course = await Course.findOne({ id: courseId })

    if (!course) {
      return res.status(400).json({
        message: 'The selected course does not exist.'
      })
    }

    const enrollment = new Enrollment({
      studentId: studentId,
      courseId: courseId
    })

    await enrollment.save()

    res.status(201).json(enrollment)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'This student is already enrolled in this course.'
      })
    }

    res.status(400).json({
      message: 'Unable to create enrollment.'
    })
  }
})

// Remove an enrollment
app.delete('/api/enrollments/:studentId/:courseId', async function (req, res) {
  try {
    const enrollment = await Enrollment.findOneAndDelete({
      studentId: req.params.studentId,
      courseId: req.params.courseId
    })

    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment not found.'
      })
    }

    res.json({ message: 'Enrollment removed successfully.' })
  } catch (error) {
    res.status(500).json({
      message: 'Unable to remove enrollment.'
    })
  }
})

// Serve the Vue production frontend
const frontendPath = path.join(__dirname, '../frontend-vue/dist')

app.use(express.static(frontendPath))

// Support Vue Router when refreshing pages
app.use(function (req, res, next) {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'))
  } else {
    next()
  }
})

// Start the server
const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`)
})

