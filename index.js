const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (v, callback) {
                setTimeout(() => {
                    const value = v && v.length > 0;
                    callback(value);
                }, 1000);
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    isPublished: Boolean,
    price: {
        type: Number, required: function () {
            return this.isPublished;
        },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'web',
        author: 'Erik Rio Setiawan',
        tags: ['backend', 'rest-api'],
        isPublished: true,
        price: 10
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (error) {
        for (field in error.errors)
            console.log(error.errors[field].message);
    }
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

async function deleteCourse(id) {
    return await Course.deleteOne({ _id: id });
}

async function run() {
    const course = await getCourses();
    console.log(course);
}

createCourse();