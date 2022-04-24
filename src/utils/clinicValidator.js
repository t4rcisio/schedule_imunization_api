import { check, param, validationResult } from "express-validator";

// Verify body params before continue to process request

const ClinicRules = (url) => {
  switch (url) {
    case "new":
      {
        return [
          check("name").trim().isLength({ min: 5 }),
          check("zipcode").trim().isLength({ min: 8, max: 8 }),
          check("address").trim().isLength({ min: 10, max: 50 }),
          check("district").trim().isLength({ min: 10, max: 50 }),
          check("number").trim().isLength({ min: 1, max: 10 }),
        ];
      }
      break;
    case "edit":
      {
        return [
          param("id").trim().isString(),
          check("name").trim().isLength({ min: 5 }),
          check("zipcode").trim().isLength({ min: 6, max: 6 }),
          check("address").trim().isLength({ min: 10, max: 50 }),
          check("number").trim().isLength({ min: 1, max: 10 }),
        ];
      }
      break;
    case "delete":
      {
        return [param("id").trim().isString()];
      }
      break;
  }
};

const ClinicValidation = (request, response, next) => {
  const errorRules = validationResult(request);

  //If body params isn't match requirements
  if (!errorRules.isEmpty())
    return response
      .send({ error: true, message: "Incorrect body params" })
      .status(422);

  //continue
  next();
};

export { ClinicRules, ClinicValidation };
