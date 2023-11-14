require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADDRESS, PORT_ADDRESS } = require('./utils/config');
const { limiter } = require('./middlewares/rateLimit');

const { PORT = PORT_ADDRESS, DB_URL = DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(DB_URL, {
  autoIndex: true,
});

app.use(cors);

app.use(helmet());

app.use(bodyParser.json());

app.use(cookieParser());

app.use(limiter);

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(error);

app.listen(PORT);
