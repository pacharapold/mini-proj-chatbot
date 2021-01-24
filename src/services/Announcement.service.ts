import SiteConfigService from '@common/service/SiteConfig.service';

export default {
  async getAnnouncement(site: string) {
    const { announcement } = await SiteConfigService.getSiteConfig(site);
    return { text: announcement };
  },
};
