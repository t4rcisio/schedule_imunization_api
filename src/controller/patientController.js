import Controller from "./controller";

class PatientControl extends Controller {
  constructor() {
    super("Patient_user");
  }


  async Create(request, response){
      const {name, birthday, cpf } = request.body

      

  }
}

export default PatientControl;
