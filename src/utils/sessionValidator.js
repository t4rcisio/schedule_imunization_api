import { check, param, validationResult } from "express-validator";

const SessionRules = (url) => {
  switch (url) {
    case "new":
      {
        return [
          check("date").trim().isISO8601().toDate(),
          check("time").trim().isString(),
          check("clincId").trim().isString(),
        ];
      }
      break;
    case "delete":
      {
        return [check("id").trim().isString()];
      }
      break;
    case "confirm":
      {
        return [
          check("id").trim().isString(),
          check("status").trim().isString(),
        ];
      }
      break;
  }
};

const SessionValidation = (request, response, next) => {
  const errorRules = validationResult(request);

  //If body params is not match requirements
  if (!errorRules.isEmpty())
    return response
      .send({ error: true, message: "Incorrect body params" })
      .status(422);

  //continue
  next();
};

export { SessionRules, SessionValidation };
