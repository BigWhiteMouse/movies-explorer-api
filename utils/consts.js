// иначе eslint определяет экранирование символа / как ошибку Unnecessary escape character
// eslint-disable-next-line
const linkRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9@:%._+~#=-]{1,256}\.[a-zA-Z0-9()]{1,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)/;

const validationErrorStatus = 400;
const notFoundErrorStatus = 404;
const otherErrorStatus = 500;
const createSuccessStatus = 201;
const conflictErrorStatus = 409;
const unauthorizedErrorStatus = 401;
const forbiddenErrorStatus = 403;
const successStatus = 200;

module.exports = {linkRegex, validationErrorStatus, notFoundErrorStatus, otherErrorStatus, createSuccessStatus,
  conflictErrorStatus, unauthorizedErrorStatus, forbiddenErrorStatus, successStatus}