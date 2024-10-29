import useSendTelegram from "@/app/helpers/useSendTelegram";
import mysql, { RowDataPacket } from "mysql2/promise";

// Erstelle eine Verbindung zur MariaDB-Datenbank
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const getUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
};

export const getMember = async (id: number) => {
  const [rows] = await pool.query("SELECT * FROM user WHERE id = 1", [id]);
  return rows;
};

export const updateMember = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string
) => {
  const [rows] = await pool.query(
    "UPDATE user SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
    [firstName, lastName, email, id]
  );
  return rows;
};

export const retireUser = async (id: number, retire: boolean) => {
  const [rows] = await pool.query(
    "UPDATE user SET is_active = ? WHERE id = ?",
    [retire ? 0 : 1, id]
  );
  return rows;
};

export const getUnassignedShifts = async (user_id: number) => {
  const result = [];
  const sql = `
    SELECT * FROM shift
    WHERE worker1_id IS NULL OR worker2_id IS NULL
  `;

  const [shifts] = await pool.query<RowDataPacket[]>(sql);
  for (const shift of shifts) {
    // did user do a survey?
    const [existingSurvey] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM survey WHERE user_id = ? AND shift_id = ?",
      [user_id, shift.id]
    );

    result.push({
      id: shift.id,
      date: shift.date,
      specialEvent: shift.special_event,
      specialName: shift.special_name,
      availability: existingSurvey[0] ? existingSurvey[0].availability : null,
    });
  }
  return result;
};

export const addSurvey = async (
  selectedOptions: [number, Record<number, string>]
) => {
  const user_id = selectedOptions[0];
  const options = selectedOptions[1];
  let sql = `
    SELECT * FROM survey
    WHERE user_id = ?
  `;
  const [surveys] = await pool.query<RowDataPacket[]>(sql, user_id);
  for (const survey of surveys) {
    await pool.query<RowDataPacket[]>(
      "DELETE FROM survey WHERE id = ?",
      survey.id
    );
  }

  await pool.query<RowDataPacket[]>(
    "UPDATE user SET registered = 1 WHERE id = ?",
    user_id
  );

  for (const option in options) {
    let availability;
    switch (options[option]) {
      case "true":
        availability = 1;
        break;
      case "false":
        availability = -1;
        break;
      case "maybe":
        availability = 0;
        break;
      case "dontknow":
        availability = 99;
        break;
      default:
        break;
    }
    await pool.query<RowDataPacket[]>(
      "INSERT INTO survey (user_id, shift_id, availability) VALUES (?,?,?)",
      [user_id, option, availability]
    );
  }

  return "hi";
};

export const getShifts = async (
  year: number,
  month: number,
  special: boolean
) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT 
        s.id,
        s.date,
        s.end_date,
        s.special_event,
        s.special_name,
        u1.first_name AS worker1_name,
        u2.first_name AS worker2_name 
      FROM shift s
      LEFT JOIN 
        user u1 ON s.worker1_id = u1.id
      LEFT JOIN 
        user u2 ON s.worker2_id = u2.id
      WHERE YEAR(s.date) = ? AND MONTH(s.date) = ? AND s.special_event = ?;
    `,
    [year, month, special]
  );
  return rows;
};

export const getShift = async (id: string) => {
  // const [rows] = await pool.query("SELECT * FROM shift WHERE id = ?", [id]);
  const sql = `
    SELECT date, end_date, special_event, special_name, 
    u1.id AS worker1_id, u1.first_name AS worker1_first_name, u1.last_name AS worker1_last_name,
    u2.id AS worker2_id, u2.first_name AS worker2_first_name, u2.last_name AS worker2_last_name 
    FROM shift s 
    LEFT JOIN user u1 ON u1.id = s.worker1_id 
    LEFT JOIN user u2 ON u2.id = s.worker2_id 
    WHERE s.id = ?;
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

export const updateShift = async (
  id: string,
  date: string,
  endDate: string,
  worker1_id: string,
  worker2_id: string,
  specialName: string
) => {
  const [rows] = await pool.query(
    "UPDATE shift SET date = ?, end_date = ?, worker1_id = ?, worker2_id = ?, special_name = ? WHERE id = ?",
    [date, endDate, worker1_id, worker2_id, specialName, id]
  );
  return rows;
};

