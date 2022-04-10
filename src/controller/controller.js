import prisma from "../primsa.js";

class Controller {
  constructor(colletion) {
    this.colletion = colletion;
    this.client = prisma[colletion];
  }

  async GetOne(request, response) {
    const { cpf } = request.body;

    let clientData;
    try {
      clientData = await this.client.findOne({
        where: { cpf },
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ message: clientData });
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

    response.send({ message: clientData });
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

    response.send({ message: clientData });
  }

  async Delete(request, response) {
    const { cpf } = request.body;
    let clientData;

    try {
      clientData = await this.client.delete({
        where: { cpf },
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ message: clientData });
  }
}

export default Controller;
