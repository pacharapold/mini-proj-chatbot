import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import ConfigRepository from '@common/repository/Config.repository';
import ConfigService from '@common/service/Config.service';
import {
  IAgentDetail,
  ISiteConfig,
  ISiteConfigCreate,
  ISiteConfigUpdate,
} from '@common/type/Config.interface';
import { Config } from '@common/type/Config.model';
import { Gambler } from '@common/type/Gambler.model';
import BigNumber from 'bignumber.js';

export default {
  async getSiteConfig(site: string) {
    return (await ConfigService.getConfigDetail(site)) as ISiteConfig;
  },

  async getSiteList() {
    return await ConfigService.getDefaultConfigValueStringArray(
      ConfigTopic.SITE,
    );
  },

  async checkSite(site: string) {
    const sites = await this.getSiteList();
    if (!sites.includes(site)) {
      throw Invalid.badRequest(EC.SITE_DOES_NOT_EXIST);
    }
  },

  async updateSiteList(site: string) {
    // update site list config
    const siteList = await ConfigService.getDefaultConfigValueStringArray(
      ConfigTopic.SITE,
    );
    siteList.push(site);
    return await ConfigService.updateConfig({
      topic: ConfigTopic.SITE,
      detail: { value: siteList },
    });
  },

  async removeSiteList(site: string) {
    const siteList = await ConfigService.getDefaultConfigValueStringArray(
      ConfigTopic.SITE,
    );
    const filtered = siteList.filter(value => value !== site);
    return await ConfigService.updateConfig({
      topic: ConfigTopic.SITE,
      detail: { value: filtered },
    });
  },

  async createSiteConfig({ site, config }: ISiteConfigCreate) {
    const cf = await ConfigRepository.findConfigByTopic(site);
    if (cf) {
      throw Invalid.badRequest(EC.SITE_ALREADY_EXIST);
    }
    // convert to bignumber
    config.minimumDepositAmount = new BigNumber(config.minimumDepositAmount);
    config.minimumWithdrawAmount = new BigNumber(config.minimumWithdrawAmount);
    config.maximumWithdrawAuto = new BigNumber(config.maximumWithdrawAuto);
    config.maximumWithdrawAmountPerTime = new BigNumber(
      config.maximumWithdrawAmountPerTime,
    );
    config.maximumWithdrawAmountPerDay = new BigNumber(
      config.maximumWithdrawAmountPerDay,
    );

    await Config.create({
      topic: site,
      detail: config,
    });

    return await this.updateSiteList(site);
  },

  async updateSiteConfig({ site, key, value }: ISiteConfigUpdate) {
    const cf = await ConfigRepository.findConfigByTopic(site);
    if (!cf) {
      throw Invalid.badRequest(EC.SITE_DOES_NOT_EXIST);
    }
    const detail = cf.detail as ISiteConfig;
    if (key === 'maximumWithdrawCount' || key === 'withdrawTurnoverTime') {
      if (typeof value !== 'number') {
        throw Invalid.badRequest(EC.INVALID_REQUEST, 'value must be a number');
      }
      detail[key] = value as number;
    } else if (key === 'withdrawTurnoverAutoValidation') {
      if (typeof value !== 'boolean') {
        throw Invalid.badRequest(EC.INVALID_REQUEST, 'value must be a boolean');
      }
      detail[key] = value as boolean;
    } else if (
      key === 'announcement' ||
      key === 'lineRegisterMessage' ||
      key === 'siteUrl' ||
      key === 'apiUrl'
    ) {
      if (typeof value !== 'string') {
        throw Invalid.badRequest(EC.INVALID_REQUEST, 'value must be a string');
      }
      detail[key] = value as string;
    } else if (
      key === 'minimumDepositAmount' ||
      key === 'minimumWithdrawAmount' ||
      key === 'maximumWithdrawAuto' ||
      key === 'maximumWithdrawAmountPerTime' ||
      key === 'maximumWithdrawAmountPerDay'
    ) {
      if (typeof value !== 'number') {
        throw Invalid.badRequest(EC.INVALID_REQUEST, 'value must be a number');
      }
      detail[key] = new BigNumber(value as number);
    } else {
      throw Invalid.badRequest(EC.CONFIG_DOES_NOT_EXIST);
    }
    return await cf.update({ detail });
  },

  async deleteSiteConfig(site: string) {
    const config = await ConfigRepository.findConfigByTopic(site);
    if (!config) {
      throw Invalid.badRequest(EC.SITE_DOES_NOT_EXIST);
    }
    const gamblerCount = await Gambler.count({ where: { site } });
    if (gamblerCount >= 1) {
      throw Invalid.badRequest(EC.SITE_CANNOT_DELETE);
    }
    await config.destroy();
    return await this.removeSiteList(site);
  },

  async getSiteConfigByGamblerId(GamblerId: number) {
    const gambler = await Gambler.findByPk(GamblerId);
    if (!gambler) throw Invalid.badRequest(EC.GAMBLER_DOES_NOT_EXIST);
    return this.getSiteConfig(gambler.site);
  },
};
