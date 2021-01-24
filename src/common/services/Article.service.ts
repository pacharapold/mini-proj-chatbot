import { Promotion } from '@common/enum/Promotion.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import {
  IArticleCreate,
  IArticleList,
  IArticleSearch,
  IArticleUpdate,
} from '@common/type/Article.interface';
import { Article } from '@common/type/Article.model';
import Page from '@common/util/Page';
import { Op } from 'sequelize';

/**
 * restrict article list
 */
export const restrictArticle = ['promotion', 'question', 'user_guide'];

async function getArticle(id: number): Promise<Article> {
  const article = await Article.findByPk(id);
  if (!article) {
    throw Invalid.badRequest(EC.ARTICLE_DOES_NOT_EXIST);
  }
  return article;
}

async function getArticleList({ pagination }: IArticleList, site: string) {
  return Page.result(
    await Article.findAndCountAll({
      where: {
        site,
        [Op.not]: {
          tag: {
            /* exclude article from promotion, question, user guide article */
            [Op.overlap]: restrictArticle,
          },
        },
      },
      order: [['id', 'DESC']],
      ...Page.of(pagination),
    }),
    pagination,
  );
}

async function searchArticle({ pagination, site, text }: IArticleSearch) {
  let siteCondition = {};
  if (site) {
    siteCondition = {
      site,
    };
  }

  let textCondition = {};
  if (text) {
    textCondition = {
      [Op.or]: {
        title: { [Op.substring]: text },
        tag: { [Op.overlap]: [`${text}`] },
      },
    };
  }
  return Page.result(
    await Article.findAndCountAll({
      where: {
        ...siteCondition,
        ...textCondition,
        [Op.not]: {
          tag: {
            /* exclude article from promotion, question, user guide article */
            [Op.overlap]: restrictArticle,
          },
        },
      },
      order: [['id', 'DESC']],
      ...Page.of(pagination),
    }),
    pagination,
  );
}

async function createArticle({
  title,
  content,
  image,
  tag,
  site,
}: IArticleCreate) {
  return await Article.create({
    title,
    content,
    image,
    tag,
    date: new Date(),
    site: site ?? null,
  });
}
async function updateArticle({
  articleId,
  title,
  content,
  image,
  tag,
}: IArticleUpdate) {
  const article = await Article.findByPk(articleId);
  if (!article) throw Invalid.badRequest(EC.ARTICLE_DOES_NOT_EXIST);
  article.title = title;
  article.content = content;
  article.image = image;
  article.tag = tag;
  article.date = new Date();
  await article.save();
  return article;
}

async function deleteArticle(id: number, tag: string[] | null = null) {
  let deleteCondition = {};
  if (tag && tag.length > 0) {
    deleteCondition = {
      tag: {
        [Op.overlap]: [...tag],
      },
    };
  }
  return await Article.destroy({ where: { id, ...deleteCondition } });
}

export const articleService = {
  getArticle,
  getArticleList,
  searchArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