export const getSurveys = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT first_name, last_name, date, end_date, special_event, special_name, availability, user.id, survey.id AS surveyId
    FROM user 
    LEFT JOIN survey ON survey.user_id = user.id 
    LEFT JOIN shift ON survey.shift_id = shift.id`
  );
  const surveysByUser: { [key: string]: any[] } = {};
  for (const row of rows) {
    const userName = row.first_name;
    const survey = {
      id: row.surveyId,
      first_name: row.first_name,
      last_name: row.last_name,
      date: row.date,
      end_date: row.end_date,
      special_event: row.special_event,
      special_name: row.special_name,
      availability: row.availability,
    };

    if (surveysByUser[userName]) {
      surveysByUser[userName].push(survey);
    } else {
      surveysByUser[userName] = [survey];
    }
  }

  return surveysByUser;
};

export const login = async (pw: string) => {
  if (pw === process.env.ADMIN_PW) {
    return true;
  } else return false;
};

export const addUser = async (user: any) => {
  const { firstName, lastName, email } = user;
  await pool.query<RowDataPacket[]>(
    `
      INSERT INTO user (first_name, last_name, email, registered) VALUES (?,?,?,0)
    `,
    [firstName, lastName, email]
  );
  return "created User!";
};

export const createShift = async (shift: any) => {
  const { date, endDate, specialEvent, eventName } = shift;

  // Validate that date is before endDate
  if (new Date(date) >= new Date(endDate)) {
    return "Start should be before End";
  }

  // Check if a shift with the same date already exists
  const [existingShifts] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM shift WHERE date < ? AND end_date > ?",
    [endDate, date]
  );

  if (existingShifts.length > 0) {
    return "Shift with this date already exists!";
  }

  await pool.query<RowDataPacket[]>(
    `
      INSERT INTO shift (date, end_date, special_event, special_name) VALUES (?,?,?,?)
    `,
    [date, endDate, specialEvent, eventName]
  );
  return "Survey Shift created successfully!";
};

function getMondaysInOddWeeks(year: number, month: number): Date[] {
  // Hilfsfunktion zur Berechnung der Woche des Jahres
  function getWeekOfYear(date: Date): number {
    const d = new Date(date);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return weekNumber;
  }

  const mondays: Date[] = [];
  const startDate = new Date(year, month - 1, 2); // Erster Tag des angegebenen Monats
  const endDate = new Date(year, month, 1); // Letzter Tag des angegebenen Monats

  // Setze das Datum auf den ersten Montag im angegebenen Monat
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() + 1);
  }

  // Iteriere durch alle Montage im angegebenen Monat
  let currentMonday = startDate;
  while (currentMonday <= endDate) {
    if (getWeekOfYear(currentMonday) % 2 === 0) {
      // Ungerade Woche
      mondays.push(new Date(currentMonday));
    }
    currentMonday.setDate(currentMonday.getDate() + 7); // Nächster Montag
  }

  return mondays;
}

export const createMonth = async (month: number) => {
  const year = 2024;

  const [users] = await pool.query<RowDataPacket[]>("SELECT id from user");
  for (const user of users) {
    await pool.query<RowDataPacket[]>(
      "UPDATE user SET registered = 0 where id = ?",
      user.id
    );
  }

  const mondaysOfNextMonth = getMondaysInOddWeeks(year, month);

  for (const date of mondaysOfNextMonth) {
    {
      // Shift 1
      let start = new Date(date);
      start.setHours(21);
      let end = new Date(date);
      end.setHours(23);

      const [existingShift1] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM shift WHERE date < ? AND end_date > ?",
        [end, start]
      );

      if (existingShift1.length === 0) {
        await pool.query<RowDataPacket[]>(
          "INSERT INTO shift (date, end_date, special_event, special_name) VALUES (?, ?, ?, ?)",
          [start, end, 0, "Bar"]
        );
      }

      // Shift 2
      start = new Date(date);
      start.setHours(23);
      end = new Date(date);
      end.setHours(1);
      end.setDate(end.getDate() + 1);

      const [existingShift2] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM shift WHERE date < ? AND end_date > ?",
        [end, start]
      );

      if (existingShift2.length === 0) {
        await pool.query<RowDataPacket[]>(
          "INSERT INTO shift (date, end_date, special_event, special_name) VALUES (?, ?, ?, ?)",
          [start, end, 0, "Bar"]
        );
      }
    }
  }
  return "created Month!";
};

export const getSurveysToAssign = async () => {
  const result: { [key: string]: any } = {};

  const [shifts] = await pool.query<RowDataPacket[]>(
    `
      SELECT *
      FROM shift s
      WHERE s.worker1_id IS NULL
        OR s.worker2_id IS NULL;
    `
  );
  for (const shift of shifts) {
    result[shift.id] = {
      specialEvent: shift.special_event,
      specialName: shift.special_name,
      date: shift.date,
      end_date: shift.end_date,
      surveys: {},
    };
    const [surveys] = await pool.query<RowDataPacket[]>(
      `
        SELECT availability, survey.id as surveyId, user_id, first_name
        FROM survey
        LEFT JOIN user ON survey.user_id = user.id
        WHERE shift_id = ?
      `,
      shift.id
    );
    for (const survey of surveys) {
      if (survey.availability === -1 || survey.availability === 99) continue;

      // Check if the survey is already assigned to a shift
      let assigned = false;
      const [oldShift] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM shift WHERE id = ?",
        shift.id
      );
      if (oldShift.length > 0) {
        assigned =
          oldShift[0].worker1_id === survey.user_id ||
          oldShift[0].worker2_id === survey.user_id;
      }

      result[shift.id]["surveys"][survey.surveyId] = {
        userId: survey.user_id,
        user: survey.first_name,
        availability: survey.availability,
        assigned: assigned,
      };
    }
  }

  return result;
};

export const assignShifts = async (shifts: Record<string, boolean>) => {
  try {
    for (const shift in shifts) {
      const [surveyResults] = await pool.query<RowDataPacket[]>(
        `
        SELECT user_id, shift_id FROM survey
        WHERE id = ?
      `,
        shift
      );
      if (surveyResults.length === 0) continue;
      const survey = surveyResults[0];

      const [shiftResults] = await pool.query<RowDataPacket[]>(
        `
        SELECT worker1_id, worker2_id FROM shift
        WHERE id = ?
      `,
        survey.shift_id
      );
      if (shiftResults.length === 0) continue;
      const shiftToAssign = shiftResults[0];

      if (shifts[shift]) {
        if (!shiftToAssign.worker1_id) {
          await pool.query(
            `
            UPDATE shift
            SET worker1_id = ?
            WHERE id = ?
          `,
            [survey.user_id, survey.shift_id]
          );
        } else {
          await pool.query(
            `
            UPDATE shift
            SET worker2_id = ?
            WHERE id = ?
          `,
            [survey.user_id, survey.shift_id]
          );
        }
      } else {
        await pool.query(
          `
        UPDATE shift
        SET 
          worker1_id = CASE 
                        WHEN worker1_id = ? THEN NULL 
                        ELSE worker1_id 
                      END,
          worker2_id = CASE 
                        WHEN worker2_id = ? THEN NULL 
                        ELSE worker2_id 
                      END
        WHERE id = ?;
        `,
          [survey.user_id, survey.user_id, survey.shift_id]
        );
      }
    }

    return "shifts assigned";
  } catch (error) {
    console.error("Error assigning shifts:", error);
  }
};

export const getEvents = async () => {
  const [shifts] = await pool.query<RowDataPacket[]>("SELECT * FROM shift");
  const [usages] = await pool.query<RowDataPacket[]>("SELECT * FROM bar_usage");
  const result: {
    shifts: { [key: string]: any };
    usage: { [key: string]: any };
  } = {
    shifts: {},
    usage: {},
  };
  for (const shift of shifts) {
    result.shifts[shift.id] = {
      date: shift.date,
      endDate: shift.end_date,
      eventName: shift.special_name,
    };
  }

  for (const usage of usages) {
    result.usage[usage.id] = {
      date: usage.start_date,
      endDate: usage.end_date,
      eventName: usage.title,
    };
  }

  return result;
};

export const useBar = async (date: Date, endDate: Date, title: string) => {
  console.log(date);
  await pool.query(
    "INSERT INTO bar_usage (start_date, end_date, title) VALUES (?,?,?)",
    [date, endDate, title]
  );
  return "Bar used!";
};

export const closeDatabaseConnection = async () => {
  await pool.end();
};
