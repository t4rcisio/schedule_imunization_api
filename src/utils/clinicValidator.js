import { check, validationResult } from "express-validator";

const ClinicRules = (url) => {
  switch (url) {
    case "new":
      {
        return [
          check("name").trim().isLength({ min: 5 }),
          check("zipcode").trim().isLength({ min: 6, max: 6 }),
          check("address").trim().isLength({ min: 10, max: 50 }),
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
  if (!errorRules.isEmpty())
    return response.send("<h2>Failed to process request</h2>").status(422);

  next();
};

export { ClinicRules, ClinicValidation };

/*
localization String
  name         String
  zipcode      String
  address      String
  number       String */
