import Controller from "./controller.js";

class UserController extends Controller {
  constructor() {
    super("Nurse_user");
  }

  async GetOne(request, response) {

  }

  async Create(request, response) {
    const { name, cpf, password } = request.body;

    await super.Create(request, response);
  }
}

export default UserController;

/*
model Nurse_user {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String
  cpf       String   @unique
  password  String

}
*/
