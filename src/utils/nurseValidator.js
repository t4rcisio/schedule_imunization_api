import { param, check, validationResult } from "express-validator";

const NurseRules = (url) => {
  switch (url) {
    case "new":
      {
        return [
          check("name").trim().isLength({ min: 2 }),
          check("password").trim().isLength({ min: 8, max: 30 }),
          check("cpf").trim().isLength({ min: 11, max: 11 }),
        ];
      }
      break;
    case "edit":
      {
        return [
          param("id").trim().isString(),
          check("name").trim().isLength({ min: 2 }),
          check("password").trim().isLength({ min: 8, max: 30 }),
        ];
      }
      break;
    case "restore-password":
      {
        return [
          param("id").trim().isString(),
          check("current").trim().isLength({ min: 8, max: 30 }),
          check("new").trim().isLength({ min: 8, max: 30 }),
          check("new-repeat").trim().isLength({ min: 8, max: 30 }),
        ];
      }
      break;
    case "login":
      {
        return [
          check("cpf").trim().isLength({ min: 11, max: 11 }),
          check("password").trim().isLength({ min: 8, max: 30 }),
        ];
      }
      break;
    case "delete":
      {
        return [
          param("id").trim().isString(),
          check("cpf").trim().isLength({ min: 11, max: 11 }),
        ];
      }
      break;
  }
};

const NurseValidation = (request, response, next) => {
  const errorRules = validationResult(request);
  if (!errorRules.isEmpty())
    return response.send("<h2>Failed to process request</h2>").status(422);

  next();
};

export { NurseRules, NurseValidation };
