require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectdb = require('./db/connect');

const authenticate = require('./middleware/authentication')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rate = require('express-rate-limit')


//routers

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(helmet)
app.use(cors)
app.use(xss)
app.use(rate)
// extra packages

// routes

// app.get('/',(req,res)=>{
//   res.send('hi');
// })

app.use('/api/v1/auth',require('./routes/auth'));
app.use('/api/v1/job',authenticate,require('./routes/jobs'));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectdb(process.env.connecturl)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
