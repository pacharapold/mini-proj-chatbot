import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import ConfigRepository from '@common/repository/Config.repository';
import {
  IConfig,
  IConfigDetail,
  IConfigNew,
  IConfigUpdate,
  IDefaultConfig,
  IDefaultConfigResult,
  IDefaultConfigUpdate,
  ISiteConfig,
} from '@common/type/Config.interface';
import { Config } from '@common/type/Config.model';

const configResultFront = (config: IConfig): IDefaultConfigResult => {
  const detail = config.detail as IDefaultConfig;
  return {
    topic: config.topic,
    value: detail.value,
  };
};

export default {
  async loadOrCreate({ topic, detail }: IConfigNew) {
    return (
      (await ConfigRepository.findConfigByTopic(topic)) ??
      (await Config.create({
        topic,
        detail,
      }))
    );
  },

  async getConfig(topic: ConfigTopic | string): Promise<Config> {
    const config = await ConfigRepository.findConfigByTopic(topic);
    if (!config) throw Invalid.badRequest(EC.CONFIG_DOES_NOT_EXIST);
    return config;
  },

  async getConfigDetail(topic: ConfigTopic | string): Promise<IConfigDetail> {
    const config = await Config.findOne({
      where: { topic },
    });
    if (!config) throw Invalid.badRequest(EC.CONFIG_DOES_NOT_EXIST);
    return config.detail;
  },

  async getDefaultConfigValueString(topic: ConfigTopic | string) {
    const detail = (await this.getConfigDetail(topic)) as IDefaultConfig;
    return detail.value as string;
  },
  async getDefaultConfigValueNumber(topic: ConfigTopic | string) {
    const detail = (await this.getConfigDetail(topic)) as IDefaultConfig;
    return detail.value as number;
  },
  async getDefaultConfigValueBoolean(topic: ConfigTopic | string) {
    const detail = (await this.getConfigDetail(topic)) as IDefaultConfig;
    return detail.value as boolean;
  },
  async getDefaultConfigValueStringArray(topic: ConfigTopic | string) {
    const detail = (await this.getConfigDetail(topic)) as IDefaultConfig;
    return detail.value as string[];
  },

  async getConfigBySite(site: string) {
    return (await this.getConfigDetail(site)) as ISiteConfig;
  },

  async getSiteList() {
    const sites = (await this.getConfigDetail(
      ConfigTopic.SITE,
    )) as IDefaultConfig;
    return sites.value as string[];
  },

  async updateConfig({ topic, detail }: IConfigUpdate): Promise<IConfig> {
    const config = await ConfigRepository.findConfigByTopic(topic);
    if (!config) throw Invalid.badRequest(EC.CONFIG_DOES_NOT_EXIST);
    config.detail = detail;
    await config.save();
    return config;
  },

  async updateDefaultConfig({
    topic,
    value,
  }: IDefaultConfigUpdate): Promise<IDefaultConfigResult> {
    const config = await ConfigRepository.findConfigByTopic(topic);
    if (!config) throw Invalid.badRequest(EC.CONFIG_DOES_NOT_EXIST);
    const detail: IDefaultConfig = { value };
    config.detail = detail;
    await config.save();
    return configResultFront(config);
  },

  async checkSite(site: string) {
    const sites = await this.getSiteList();
    if (!sites.includes(site)) {
      throw Invalid.badRequest(EC.SITE_DOES_NOT_EXIST);
    }
  },
};
