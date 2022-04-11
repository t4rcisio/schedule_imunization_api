import Controller from "./controller.js";

class PatientControl extends Controller {
  constructor() {
    super("Patient_user");
  }

  async Create(request, response) {
    // Prisma does't support @unique parameter on Mongodb yet,
    // so, I have to do it manually
    const user = await super.Unic_cpf(request);
    if (user) return response.send("CPF is already in use");

    // convert date string to Date iso format
    request.body.birthday = new Date(request.body.birthday);

    return await super.Create(request, response);
  }

  async Login(request, response) {}
}

export default PatientControl;
