import prisma from "../primsa.js";

class Controller {
  constructor(colletion) {
    this.colletion = colletion;
    this.client = prisma[colletion];
  }

  async GetOne(request, response) {
    const { id } = request.body;

    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findUnique({
        where: { id },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }

  async Unic_cpf(request) {
    const { cpf } = request.body;

    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findUnique({
        where: { cpf },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }
    return clientData;
  }

  async Login(request, response) {
    const { cpf } = request.body;

    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findUnique({
        where: { cpf },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }
    return clientData;
  }

  async Create(request, response) {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.create({
        data: request.body,
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }

  async Update(request, response) {
    const { id } = request.params;

    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.update({
        data: request.body,
        where: {
          id,
        },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }

  async Delete(request, response) {
    const { id } = request.params;
    let clientData = { data: "", error: "" };

    try {
      clientData = await this.client.delete({
        where: { id },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }
}

export default Controller;
