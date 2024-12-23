import { Controller } from '../shared/helpers/decorators/controller';
import { Route } from '../shared/helpers/decorators/route';
import { IArgs } from '../shared/types';
import { Utils } from '../shared/utils';
import { Syllabuses } from '../db';
import { SyllabusCreateDto, SyllabusUpdateDto } from '../models/Syllabus';

@Controller('/syllabuses', 'Teacher', {
  repository: Syllabuses,
  getItem: { title: { key: 'id', prefix: 'Учебная программа' } },
  create: { dto: SyllabusCreateDto },
  update: { dto: SyllabusUpdateDto },
  get: null,
})
export default class {
  @Route('Get', '/', { isPublic: true })
  async getAll({ body, res }: IArgs) {
    await Syllabuses.startSession();
    const entities = await Syllabuses.getAll({
      joins: [['disciplines', 'discipline.name', 'discipline.id = main.discipline_id']],
    });
    Syllabuses.endSession();
    if (!entities) {
      return Utils.error(res, 404);
    }

    return Utils.success(res, entities);
  }
}
