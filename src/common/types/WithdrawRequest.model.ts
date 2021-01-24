import { WithdrawRequestAction } from '@common/enum/WithdrawRequestAction.enum';
import { WithdrawRequestStatus } from '@common/enum/WithdrawRequestStatus.enum';
import { IGamblerBankAccount } from '@common/type/GamblerBankAccount.interface';
import { GamblerBankAccount } from '@common/type/GamblerBankAccount.model';
import { IOperator } from '@common/type/Operator.interface';
import { Operator } from '@common/type/Operator.model';
import {
    IWithdrawRequest,
    WithdrawRequestDetailType,
} from '@common/type/WithdrawRequest.interface';
import { IWork } from '@common/type/Work.interface';
import { Work } from '@common/type/Work.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { BigNumber } from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class WithdrawRequest extends Model implements IWithdrawRequest {
  public id!: number;
  public workImiId!: number;
  public workImi!: IWork;
  public workBankId!: number;
  public workBank!: IWork;
  public reserve!: boolean;
  public reserveOperatorId!: number;
  public reserveOperator!: IOperator;
  public reserveTstamp!: Date;
  public approveStatus!: WithdrawRequestAction;
  public approverId!: number;
  public approver!: IOperator;
  public status!: WithdrawRequestStatus;
  public GamblerBankAccountId!: number;
  public GamblerBankAccount!: IGamblerBankAccount;
  public tstamp!: Date;
  public executed!: boolean;
  public amount!: BigNumber;
  public beforeBalance!: BigNumber;
  public afterBalance!: BigNumber;
  public detail!: WithdrawRequestDetailType;
}

export default (database: Sequelize) => {
  WithdrawRequest.init(
    {
      id: dataTypes.primaryKey(),
      reserve: dataTypes.boolean(false),
      reserveTstamp: dataTypes.date(true),
      approveStatus: dataTypes.string(100, false),
      status: dataTypes.string(100, false),
      tstamp: dataTypes.date(),
      executed: dataTypes.boolean(false),
      amount: dataTypes.bigNumber('amount'),
      beforeBalance: dataTypes.bigNumber('beforeBalance', true),
      afterBalance: dataTypes.bigNumber('afterBalance', true),
      detail: dataTypes.json({}),
    },
    {
      tableName: 'withdraw_request',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['executed', 'approve_status', 'reserve'],
        },
      ],
    },
  );
  WithdrawRequest.belongsTo(GamblerBankAccount, restrictedOnDelete());
  GamblerBankAccount.hasMany(WithdrawRequest, restrictedOnDelete());
  WithdrawRequest.belongsTo(Operator, { as: 'approver' });
  WithdrawRequest.belongsTo(Operator, { as: 'reserveOperator' });
  WithdrawRequest.belongsTo(Work, { as: 'workImi' });
  WithdrawRequest.belongsTo(Work, { as: 'workBank' });
  return WithdrawRequest;
};
