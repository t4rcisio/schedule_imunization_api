import Controller from "./database/controller.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

class ClinicController extends Controller {
  constructor() {
    super("Clinic");
  }

  // To create a new Clinic
  async Create(request, response) {
    // -> Verify refCode in body recived
    const { refCode } = request.body;
    const params = {
      where: {
        refCode,
      },
    };
    // Check if already registered
    const clinic = await super.GetOne(params);
    if (clinic.error)
      response.send({ error: true, message: "Unable to connet server" });
    if (clinic.data)
      return response.send({ message: "This clinic already exist" });

    // Generate a creation params
    const { name, zipcode, address, district, number } = request.body;
    const clinicParams = {
      data: {
        refCode,
        name,
        zipcode,
        address,
        district,
        number,
      },
    };
    const create = await super.Create(clinicParams);

    return response.send({ ...create.data });
  }

  // Update clinic data
  async Update(request, response) {
    const { clinicId } = request.body;

    const params = {
      where: {
        id: clinicId,
      },
    };

    const clinic = await super.GetOne(params);
    if (clinic.error)
      response.send({ error: true, message: "Unable to connet server" });
    if (!clinic.data)
      return response.send({ message: "This clinic doesn't exist" });

    // Generate a creation params
    const { name, zipcode, address, district, number } = request.body;
    const clinicParams = {
      where: {
        id: clinicId,
      },
      data: {
        refCode,
        name,
        zipcode,
        address,
        district,
        number,
      },
    };
    const create = await super.Update(clinicParams);

    return response.send({ ...create.data });
  }

  // Delete one clinic from database
  async Delete(request, response) {
    const { clinicId } = request.body;

    const params = {
      where: {
        id: clinicId,
      },
    };

    const clinic = await super.GetOne(params);
    if (clinic.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (!clinic.data)
      return response.send({ message: "This clinic doesn't exist" });

    const deletionParams = {
      where: {
        id: clinicId,
      },
    };

    const deletion = await super.Delete(deletionParams);

    response.send({ ...deletion.data });
  }

  // To get all clinics -> Use to load clinic options on forms
  async GetMany(request, response) {
    //
    // Search without params to gel all
    const clinic = await super.GetMany({});

    if (clinic.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (!clinic.data)
      return response.send({
        error: true,
        message: "Can't find clinics",
      });

    response.send({ ...clinic.data });
  }
}

export default ClinicController;
