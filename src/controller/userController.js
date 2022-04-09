class UserController {
  async Create(request, response) {
    response.send("Create user");
  }
  async Update(request, response) {
    response.send("Update user");
  }
  async Delete(request, response) {
    response.send("Delete user");
  }
}

export default UserController;
