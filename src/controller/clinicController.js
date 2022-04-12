import Controller from "./controller.js";

class ClinicController extends Controller {
  constructor() {
    super("Clinic");
  }
}

/*model Clinic {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  name      String
  zipcode   String
  address   String
  number    String
  Session   Session[]
}*/

export default ClinicController;
