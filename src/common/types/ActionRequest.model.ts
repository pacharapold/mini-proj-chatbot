import { ActionRequestType } from '@common/enum/ActionRequestType.enum';
import {
  IActionRequest,
  IActionRequestDetail,
} from '@common/type/ActionRequest.interface';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { IOperator } from '@common/type/Operator.interface';
import { Operator } from '@common/type/Operator.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class ActionRequest extends Model implements IActionRequest {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public approvedAt!: Date;
  public type!: ActionRequestType;
  public executed!: boolean;
  public approved!: boolean;
  public requesterId!: number;
  public approverId!: number;
  public requester!: IOperator;
  public approver!: IOperator;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public BalanceChangeId?: number;
  public BalanceChange?: IBalanceChange;
  public approveRemark!: string;
  public requestRemark!: string;
  public detail!: IActionRequestDetail;
  public result?: string;
}

export default (database: Sequelize) => {
  ActionRequest.init(
    {
      id: dataTypes.primaryKey(),
      approvedAt: dataTypes.date(true),
      type: dataTypes.string(100),
      executed: dataTypes.boolean(false),
      approved: dataTypes.boolean(false),
      approveRemark: dataTypes.string(1000, true),
      requestRemark: dataTypes.string(1000, true),
      detail: dataTypes.json({}),
      result: dataTypes.string(1000, true),
    },
    {
      tableName: 'action_request',
      sequelize: database,
      timestamps: true,
      indexes: [
        {
          unique: false,
          fields: ['gambler_id', 'type', 'executed', 'approved'],
        },
      ],
    },
  );
  ActionRequest.belongsTo(Gambler, restrictedOnDelete());
  Gambler.hasMany(ActionRequest, restrictedOnDelete());
  ActionRequest.belongsTo(BalanceChange, restrictedOnDelete(true));
  BalanceChange.hasMany(ActionRequest, restrictedOnDelete(true));
  ActionRequest.belongsTo(Operator, { as: 'requester' });
  ActionRequest.belongsTo(Operator, { as: 'approver' });
  return ActionRequest;
};
