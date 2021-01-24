import { EC, Invalid } from '@common/error/Invalid.error';
import mapper from '@common/service/mapper.service';
import { Article } from '@common/type/Article.model';
import { Op } from 'sequelize';

export default {
  async getPromotionArticle(id: number) {
    const article = await Article.findOne({
      where: {
        id,
        tag: {
          [Op.overlap]: ['promotion'],
        },
      },
    });
    if (!article) {
      throw Invalid.badRequest(EC.PROMOTION_ARTICLE_DOES_NOT_EXIST);
    }
    return mapper.article(article);
  },

  async getAllPromotionArticle(site: string) {
    const articles = await Article.findAll({
      where: {
        site,
        tag: {
          [Op.overlap]: ['promotion'],
        },
      },
    });
    return articles.map(x => mapper.article(x));
  },
};
