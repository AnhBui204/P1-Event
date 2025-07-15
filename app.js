require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRouter = require('./routes/userRouter');
const studentRouter = require('./routes/studentRouter');
const adminRouter = require('./routes/adminRouter');

const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// MongoDB Connection 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// View Engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 


// Routers 
app.use('/users', userRouter);        
app.use('/students', studentRouter);  
app.use('/admin', adminRouter);       

//  Default Route 
app.get('/', (req, res) => {
  res.redirect('/users/login');
});

// Error Handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Server Start 
app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});
