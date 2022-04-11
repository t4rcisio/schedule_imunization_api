import prisma from "../primsa.js";

class Controller {
  constructor(colletion) {
    this.colletion = colletion;
    this.client = prisma[colletion];
  }

  async GetOne(request, response) {
    const { id } = request.body;

    let clientData;
    try {
      clientData = await this.client.findUnique({
        where: { id },
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ Data: clientData });
  }

  async Unic_cpf(request) {
    const { cpf } = request.body;

    let clientData;
    try {
      clientData = await this.client.findUnique({
        where: { cpf },
      });
    } catch (error) {
      clientData = error;
    }
    console.log(clientData);
    return clientData;
  }

  async Login(request, response) {
    const { cpf } = request.body;

    let user = { Data: "", error: "" };
    try {
      user.Data = await this.client.findUnique({
        where: { cpf },
      });
      user.error = false;
    } catch (error) {
      user.Data = error;
      user.error = true;
    }

    return user;
  }

  async Create(request, response) {
    let clientData;
    try {
      clientData = await this.client.create({
        data: request.body,
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ Data: clientData });
  }

  async Update(request, response) {
    const { id } = request.params;
    console.log(id);
    let clientData;
    try {
      clientData = await this.client.update({
        data: request.body,
        where: {
          id,
        },
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ Data: clientData });
  }

  async Delete(request, response) {
    const { id } = request.params;
    let clientData;

    try {
      clientData = await this.client.delete({
        where: { id },
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ Data: clientData });
  }
}

export default Controller;
