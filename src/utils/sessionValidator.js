import { check, param, validationResult } from "express-validator";

const SessionRules = (url) => {
  switch (url) {
    case "new":
      {
        return [
          check("date").trim().isISO8601().toDate(),
          check("clinc").trim().isString(),
        ];
      }
      break;
    case "edit":
      {
        return [
          check("date").trim().isISO8601().toDate(),
          check("clinc").trim().isString(),
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

const SessionValidation = (request, response, next) => {
  const errorRules = validationResult(request);
  if (!errorRules.isEmpty())
    return response.send("<h2>Failed to process request</h2>").status(422);

  next();
};

export { SessionRules, SessionValidation };

/*
model Session {
  id              String            @id @default(auto()) @map("_id") @db.ObjectId
  createdAt       DateTime          @default(now())
  date            DateTime
  clinic          Clinic            @relation(fields: [clinicId], references: [id])
  clinicId        String            @db.ObjectId
  Patiete_session Patient_session[]
} */
