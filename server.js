// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { nanoid } = require('nanoid'); // optional: small id generator

// If you didn't install nanoid, you can fallback to simple counter below.
// npm install nanoid   OR remove usages and use simple incrementing id.

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory store (simple array). For production use a database.
let students = [];
let counter = 1;

// Helper to generate ID (if nanoid not installed)
// const generateId = () => (counter++).toString();
const generateId = () => (typeof nanoid === 'function' ? nanoid(8) : (counter++).toString());

// Basic validation
function validateStudent(data) {
  const errors = [];
  if (!data.name || typeof data.name !== 'string') errors.push('name is required');
  if (!data.email || typeof data.email !== 'string') errors.push('email is required');
  if (!data.age || typeof data.age !== 'number') errors.push('age (number) is required');
  if (!data.course || typeof data.course !== 'string') errors.push('course is required');
  return errors;
}

// Create student (admission)
app.post('/students', (req, res) => {
  const data = req.body;
  const errors = validateStudent(data);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const student = {
    id: generateId(),
    name: data.name.trim(),
    email: data.email.trim(),
    age: data.age,
    course: data.course.trim(),
    dateApplied: new Date().toISOString()
  };
  students.push(student);
  res.status(201).json({ success: true, student });
});

// List all students
app.get('/students', (req, res) => {
  res.json({ success: true, students });
});

// Get single student
app.get('/students/:id', (req, res) => {
  const s = students.find(st => st.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student: s });
});

// Update student
app.put('/students/:id', (req, res) => {
  const idx = students.findIndex(st => st.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Student not found' });

  const data = req.body;
  // optional: validate partial updates
  if (data.name !== undefined) students[idx].name = data.name;
  if (data.email !== undefined) students[idx].email = data.email;
  if (data.age !== undefined) students[idx].age = data.age;
  if (data.course !== undefined) students[idx].course = data.course;
  res.json({ success: true, student: students[idx] });
});

// Delete student
app.delete('/students/:id', (req, res) => {
  const idx = students.findIndex(st => st.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Student not found' });
  const removed = students.splice(idx, 1)[0];
  res.json({ success: true, removed });
});

// Health
app.get('/', (req, res) => res.send('Student Admission API is running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
