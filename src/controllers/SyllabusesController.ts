import { Controller } from '../shared/helpers/decorators/controller';
import { Syllabuses } from '../db';
import { IArgs, TScopeFn } from '../shared/types';
import { SyllabusCreateDto, SyllabusUpdateDto } from '../models/Syllabus';
import { Route } from '../shared/helpers/decorators/route';
import { Utils } from '../shared/utils';

const scopeFn: TScopeFn = ({ user }) => ({
  joins: [['disciplines', 'd', 'd.id = main.discipline_id']],
  where: `d.department_id = ${user?.department_id}`,
});

@Controller('/syllabuses', 'Teacher', {
  repository: Syllabuses,
  get: { searchBy: null },
  create: { dto: SyllabusCreateDto },
  update: { dto: SyllabusUpdateDto, scopeFn },
})
export default class {
  @Route('Get', '/:id', { isPublic: true })
  async getItem({ params, res }:IArgs) {
    const id = Number(params['id'])

    const syllabus = await Syllabuses.get(id)

    if (!syllabus) {
      return Utils.error(res, 404, `id: ${id}`);
    }

    return Utils.success(res, syllabus)
  }
}
