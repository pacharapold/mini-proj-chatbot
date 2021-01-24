import Gambler from '@common/type/Gambler.model';
import config from '@config/config';
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
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// initTransactionGuard(database, namespace);

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
