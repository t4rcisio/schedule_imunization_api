import prisma from "../primsa.js";

class Controller {
  constructor(colletion) {
    this.colletion = colletion;
    this.client = prisma[colletion];
  }

  async FindOnebyID(request, response) {
    const { id } = request.body;

    let clientData;
    try {
      clientData = await this.client.findOne({
        where: { id },
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
    const { id } = request.body;
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
    const { id } = request.body;
    let clientData;

    try {
      clientData = await this.client.delete({
        where: { id },
      });
    } catch (error) {
      clientData = error;
    }

    response.send({ message: clientData });
  }
}

export default Controller;
