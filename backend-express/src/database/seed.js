const bcrypt = require('bcryptjs');
const { runQuery } = require('../config/database');
const { initializeDatabase } = require('./init');
const logger = require('../utils/logger');

const BCRYPT_ROUNDS = 12;

async function seedDatabase() {
  try {
    await initializeDatabase();

    const hashedPassword = await bcrypt.hash('password123', BCRYPT_ROUNDS);

    const users = [
      {
        email: 'admin@prashikshan.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        phone: '+91-9876543210',
        bio: 'Platform administrator',
        is_verified: 1
      },
      {
        email: 'mentor@prashikshan.com',
        password: hashedPassword,
        name: 'Dr. Rajesh Kumar',
        role: 'mentor',
        phone: '+91-9876543211',
        bio: 'Senior Software Engineer with 10+ years of experience in full-stack development',
        skills: 'JavaScript, Python, React, Node.js, Database Design',
        is_verified: 1
      },
      {
        email: 'mentor2@prashikshan.com',
        password: hashedPassword,
        name: 'Prof. Priya Sharma',
        role: 'mentor',
        phone: '+91-9876543212',
        bio: 'Data Science expert and AI researcher',
        skills: 'Python, Machine Learning, TensorFlow, Data Analysis',
        is_verified: 1
      },
      {
        email: 'student@prashikshan.com',
        password: hashedPassword,
        name: 'Amit Patel',
        role: 'student',
        phone: '+91-9876543213',
        bio: 'Computer Science student passionate about web development',
        skills: 'HTML, CSS, JavaScript, React',
        is_verified: 1
      },
      {
        email: 'student2@prashikshan.com',
        password: hashedPassword,
        name: 'Sneha Desai',
        role: 'student',
        phone: '+91-9876543214',
        bio: 'Final year student interested in AI and Machine Learning',
        skills: 'Python, Java, Data Structures',
        is_verified: 1
      }
    ];

    for (const user of users) {
      await runQuery(
        `INSERT INTO users (email, password, name, role, phone, bio, skills, is_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.email, user.password, user.name, user.role, user.phone, user.bio, user.skills || null, user.is_verified]
      );
    }
    logger.info('Seeded users');

    const internships = [
      {
        mentor_id: 2,
        title: 'Full Stack Web Development Internship',
        description: 'Work on real-world web applications using modern technologies. Learn React, Node.js, and database design.',
        company: 'TechCorp Solutions',
        location: 'Mumbai, Maharashtra',
        duration: '3 months',
        stipend: '₹15,000 per month',
        requirements: 'Basic knowledge of HTML, CSS, JavaScript. Familiarity with React is a plus.',
        skills_required: 'JavaScript, React, Node.js, Git',
        start_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        max_applicants: 5,
        status: 'published',
        is_approved: 1
      },
      {
        mentor_id: 2,
        title: 'Backend Development Internship',
        description: 'Focus on building scalable backend systems with Node.js and databases.',
        company: 'TechCorp Solutions',
        location: 'Remote',
        duration: '6 months',
        stipend: '₹20,000 per month',
        requirements: 'Understanding of REST APIs, databases, and server-side programming.',
        skills_required: 'Node.js, Express, MongoDB, SQL',
        start_date: Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60,
        max_applicants: 3,
        status: 'published',
        is_approved: 1
      },
      {
        mentor_id: 3,
        title: 'Data Science Internship',
        description: 'Learn data analysis, machine learning, and visualization techniques.',
        company: 'DataTech Analytics',
        location: 'Bangalore, Karnataka',
        duration: '4 months',
        stipend: '₹18,000 per month',
        requirements: 'Python programming, statistics basics, enthusiasm to learn ML.',
        skills_required: 'Python, Pandas, NumPy, Machine Learning',
        start_date: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60,
        max_applicants: 4,
        status: 'published',
        is_approved: 1
      }
    ];

    for (const internship of internships) {
      await runQuery(
        `INSERT INTO internships (mentor_id, title, description, company, location, duration, stipend,
         requirements, skills_required, start_date, max_applicants, status, is_approved)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          internship.mentor_id, internship.title, internship.description, internship.company,
          internship.location, internship.duration, internship.stipend, internship.requirements,
          internship.skills_required, internship.start_date, internship.max_applicants,
          internship.status, internship.is_approved
        ]
      );
    }
    logger.info('Seeded internships');

    const applications = [
      {
        internship_id: 1,
        student_id: 4,
        cover_letter: 'I am very interested in this full-stack development opportunity. I have completed several personal projects using React and Node.js.',
        status: 'accepted'
      },
      {
        internship_id: 3,
        student_id: 5,
        cover_letter: 'I am passionate about data science and machine learning. I have completed online courses and worked on data analysis projects.',
        status: 'pending'
      }
    ];

    for (const application of applications) {
      await runQuery(
        `INSERT INTO applications (internship_id, student_id, cover_letter, status)
         VALUES (?, ?, ?, ?)`,
        [application.internship_id, application.student_id, application.cover_letter, application.status]
      );
    }
    logger.info('Seeded applications');

    const tasks = [
      {
        internship_id: 1,
        assigned_to: 4,
        title: 'Create a Todo List Application',
        description: 'Build a simple todo list application using React. Include features like add, delete, and mark as complete.',
        due_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        priority: 'high',
        status: 'assigned',
        max_points: 100,
        created_by: 2
      },
      {
        internship_id: 1,
        assigned_to: 4,
        title: 'Build REST API',
        description: 'Create a RESTful API for a blog system with Node.js and Express. Include CRUD operations.',
        due_date: Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60,
        priority: 'medium',
        status: 'assigned',
        max_points: 100,
        created_by: 2
      }
    ];

    for (const task of tasks) {
      await runQuery(
        `INSERT INTO tasks (internship_id, assigned_to, title, description, due_date, priority, status, max_points, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.internship_id, task.assigned_to, task.title, task.description,
          task.due_date, task.priority, task.status, task.max_points, task.created_by
        ]
      );
    }
    logger.info('Seeded tasks');

    logger.info('Database seeded successfully with test data');
    logger.info('\nTest accounts:');
    logger.info('Admin: admin@prashikshan.com / password123');
    logger.info('Mentor: mentor@prashikshan.com / password123');
    logger.info('Student: student@prashikshan.com / password123');

    process.exit(0);
  } catch (error) {
    logger.error('Database seeding error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
