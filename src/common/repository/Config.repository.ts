import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { Config } from '@common/type/Config.model';

export default {
  async findConfigByTopic(topic: ConfigTopic | string) {
    return await Config.findOne({ where: { topic } });
  },
};
