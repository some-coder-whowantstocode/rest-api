require('dotenv').config();
const cors = require('cors')
require('express-async-errors');
const express = require('express');
const app = express();
const connectdb = require('./db/connect');

const authenticate = require('./middleware/authentication')
const port = process.env.PORT || 3000;

app.use(cors({
  origin:`https://localhost:${port}`,
}))


//routers

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());


// routes

app.get('/',(req,res)=>{
  res.send('hi');
})

app.use('/api/v1/auth',require('./routes/auth'));
app.use('/api/v1/job',authenticate,require('./routes/jobs'));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



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
