import { check, validationResult } from "express-validator";

const NurseRules = () => [
  check("name").isLength({ min: 2 }),
  check("password").isLength({ min: 8, max: 30 }),
  check("cpf").isLength({ min: 11, max: 11 }),
];

const NurseValidation = (request, response, next) => {
  const errorRules = validationResult(request);
  if (!errorRules.isEmpty())
    return response.send("<h2>Failed to process request</h2>").status(422);

  next();
};

export { NurseRules, NurseValidation };
