import prisma from "../../primsa.js";

class Controller {
  constructor(colletion) {
    this.colletion = colletion;
    this.client = prisma[colletion];
  }

  async GetOne(data) {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findUnique({
        ...data,
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }
    console.log(clientData);
    return clientData;
  }

  async Create(data) {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.create({
        ...data,
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }
    console.log(clientData);
    return clientData;
  }

  async Update(data) {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.update({
        ...data,
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }

  async Delete(data) {
    const { id } = request.params;
    let clientData = { data: "", error: "" };
    try {
      clientData = await this.client.delete({
        ...data,
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