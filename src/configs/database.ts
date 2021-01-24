import ActionRequest from '@common/type/ActionRequest.model';
import Admin from '@common/type/Admin.model';
import Article from '@common/type/Article.model';
import Balance from '@common/type/Balance.model';
import BalanceChange from '@common/type/BalanceChange.model';
import BankMsg from '@common/type/BankMsg.model';
import BettingReport from '@common/type/BettingReport.model';
import Commission from '@common/type/Commission.model';
import Config from '@common/type/Config.model';
import DetailBettingReport from '@common/type/DetailBettingReport.model';
import DetailTxReport from '@common/type/DetailTxReport.model';
import Gambler from '@common/type/Gambler.model';
import GamblerBankAccount from '@common/type/GamblerBankAccount.model';
import Nominee from '@common/type/Nominee.model';
import NomineeBankAccount from '@common/type/NomineeBankAccount.model';
import Operator from '@common/type/Operator.model';
import OtpRequest from '@common/type/OtpRequest.model';
import ProviderAccount from '@common/type/ProviderAccount.model';
import PuppeteerChannel from '@common/type/PuppeteerChannel.model';
import Sms from '@common/type/Sms.model';
import SmsDevice from '@common/type/SmsDevice.model';
import Turnover from '@common/type/Turnover.model';
import TxReport from '@common/type/TxReport.model';
import WithdrawRequest from '@common/type/WithdrawRequest.model';
import Work from '@common/type/Work.model';
import config from '@config/config';
import { initTransactionGuard } from '@midas-soft/midas-common';
import clsHooked from 'cls-hooked';
import pg from 'pg';
import { Sequelize } from 'sequelize';

const namespace = clsHooked.createNamespace('proj-chatbot');
Sequelize.useCLS(namespace);

pg.defaults.parseInt8 = true;

export const database: Sequelize = new Sequelize(config.DB, {
  define: {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  dialect: 'postgres',
});

initTransactionGuard(database, namespace);

export const initDB = async (dropAndRecreateTable: boolean) => {
  try {
    await database.authenticate();
    console.log('Connection has been established successfully.');
  } catch (err) {
    console.log('Unable to connect to the database', err);
  }

  // Config(database);
  // Admin(database);
  // Operator(database);
  // Nominee(database);
  // NomineeBankAccount(database);
  // OtpRequest(database);
  Gambler(database);
  // GamblerBankAccount(database);
  // ProviderAccount(database);
  // Balance(database);
  // BalanceChange(database);
  // Config(database);
  // PuppeteerChannel(database);
  // SmsDevice(database);
  // Sms(database);
  // BankMsg(database);
  // Work(database);
  // Article(database);
  // BettingReport(database);
  // DetailBettingReport(database);
  // ActionRequest(database);
  // WithdrawRequest(database);
  // Commission(database);
  // Turnover(database);
  // TxReport(database);
  // DetailTxReport(database);
  await database.sync({ force: dropAndRecreateTable });
};
