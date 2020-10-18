import {ErrorRequestHandler} from "express";
import {ValidationError} from "yup";

interface ValidationErrors {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, respoonse, next) => {
  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.errors
    });

    return respoonse.status(400).json({message: 'Validation fails', errors})
  }

  console.log(error)
  respoonse.status(500).json({message: 'Internal Server Error.'})
}

export default errorHandler;
