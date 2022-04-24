import Controller from "./database/controller.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import PatientSessionController from "./patientSessionController.js";
import Decode from "../utils/tokenDecode.js";
dotenv.config();

const clinicSchema = Joi.object({});

const patientSessionDB = new PatientSessionController();

class SessionController extends Controller {
  constructor() {
    super("Session");
  }

  // Change state of patient attendance, Schedule to Done
  async ChangState(request, response) {
    const { id, status } = request.body;

    console.log(request.params);
    const params = {
      where: {
        id,
      },
      data: {
        status,
      },
    };

    const updateSession = await patientSessionDB.Update(params);

    console.log({ update: updateSession });

    if (updateSession.error)
      return response.send({
        error: true,
        message: "Unable to update session",
      });

    response.send({ ...updateSession.data });
  }

  async Search(request, response) {
    const { clinicId, date } = request.body;

    const params = {
      where: {
        clinicId,
        date: new Date(date + " GMT"),
      },
    };

    console.log(params);

    const sessions = await super.Find(params);

    if (sessions.error)
      return response.send({
        error: true,
        message: "Failed to locate session",
      });

    if (!sessions.data) return response.send({});

    if (!Object.keys(sessions.data).length)
      return response.send({ ...sessions.data });

    const { id } = sessions.data;

    const patientParams = {
      where: {
        sessionId: id,
      },
      include: {
        Patient: true,
      },
    };

    const userSessions = await patientSessionDB.GetMany(patientParams);

    if (userSessions.error)
      return response.send({
        error: true,
        message: "Failed to locate patient session ",
      });

    return response.send({ ...userSessions.data });
  }

  async SessionInclude(request, session, response) {
    //
    // The system was projected allow two patients per session
    //
    if (session.count >= 2)
      return response.send({ error: true, message: "This session is full" });

    // Now, generate association params to add user on session
    const sessionId = session.id;
    const { id } = Decode(request.headers);
    const params = {
      data: {
        Session: {
          connect: { id: sessionId },
        },
        Patient: {
          connect: { id: id },
        },
      },
    };

    console.log({ params2: { ...params } });
    // Create a new patientSession
    const userSession = await patientSessionDB.Create(params);
    if (userSession.error)
      return response.send({
        error: true,
        message: "Unable to server connect",
      });

    // Update session

    const sessionParams = {
      where: {
        id: session.id,
      },
      data: {
        count: session.count + 1,
      },
    };
    const sessionUpdate = await super.Update(sessionParams);

    return response.send({ ...userSession.data });
  }

  async SessionCreate(request, response) {
    const { date, time, clinicId } = request.body;
    //
    // The system was projected to allow twenty attendaces per day
    //

    // Attendance time
    const begin = new Date(date + " " + process.env.START + " GMT");
    const end = new Date(date + " " + process.env.END + " GMT");

    // date time received
    const ndate = new Date(date + " " + time + " GMT");
    // Check limits
    if (!(ndate >= begin && ndate <= end))
      return response.send({
        error: true,
        message: "Invalid time (out of range)",
      });

    // Generate creation params
    const params = {
      data: {
        date: ndate,
        count: 0,
        clinic: {
          connect: { id: clinicId },
        },
      },
    };

    const session = await super.Create(params);
    if (session.error)
      return response.send({
        error: true,
        message: "Unable to server connect",
      });

    return await this.SessionInclude(request, session.data, response);
  }

  async SessionNew(request, response) {
    //
    // First, check if already exist a session with same date
    //
    const { date, time, clinicId } = request.body;
    // Convert string to date
    const ndate = new Date(date + " " + time + " GMT");
    const params = {
      where: {
        clinicId,
        date: ndate,
      },
    };
    const sessionData = await super.Find(params);

    if (sessionData.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (sessionData.data)
      // Just create a new patientSession
      return await this.SessionInclude(request, sessionData.data, response);
    else if (!sessionData.data)
      // Create a new Session, then call SessionInclude function
      return await this.SessionCreate(request, response);
  }

  async SessionDelete(request, response) {
    const { id } = request.params;
    const usrId = Decode(request.headers).id;
    if (!usrId)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    const patientParams = {
      where: {
        id,
      },
    };

    const patientSession = await patientSessionDB.Delete(patientParams);

    if (patientSession.error || !patientSession.data)
      return response.send({ error: true, message: "Unable to connet server" });

    const { sessionId } = patientSession.data;

    const sessionParams = {
      where: {
        id: sessionId,
      },
    };

    const session = await super.GetOne(sessionParams);
    if (session.error)
      response.send({ error: true, message: "Unable to connet server" });

    const sessionUpdateParams = {
      where: {
        id: session.data.id,
      },
      data: {
        count: session.data.count - 1,
      },
    };

    const sessionUpdate = await super.Update(sessionUpdateParams);

    response.send({ ...patientSession.data });
  }
}

export default SessionController;
