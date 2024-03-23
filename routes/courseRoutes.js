const express = require('express');
const Course = require('../models/course');

const router = express.Router();




// POST route to create a new course
router.post('/', async (req, res) => {
    try {
        
        const courseData = req.body;
        const course = new Course(courseData);
        await course.save();
        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
