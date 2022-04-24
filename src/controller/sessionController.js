import Controller from "./database/controller.js";
import dotenv from "dotenv";
import PatientSessionController from "./patientSessionController.js";
import Decode from "../utils/tokenDecode.js";
dotenv.config();

// Conection from patientSession databse
const patientSessionDB = new PatientSessionController();

class SessionController extends Controller {
  constructor() {
    super("Session");
  }

  // Change state of patient attendance, Schedule to Done
  async ChangeState(request, response) {
    const { id, status } = request.body;

    // Search by id patientSession
    const params = {
      where: {
        id,
      },
      data: {
        status,
      },
    };

    const updateSession = await patientSessionDB.Update(params);

    if (updateSession.error)
      return response.send({
        error: true,
        message: "Unable to update session",
      });

    response.send({ ...updateSession.data });
  }

  // Search session
  async Search(request, response) {
    const { clinicId, date } = request.body;

    // Search by clinic and date
    const params = {
      where: {
        clinicId,
        date: new Date(date + " GMT"),
      },
    };

    const sessions = await super.Find(params);

    if (sessions.error)
      return response.send({
        error: true,
        message: "Failed to locate session",
      });

    if (!sessions.data) return response.send({});

    // If search return empty array, stop next step,
    //(seach userSessions associated with this session)
    if (!Object.keys(sessions.data).length)
      return response.send({ ...sessions.data });

    const { id } = sessions.data;

    // Get all userSessions associated wiht session
    const patientParams = {
      where: {
        sessionId: id,
      },
      include: {
        Patient: true,
      },
    };

    // Return array sessions
    const userSessions = await patientSessionDB.GetMany(patientParams);

    if (userSessions.error)
      return response.send({
        error: true,
        message: "Failed to locate patient session ",
      });

    return response.send({ ...userSessions.data });
  }

  // Include a new patientSession associated a session
  async SessionInclude(request, session, response) {
    //
    // The system was projected allow two patients per session
    //
    if (session.count >= 2)
      return response.send({ error: true, message: "This session is full" });

    // Now, generate association params to add user on session
    const sessionId = session.id;
    const { id } = Decode(request.headers);

    // PatientSession is a link between Session and Patient

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

    // Create a new patientSession
    const userSession = await patientSessionDB.Create(params);

    if (userSession.error)
      return response.send({
        error: true,
        message: "Unable to create patient session",
      });

    // Update session, adding +1 on counter
    const sessionParams = {
      where: {
        id: session.id,
      },
      data: {
        count: session.count + 1,
      },
    };

    // Apply update on session
    const sessionUpdate = await super.Update(sessionParams);

    return response.send({ ...userSession.data });
  }

  // If date selected by patient is empty, create a new session
  async SessionCreate(request, response) {
    const { date, time, clinicId } = request.body;
    //
    // The system was projected to allow twenty attendaces per day
    //
    // Attendance time  Start : 08:00 End : 17:00
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

    // After create session, now create a patientSession (above method)
    return await this.SessionInclude(request, session.data, response);
  }

  // Route to create a new Patient session
  async SessionNew(request, response) {
    //
    // First, check if already exist a session with same date on clinic received
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

  // To Patient delete session
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
      return response.send({
        error: true,
        message: "Unable to delete patient session",
      });

    // to find a session associated
    const { sessionId } = patientSession.data;

    const sessionParams = {
      where: {
        id: sessionId,
      },
    };

    const session = await super.GetOne(sessionParams);
    if (session.error)
      response.send({ error: true, message: "Unable to find session" });

    //decrement one in session count
    const sessionUpdateParams = {
      where: {
        id: session.data.id,
      },
      data: {
        count: session.data.count - 1,
      },
    };

    const sessionUpdate = await super.Update(sessionUpdateParams);

    if (sessionUpdate.error)
      response.send({ error: true, message: "Unable to update session" });

    response.send({ ...patientSession.data });
  }
}

export default SessionController;
