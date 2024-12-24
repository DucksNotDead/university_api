import { Controller } from '../shared/helpers/decorators/controller';
import { Route } from '../shared/helpers/decorators/route';
import { IArgs } from '../shared/types';
import { Utils } from '../shared/utils';
import { Syllabuses } from '../db';
import { SyllabusCreateDto, SyllabusUpdateDto } from '../models/Syllabus';
import { SyllabusesService } from '../services/SyllabusesService';

const syllabusesService = new SyllabusesService();

@Controller('/syllabuses', 'Teacher', {
  repository: Syllabuses,
  create: { dto: SyllabusCreateDto },
  update: { dto: SyllabusUpdateDto },
  get: null,
})
export default class {
  @Route('Get', '/', { isPublic: true })
  async getAll({ user, res }: IArgs) {
    await Syllabuses.startSession();
    const entities = await Syllabuses.getAll({
      joins: [
        ['disciplines', 'discipline.name', 'discipline.id = main.discipline_id'],
        ['departments', 'department.head_id', 'department.id = discipline.department_id'],
      ],
    });
    Syllabuses.endSession();
    if (!entities) {
      return Utils.error(res, 404);
    }

    return Utils.success(res, entities);
  }

  @Route('Get', '/reports/:id', { isPublic: true })
  async getForReport({ res, params }: IArgs) {
    const id = Number(params.id);

    return Utils.success(res, await syllabusesService.getForReport(id));
  }
}
