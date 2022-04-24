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
          check("name").trim().isLength({ min: 2 }),
          check("cpf").trim().isLength({ min: 11, max: 11 }),
          check("password").trim().isLength({ min: 8, max: 30 }),
        ];
      }
      break;
    case "restore-password": // Not implemented yet
      {
        return [
          check("current").trim().isLength({ min: 8, max: 30 }),
          check("new").trim().isLength({ min: 8, max: 30 }),
          check("newRepeat").trim().isLength({ min: 8, max: 30 }),
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
        return [check("cpf").trim().isLength({ min: 11, max: 11 })];
      }
      break;
  }
};

const NurseValidation = (request, response, next) => {
  const errorRules = validationResult(request);

  //If body params is not match requirements
  if (!errorRules.isEmpty())
    return response
      .send({ error: true, message: "Incorrect body params" })
      .status(422);

  //continue
  next();
};

export { NurseRules, NurseValidation };
