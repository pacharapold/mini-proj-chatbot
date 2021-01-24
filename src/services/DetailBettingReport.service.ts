import mapper from '@common/service/mapper.service';
import { IDetailBettingReportGambler } from '@common/type/DetailBettingReport.interface';
import { DetailBettingReport } from '@common/type/DetailBettingReport.model';
import { Gambler } from '@common/type/Gambler.model';
import Page from '@common/util/Page';
import moment from 'moment';
import { Op } from 'sequelize';

export default {
  async getDetailBettingReportOfGm(
    GamblerId: number,
    { pagination }: IDetailBettingReportGambler,
  ) {
    const { count, rows } = await DetailBettingReport.findAndCountAll({
      where: {
        GamblerId,
        tstamp: {
          [Op.gte]: moment(new Date())
            .subtract(2, 'days')
            .startOf('day'),
          [Op.lte]: moment(new Date()).endOf('day'),
        },
      },
      order: [['tstamp', 'DESC']],
      include: [{ model: Gambler }],
      ...Page.of(pagination),
    });
    return Page.result(
      { count, rows: rows.map(r => mapper.detailBettingReport(r)) },
      pagination,
    );
  },
};
