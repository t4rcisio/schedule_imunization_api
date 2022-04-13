import prisma from "../../primsa.js";

class Controller {
  constructor(colletion) {
    this.colletion = colletion;
    this.client = prisma[colletion];
  }

  async GetAll(request, response) {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findMany();
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.data = true;
    }

    return clientData;
  }

  async Search(request, response) {
    let clientData = { data: "", error: "" };
    const { name } = request.body;
    try {
      clientData.data = await this.client.findMany({
        where: {
          name: {
            contains: name,
          },
        },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }

  async GetOne(request, response) {
    const { id } = request.params;

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

  async GetByRef(request) {
    const { refCode } = request.body;

    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findUnique({
        where: { refCode },
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }
    console.log(clientData);
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
    console.log(clientData);
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
