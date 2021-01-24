import config from '@config/config';
import { initDB } from '@config/database';
import errorMiddleware from '@middleware/Error.middleware';
import responseHeader from '@middleware/ResponseHeader.middleware';
import routes from '@route/index';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

type config = {
  PORT: string | undefined;
  ENV: string | undefined;
  DB: string | undefined;
  DROP_TABLE: boolean | false;
  PRIVATE_KEY: string | undefined;
  SECRET_KEY: string;
};

class App {
  app: express.Application;
  config: config;

  constructor(appConfig: config) {
    this.config = appConfig;
    this.app = express();
  }

  async initialize() {
    // don't swap lines, order is necessary
    await this.initializeDatabase();
    // await this.initImportantData();

    this.initializeMiddleware();
    this.initialResponseHeader();
    this.initializeControllers();
    this.initializeErrorHandling();
    // tslint:disable-next-line: no-floating-promises
    // this.asyncLoop();
  }

  async start() {
    await this.initialize();
    const server = http.createServer(this.app);
    const port = this.config.PORT;
    const env = this.config.ENV;
    server.listen(port, () => {
      console.error(`Server started on port: ${port} on ${env}`);
    });
  }

  initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(cors());
  }

  initializeControllers() {
    this.app.use('/', routes);
  }

  initialResponseHeader() {
    this.app.use(responseHeader());
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  async initializeDatabase() {
    await initDB(this.config.DROP_TABLE);
  }

  // async initImportantData() {
  //   await InitializeService.initialSite();
  //   await InitializeService.initialConfig();
  //   await InitializeService.initialAdmin();
  //   await InitializeService.initialSystemOperator();
  //   if (config.ENV !== 'production') {
  //     await InitializeService.initialOperator();
  //     await InitializeService.initialNominee();
  //   }
  // }

  // async asyncLoop() {
  //   // tslint:disable: no-floating-promises
  //   WorkService.executeCompleteWork();
  //   BalanceService.updateProfileUi();
  //   SmsService.executedSms();
  //   BankMsgService.executedDepositFromBankMsg();
  //   BankMsgService.executedWithdrawFromBankMsg();
  //   ActionRequestService.executedActionRequest();
  //   WithdrawRequestService.executedWithdrawRequest();
  //   DetailTxReportService.mappingDetailTxReport();
  //   TxReportService.scheduleJobTxReportDaily();
  // }
}

export default App;
