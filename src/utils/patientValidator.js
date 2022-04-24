import { check, param, validationResult } from "express-validator";

const PatientRules = (url) => {
  switch (url) {
    case "new":
      {
        return [
          check("name").isLength({ min: 2 }),
          check("birthday").isISO8601().toDate(),
          check("cpf").isLength({ min: 11, max: 11 }),
        ];
      }
      break;
    case "edit":
      {
        return [
          check("name").isLength({ min: 2 }),
          check("birthday").isISO8601().toDate(),
          check("cpf").isLength({ min: 11, max: 11 }),
        ];
      }
      break;
    case "login":
      {
        return [check("cpf").isLength({ min: 11, max: 11 })];
      }
      break;
    case "delete":
      {
        return [check("cpf").isLength({ min: 11, max: 11 })];
      }
      break;
  }
};

const PatientValidation = (request, response, next) => {
  const errorRules = validationResult(request);

  //If body params is not match requirements
  if (!errorRules.isEmpty())
    return response
      .send({ error: true, message: "Incorrect body params" })
      .status(422);

  next();
};

export { PatientRules, PatientValidation };
