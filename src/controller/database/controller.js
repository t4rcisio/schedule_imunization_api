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
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.delete({
        ...data,
      });
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }
  async Find(data) {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findFirst({
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

  async GetMany() {
    let clientData = { data: "", error: "" };
    try {
      clientData.data = await this.client.findMany({});
      clientData.error = false;
    } catch (error) {
      clientData.data = error;
      clientData.error = true;
    }

    return clientData;
  }
}

export default Controller;
