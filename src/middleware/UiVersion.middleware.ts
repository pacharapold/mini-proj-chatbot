import { UiType } from '@common/enum/UiType.enum';
import { uiVersionService } from '@common/service/UiVersion.service';
import config from '@config/config';
import express from 'express';

function uiVersionMiddleware(): express.RequestHandler {
  return async (req, res, next) => {
    const baseUrl = req.baseUrl;
    if (config.UI_ROUTE.includes(baseUrl)) {
      const ui = await uiVersionService.getUiVersion(
        UiType.front,
        req.header('site')!,
      );
      res.set({ 'UI-Version': ui.version });
    }
    next();
  };
}

export default uiVersionMiddleware;
