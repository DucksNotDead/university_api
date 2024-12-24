import { Syllabuses } from '../db';

export class SyllabusesService {
  async getForReport(id: number) {
    await Syllabuses.startSession();
    const entity = await Syllabuses.query(`
    SELECT d.name, 
       s.year, 
       s.aims, 
       s.competencies, 
       s.requirements, 
       st.themes, 
       st.contents, 
       s.position_in_scheme, (
          SELECT json_agg(
              row_to_json(aggregated)
          )
          FROM (
              SELECT disp.semester, disp.type,
                     SUM(disp.hours) AS total_hours
              FROM disciplines_in_study_plans as disp
              JOIN study_plans as sp on disp.study_plan_id = sp.id 
              WHERE s.discipline_id = disp.discipline_id AND s.year = sp.year
              GROUP BY disp.discipline_id, disp.semester, disp.type
          ) AS aggregated
       ) as loads
       FROM syllabuses as s
       JOIN disciplines as d on s.discipline_id = d.id
       JOIN standards as st on s.standard_id = st.id
         where s.id = 1
    `);
    Syllabuses.endSession();

    return entity?.rows[0];
  }
}
