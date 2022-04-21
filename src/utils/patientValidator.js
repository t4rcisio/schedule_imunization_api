import { check, param, validationResult } from "express-validator";

const PatientRules = (url) => {
  console.log(url);
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
        return [
          param("id").isString(),
          check("cpf").isLength({ min: 11, max: 11 }),
        ];
      }
      break;
  }
};

const PatientValidation = (request, response, next) => {
  const errorRules = validationResult(request);
  console.log(errorRules);
  if (!errorRules.isEmpty())
    return response.send({ error: "Missing body huuuparams" }).status(422);

  next();
};

export { PatientRules, PatientValidation };
