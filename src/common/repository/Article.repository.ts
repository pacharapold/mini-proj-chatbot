import { Article } from '@common/type/Article.model';
import { Op } from 'sequelize';
export default {
  async findArticleByTitle(title: string) {
    return await Article.findOne({ where: { title } });
  },

  async findOneArticleByTag(tag: string[]) {
    return await Article.findOne({
      where: { tag: { [Op.overlap]: [...tag] } },
    });
  },

  async findAllAritcleByTag(tag: string[]) {
    return await Article.findAll({
      where: { tag: { [Op.overlap]: [...tag] } },
    });
  },
};
