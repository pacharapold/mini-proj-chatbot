import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { UiType } from '@common/enum/UiType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import ConfigService from '@common/service/Config.service';
import {
  IDefaultConfig,
  ISiteConfig,
  IUIConfigUpdate,
} from '@common/type/Config.interface';

const validateUiType = (type: UiType) => {
  if (!UiType[type]) throw Invalid.badRequest(EC.UI_TYPE_DOES_NOT_EXIST);
};

async function getUiVersion(
  type: UiType,
  site: string | undefined | null = null,
) {
  // validate user interface type
  validateUiType(type);
  if (type === UiType.office) {
    const value = await ConfigService.getDefaultConfigValueString(
      ConfigTopic.OFFICE_UI_VERSION,
    );
    return { version: value };
  }
  const detail = await ConfigService.getConfigBySite(site!);
  return { version: detail.uiVersion };
}

async function updateOfficeVersion({ version }: IUIConfigUpdate) {
  const config = await ConfigService.getConfig(ConfigTopic.OFFICE_UI_VERSION);
  const detail = config.detail as IDefaultConfig;
  detail.value = version;
  config.detail = detail;
  await config.save();
  return await getUiVersion(UiType.office);
}

async function updateFrontVersion({ version }: IUIConfigUpdate, site: string) {
  const config = await ConfigService.getConfig(site);
  const detail = config.detail as ISiteConfig;
  detail.uiVersion = version;
  config.detail = detail;
  await config.save();
  return await getUiVersion(UiType.front, site);
}

export const uiVersionService = {
  getUiVersion,
  updateFrontVersion,
  updateOfficeVersion,
};
