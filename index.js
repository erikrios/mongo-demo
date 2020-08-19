const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Erik Rio Setiawan',
        tags: ['backend', 'rest-api'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    return await Course
        .find({ author: /.*Erik.*/i, isPublished: true })
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });
}

async function updateCourse(id) {
    return await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Erik Rio S',
            isPublished: true
        }
    }, { new: true });
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}

run();