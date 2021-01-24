import { BalanceChangeUiType } from '@common/enum/BalanceChangeUiType.enum';
import { TxType } from '@common/enum/TxType.enum';
import {
  IActionRequest,
  IActionRequestSearchDetail,
  IActionRequestSearchResult,
  IActionRequestUpdateResponse,
} from '@common/type/ActionRequest.interface';
import { IAdmin, IAdminProfile } from '@common/type/Admin.interface';
import { IArticle } from '@common/type/Article.interface';
import {
  IBalanceChange,
  IBalanceChangeActionRequestChangeCredit,
  IBalanceChangeDetailUi,
  IBalanceChangeFilterResult,
  IBalanceChangeSearchBySiteResult,
  IBalanceChangeUi,
  IBalanceChangeWithdrawDetail,
  IBalanceChangeWithdrawRequest,
} from '@common/type/BalanceChange.interface';
import { IBankMsg, IBankMsgDepositList } from '@common/type/BankMsg.interface';
import {
  ICommission,
  ICommissionResult,
  ICommissionSearchResult,
} from '@common/type/Commission.interface';
import { IDetailBettingReport } from '@common/type/DetailBettingReport.interface';
import {
  IDetailTxReport,
  IDetailTxReportSearchResult,
} from '@common/type/DetailTxReport.interface';
import {
  IGambler,
  IGamblerSearchBySite,
  IGamblerFilterResult,
  IGamblerInfo,
  IGamblerReportResult,
  IGamblerSearchBySiteResult,
} from '@common/type/Gambler.interface';
import {
  IGamblerBankAccount,
  IGamblerBankAccountFilterResult,
  IGamblerBankAccountNameRetrieve,
  IGamblerBankAccountSearchBySiteResult,
} from '@common/type/GamblerBankAccount.interface';
import {
  INomineeBankAccount,
  INomineeBankAccountSearchResult,
} from '@common/type/NomineeBankAccount.interface';
import { IOperator, IOperatorProfile } from '@common/type/Operator.interface';
import { IProviderAccount } from '@common/type/ProviderAccount.interface';
import { ProviderAccount } from '@common/type/ProviderAccount.model';
import {
  IPuppeteerChannel,
  IPuppeteerChannelCreate,
} from '@common/type/PuppeteerChannel.interface';
import { ISms, ISmsDetail, ISmsFilterResult } from '@common/type/Sms.interface';
import {
  ITxReport,
  ITxReportSearchResult,
} from '@common/type/TxReport.interface';
import { VENDORS } from '@common/type/Vendor.interface';
import {
  IWithdrawRequest,
  IWithdrawRequestDetailResult,
  IWithdrawRequestSearchResult,
} from '@common/type/WithdrawRequest.interface';
import { IWork } from '@common/type/Work.interface';
import { ITransferResult } from '@common/type/Work.Provider.interface';
import { sensitiveInfo } from '@common/util/common';
import { momentTH } from '@common/util/momentTH';

export default {
  telNoMapping(telNo: string) {
    return telNo
      .trim()
      .split('-')
      .join('')
      .split(' ')
      .join('');
  },

  adminProfile({ username, telNo, detail }: IAdmin): IAdminProfile {
    return {
      username,
      telNo: this.telNoMapping(telNo),
      role: detail.role,
    };
  },

  operatorProfile({
    id,
    name,
    username,
    role,
    telNo,
    active,
    site,
  }: IOperator): IOperatorProfile {
    return {
      id,
      name,
      username,
      role,
      site,
      telNo: this.telNoMapping(telNo),
      active: active!,
    };
  },

  puppeteerChannel({
    ipAddress,
    owner,
    subOwner,
    active,
    type,
  }: IPuppeteerChannel): IPuppeteerChannelCreate {
    return {
      ipAddress,
      owner,
      subOwner,
      active,
      type,
    };
  },

  nomineeBankAccountUpdate({
    id,
    type,
    active,
    bankCode,
    accountNo,
    sequence,
    auto,
    Nominee,
  }: INomineeBankAccount) {
    return {
      id,
      type,
      active,
      bankCode,
      accountNo,
      sequence,
      auto,
      accountName: Nominee.fullName,
    };
  },

  nomineeBankAccountFilter({
    id,
    bankCode,
    accountNo,
    Nominee,
    type,
    sequence,
  }: INomineeBankAccount) {
    return {
      accountNo,
      bankCode,
      type,
      sequence,
      nomineeBankAccountId: id,
      alias: Nominee.alias,
      accountName: Nominee.fullName,
    };
  },

  nomineeBankAccountSearchResult({
    id,
    lastBalance,
    lastBalanceUpdate,
    bankCode,
    accountNo,
    active,
    type,
    username,
    password,
    smsTelNo,
    sequence,
    auto,
    Nominee,
  }: INomineeBankAccount): INomineeBankAccountSearchResult {
    return {
      id,
      lastBalance,
      lastBalanceUpdate,
      bankCode,
      accountNo,
      active,
      type,
      sequence,
      auto,
      smsTelNo: this.telNoMapping(smsTelNo),
      hasUsername: username ? true : false,
      hasPassword: password ? true : false,
      Nominee: {
        id: Nominee.id,
        accountName: Nominee.fullName,
        telNo: this.telNoMapping(Nominee.telNo),
        alias: Nominee.alias,
      },
    };
  },

  gamblerFilter({
    Gambler,
    accountName,
    bankCode,
    accountNo,
  }: IGamblerBankAccount): IGamblerFilterResult {
    return {
      accountName,
      bankCode,
      accountNo,
      GamblerId: Gambler.id,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      refCode: Gambler.refCode,
      username: Gambler.username,
    };
  },

  gamblerBankAccountFilter({
    GamblerId,
    Gambler,
    bankCode,
    accountNo,
    accountName,
    lockWithdraw,
    active,
    verifyName,
    autoDeposit,
    disabledDepositTstamp,
    validateTurnover,
    accountNameRetrieved,
  }: IGamblerBankAccount): IGamblerBankAccountFilterResult {
    return {
      GamblerId,
      bankCode,
      accountNo,
      accountName,
      verifyName,
      lockWithdraw,
      active,
      autoDeposit,
      disabledDepositTstamp,
      validateTurnover,
      accountNameRetrieved,
      username: Gambler.username,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
    };
  },

  balanceChangeFilter({
    id,
    Gambler,
    type,
    amountBefore,
    amount,
    amountAfter,
    tstamp,
    status,
  }: IBalanceChange): IBalanceChangeFilterResult {
    return {
      id,
      type,
      amountBefore,
      amount,
      amountAfter,
      tstamp,
      status,
      username: Gambler.username,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      site: Gambler.site,
    };
  },

  smsFilter({
    id,
    SmsDevice,
    senderName,
    msg,
    tstamp,
    readable,
    executed,
  }: ISms): ISmsFilterResult {
    return {
      id,
      SmsDevice,
      senderName,
      msg,
      tstamp,
      readable,
      executed,
    };
  },

  providerAccount({
    id,
    agentUserName,
    username,
    locked,
    GamblerId,
    Gambler,
  }: IProviderAccount) {
    return {
      id,
      username,
      locked,
      agentUsername: agentUserName,
      used: GamblerId !== null,
      Gambler: {
        id: GamblerId ?? null,
        username: GamblerId ? Gambler.username : null,
      },
    };
  },

  botWork({
    id,
    type,
    owner,
    subOwner,
    createTstamp,
    completed,
    executed,
    completedTstamp,
    executedTstamp,
    result,
  }: IWork) {
    const detail = result as ITransferResult;
    return {
      id,
      type,
      owner,
      subOwner,
      createTstamp,
      statusWork: completed ? 'COMPLETED' : 'IN_PROGRESS',
      statusExecute: executed ? 'COMPLETED' : 'IN_PROGRESS',
      statusResult: detail.status,
      tstampWork: completedTstamp ?? null,
      tstampExecute: executedTstamp ?? null,
    };
  },

  detailBettingReport({
    id,
    agentUsername,
    dstamp,
    tstamp,
    currencyCode,
    turnover,
    validAmount,
    win,
    game,
    detail,
    GamblerId,
    Gambler,
    vendorCode,
    commission,
  }: IDetailBettingReport) {
    const vendor = VENDORS[vendorCode] ?? null;
    return {
      id,
      agentUsername,
      dstamp,
      tstamp,
      currencyCode,
      turnover,
      validAmount,
      commission,
      win,
      game,
      detail,
      vendor,
      Gambler: {
        id: GamblerId,
        username: Gambler.username,
        telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      },
    };
  },

  actionRequestSearchResult({
    id,
    createdAt,
    type,
    requester,
    Gambler,
    approvedAt,
    approved,
    executed,
  }: IActionRequest): IActionRequestSearchResult {
    return {
      id,
      createdAt,
      type,
      approved,
      executed,
      requesterUsername: requester.username,
      isApproved: approvedAt !== null,
      Gambler: {
        username: Gambler.username,
        telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      },
    };
  },

  actionRequestDetail({
    id,
    createdAt,
    updatedAt,
    approvedAt,
    type,
    executed,
    approved,
    requesterId,
    approverId,
    requester,
    approver,
    Gambler,
    BalanceChangeId,
    BalanceChange,
    approveRemark,
    requestRemark,
    detail,
    result,
  }: IActionRequest): IActionRequestSearchDetail {
    return {
      id,
      createdAt,
      updatedAt,
      approvedAt,
      type,
      executed,
      approved,
      requesterId,
      approverId,
      approveRemark,
      requestRemark,
      detail,
      result: result ? result : null,
      Gambler: {
        username: Gambler.username,
        telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      },
      requester: this.operatorProfile(requester),
      approver: approver ? this.operatorProfile(approver) : null,
      BalanceChangeId: BalanceChangeId ? BalanceChangeId : null,
      BalanceChange: BalanceChange
        ? this.balanceChangeFilter(BalanceChange)
        : null,
    };
  },

  actionRequestUpdate({
    id,
    createdAt,
    type,
    requester,
    approver,
    Gambler,
    executed,
    approved,
    approveRemark,
    requestRemark,
  }: IActionRequest): IActionRequestUpdateResponse {
    return {
      id,
      createdAt,
      type,
      executed,
      approved,
      requestRemark,
      approveRemark,
      telNoGambler: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      requesterUsername: requester.username,
      approverUsername: approver.username,
    };
  },

  gamblerSensitiveProfile({
    id,
    username,
    telNo,
    telNoStatus,
    type,
    password,
    refCode,
    createdAt,
  }: IGambler): IGamblerInfo {
    return {
      id,
      username,
      password,
      createdAt,
      refCode,
      type,
      telNoStatus,
      telNo: sensitiveInfo(this.telNoMapping(telNo), 4, '*'),
    };
  },

  withdrawRequestSearchResult({
    executed,
    approveStatus,
    reserve,
    tstamp,
    approver,
    reserveOperator,
    afterBalance,
    amount,
    beforeBalance,
    GamblerBankAccount,
    GamblerBankAccountId,
    approverId,
    id,
    reserveOperatorId,
    reserveTstamp,
    status,
    workBankId,
    workImiId,
  }: IWithdrawRequest): IWithdrawRequestSearchResult {
    let reserveIOperator = null;
    if (reserveOperatorId) {
      reserveIOperator = {
        id: reserveOperator.id,
        username: reserveOperator.username,
        telNo: this.telNoMapping(reserveOperator.telNo),
        name: reserveOperator.name,
        role: reserveOperator.role,
        active: reserveOperator.active!,
      };
    }
    let iApprover = null;
    if (approverId) {
      iApprover = {
        id: approver.id,
        username: approver.username,
        telNo: this.telNoMapping(approver.telNo),
        name: approver.name,
        role: approver.role,
        active: approver.active!,
      };
    }
    return {
      id,
      workImiId,
      workBankId,
      reserve,
      reserveOperatorId,
      reserveTstamp,
      approveStatus,
      approverId,
      status,
      GamblerBankAccountId,
      tstamp,
      executed,
      amount,
      beforeBalance,
      afterBalance,
      GamblerBankAccount: {
        id: GamblerBankAccount.id,
        bankCode: GamblerBankAccount.bankCode,
        accountNo: GamblerBankAccount.accountNo,
        accountName: GamblerBankAccount.accountName,
        lockWithdraw: GamblerBankAccount.lockWithdraw,
        active: GamblerBankAccount.active,
        verifyName: GamblerBankAccount.verifyName,
        accountNameRetrieved: GamblerBankAccount.accountNameRetrieved,
      },
      GamblerId: GamblerBankAccount.GamblerId,
      Gambler: {
        id: GamblerBankAccount.Gambler.id,
        username: GamblerBankAccount.Gambler.username,
        telNo: sensitiveInfo(
          this.telNoMapping(GamblerBankAccount.Gambler.telNo),
          4,
          '*',
        ),
        telNoStatus: GamblerBankAccount.Gambler.telNoStatus,
        type: GamblerBankAccount.Gambler.type,
        refCode: GamblerBankAccount.Gambler.refCode,
        createdAt: GamblerBankAccount.Gambler.createdAt,
        lastForgetPass: GamblerBankAccount.Gambler.lastForgetPass,
        lastChangePass: GamblerBankAccount.Gambler.lastChangePass,
        site: GamblerBankAccount.Gambler.site,
      },
      reserveOperator: reserveOperator ? reserveIOperator : null,
      approver: approver ? iApprover : null,
    };
  },

  withdrawRequestDetailResult({
    executed,
    approveStatus,
    reserve,
    tstamp,
    approver,
    reserveOperator,
    afterBalance,
    amount,
    beforeBalance,
    GamblerBankAccount,
    GamblerBankAccountId,
    approverId,
    id,
    reserveOperatorId,
    reserveTstamp,
    status,
    workBankId,
    workImiId,
    detail,
    workBank,
    workImi,
  }: IWithdrawRequest): IWithdrawRequestDetailResult {
    let reserveIOperator = null;
    if (reserveOperatorId) {
      reserveIOperator = {
        id: reserveOperator.id,
        username: reserveOperator.username,
        telNo: this.telNoMapping(reserveOperator.telNo),
        name: reserveOperator.name,
        role: reserveOperator.role,
        active: reserveOperator.active!,
      };
    }
    let iApprover = null;
    if (approverId) {
      iApprover = {
        id: approver.id,
        username: approver.username,
        telNo: this.telNoMapping(approver.telNo),
        name: approver.name,
        role: approver.role,
        active: approver.active!,
      };
    }
    return {
      id,
      workImiId,
      workBankId,
      reserve,
      reserveOperatorId,
      reserveTstamp,
      approveStatus,
      approverId,
      status,
      GamblerBankAccountId,
      tstamp,
      executed,
      amount,
      beforeBalance,
      afterBalance,
      detail,
      workBank,
      workImi,
      GamblerBankAccount: {
        id: GamblerBankAccount.id,
        bankCode: GamblerBankAccount.bankCode,
        accountNo: GamblerBankAccount.accountNo,
        accountName: GamblerBankAccount.accountName,
        lockWithdraw: GamblerBankAccount.lockWithdraw,
        active: GamblerBankAccount.active,
        verifyName: GamblerBankAccount.verifyName,
        accountNameRetrieved: GamblerBankAccount.accountNameRetrieved,
      },
      GamblerId: GamblerBankAccount.GamblerId,
      Gambler: {
        id: GamblerBankAccount.Gambler.id,
        username: GamblerBankAccount.Gambler.username,
        telNo: sensitiveInfo(
          this.telNoMapping(GamblerBankAccount.Gambler.telNo),
          4,
          '*',
        ),
        telNoStatus: GamblerBankAccount.Gambler.telNoStatus,
        type: GamblerBankAccount.Gambler.type,
        refCode: GamblerBankAccount.Gambler.refCode,
        createdAt: GamblerBankAccount.Gambler.createdAt,
        lastForgetPass: GamblerBankAccount.Gambler.lastForgetPass,
        lastChangePass: GamblerBankAccount.Gambler.lastChangePass,
        site: GamblerBankAccount.Gambler.site,
      },
      reserveOperator: reserveOperator ? reserveIOperator : null,
      approver: approver ? iApprover : null,
    };
  },

  commissionSearchResult({
    id,
    dstamp,
    validAmount,
    promotionPaid,
    rate,
    beginDstamp,
    expiredAt,
    accepted,
    acceptedTstamp,
    executed,
    executedTstamp,
    Gambler,
  }: ICommission): ICommissionSearchResult {
    return {
      id,
      dstamp,
      validAmount,
      promotionPaid,
      rate,
      beginDstamp,
      expiredAt,
      accepted,
      acceptedTstamp,
      executed,
      executedTstamp,
      username: Gambler.username,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
    };
  },

  bankMsgDepositList({
    id,
    type,
    tstamp,
    fromBankCode,
    fromAccountNo,
    toBankCode,
    toAccountNo,
    amount,
    remainingAmount,
    executed,
    deletedAt,
    createdAt,
    updatedAt,
    BalanceChange,
    Sms,
    NomineeBankAccount,
    Operator,
  }: IBankMsg): IBankMsgDepositList {
    return {
      id,
      type,
      tstamp,
      fromBankCode,
      fromAccountNo,
      toBankCode,
      toAccountNo,
      amount,
      remainingAmount,
      executed,
      deletedAt,
      createdAt,
      updatedAt,
      BalanceChange: this.balanceChangeFilter(BalanceChange) ?? null,
      Sms: Sms ?? null,
      NomineeBankAccount: NomineeBankAccount ?? null,
      Operator: Operator ?? null,
    };
  },

  balanceChangeProfileUi(data: IBalanceChange): IBalanceChangeUi {
    const tmpDetail: IBalanceChangeDetailUi = {};
    let focusType: TxType = TxType.INIT;
    const bcDetail = data.details as ISmsDetail &
      IBalanceChangeWithdrawDetail &
      IBalanceChangeActionRequestChangeCredit &
      IBalanceChangeWithdrawRequest &
      ICommissionResult;
    if (data.type === TxType.DEPOSIT) {
      focusType = TxType.DEPOSIT;
      if (bcDetail.ActionRequestId) {
        if (bcDetail.sourceAccountNo && bcDetail.sourceBankCode) {
          tmpDetail.action = BalanceChangeUiType.DEPOSIT_MANUAL;
          tmpDetail.fromBank = {
            accountNo: bcDetail.sourceAccountNo!,
            bankCode: bcDetail.sourceBankCode!,
          };
        } else {
          focusType = TxType.TOPUP_CREDIT;
          tmpDetail.action = BalanceChangeUiType.TOPUP_CREDIT;
        }
      } else if (bcDetail.sourceAccountNo && bcDetail.sourceBankCode) {
        tmpDetail.action = BalanceChangeUiType.DEPOSIT_AUTO;
        tmpDetail.fromBank = {
          accountNo: bcDetail.sourceAccountNo!,
          bankCode: bcDetail.sourceBankCode!,
        };
      } else {
        tmpDetail.action = BalanceChangeUiType.DEPOSIT_MANUAL_BANK_MSG;
      }
    } else if (data.type === TxType.WITHDRAW) {
      focusType = TxType.WITHDRAW;
      if (bcDetail.WithdrawRequestId) {
        tmpDetail.action = BalanceChangeUiType.WITHDRAW_MANUAL;
        tmpDetail.toBank = {
          accountNo: bcDetail.destinationAccountNo!,
          bankCode: bcDetail.destinationBankCode!,
        };
      } else if (bcDetail.ActionRequestId) {
        focusType = TxType.REDUCE_CREDIT;
        tmpDetail.action = BalanceChangeUiType.REDUCE_CREDIT;
      } else {
        tmpDetail.action = BalanceChangeUiType.WITHDRAW_AUTO;
        tmpDetail.toBank = {
          accountNo: bcDetail.destinationAccountNo!,
          bankCode: bcDetail.destinationBankCode!,
        };
      }
    } else if (data.type === TxType.PROMOTION) {
      focusType = TxType.PROMOTION;
      tmpDetail.promotionPaid = bcDetail.promotionPaid.toString();
    }
    return {
      id: data.id,
      type: focusType,
      amountBefore: data.amountBefore,
      amount: data.amount,
      amountAfter: data.amountAfter,
      currencyCode: data.currencyCode,
      tstamp: data.tstamp,
      status: data.status,
      details: tmpDetail,
    };
  },

  gamblerBankAccountNameRetrieve({
    id,
    accountNo,
    bankCode,
    accountName,
  }: IGamblerBankAccount): IGamblerBankAccountNameRetrieve {
    return {
      gmBankAccountId: id,
      toAccountNo: accountNo,
      toBankCode: bankCode,
      toAccountName: accountName,
    };
  },

  article({ id, title, content, date, image, tag }: IArticle) {
    return {
      id,
      title,
      content,
      date,
      image,
      tag,
    };
  },
  commissionResult({
    id,
    dstamp,
    validAmount,
    promotionPaid,
    rate,
    beginDstamp,
    expiredAt,
    accepted,
    acceptedTstamp,
  }: ICommission): ICommissionResult {
    const mExpiredAt = momentTH(expiredAt);
    return {
      id,
      dstamp,
      validAmount,
      promotionPaid,
      rate,
      beginDstamp,
      expiredAt,
      accepted,
      acceptedTstamp,
      expired: momentTH().compareTo(mExpiredAt) > 0,
    };
  },

  detailTxReportSearchResult({
    id,
    type,
    executed,
    tstamp,
    txType,
    amount,
    remainingBalance,
    serviceChannel,
    note,
    remark,
    BalanceChange,
    BalanceChangeId,
    Operator,
    OperatorId,
    NomineeBankAccount,
    NomineeBankAccountId,
  }: IDetailTxReport): IDetailTxReportSearchResult {
    return {
      id,
      type,
      executed,
      tstamp,
      txType,
      amount,
      remainingBalance,
      serviceChannel,
      note,
      remark,
      BalanceChange,
      BalanceChangeId,
      OperatorId,
      NomineeBankAccountId,
      NomineeBankAccount: this.nomineeBankAccountSearchResult(
        NomineeBankAccount,
      ),
      Operator: OperatorId ? this.operatorProfile(Operator) : null,
    };
  },

  txDetailSearchResult({
    NomineeBankAccount,
    fromTstamp,
    NomineeBankAccountId,
    toTstamp,
    statementDate,
    completed,
    id,
  }: ITxReport): ITxReportSearchResult {
    return {
      id,
      fromTstamp,
      NomineeBankAccountId,
      toTstamp,
      statementDate,
      completed,
      NomineeBankAccount: this.nomineeBankAccountSearchResult(
        NomineeBankAccount,
      ),
    };
  },

  detailBettingReportBySite(
    {
      id,
      dstamp,
      tstamp,
      turnover,
      validAmount,
      win,
      game,
      vendorCode,
      commission,
    }: IDetailBettingReport,
    providerAccount: ProviderAccount | null,
  ) {
    const vendor = VENDORS[vendorCode] ?? null;

    return {
      id,
      dstamp,
      tstamp,
      turnover,
      validAmount,
      commission,
      win,
      game,
      vendor,
      gameAccount: providerAccount?.username ?? null,
    };
  },

  gamblerReportResult({
    username,
    telNo,
    telNoStatus,
    type,
    refCode,
    createdAt,
    lastForgetPass,
    lastChangePass,
    parent,
    social,
    site,
  }: IGambler): IGamblerReportResult {
    return {
      username,
      createdAt,
      lastChangePass,
      lastForgetPass,
      refCode,
      site,
      social,
      telNo,
      telNoStatus,
      type,
      parentUsername: parent ? parent.username : null,
    };
  },
  gamblerFilterBySite(
    { Gambler, accountName, bankCode, accountNo }: IGamblerBankAccount,
    providerAccount: IProviderAccount | null,
  ): IGamblerSearchBySiteResult {
    return {
      accountName,
      bankCode,
      accountNo,
      GamblerId: Gambler.id,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      refCode: Gambler.refCode,
      username: Gambler.username,
      gameAccount: providerAccount?.username ?? null,
    };
  },
  balanceChangeSearchBySite(
    {
      id,
      Gambler,
      type,
      amountBefore,
      amount,
      amountAfter,
      tstamp,
      status,
    }: IBalanceChange,
    providerAccount: IProviderAccount | null,
  ): IBalanceChangeSearchBySiteResult {
    return {
      id,
      type,
      amountBefore,
      amount,
      amountAfter,
      tstamp,
      status,
      username: Gambler.username,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      site: Gambler.site,
      gameAccount: providerAccount?.username ?? null,
    };
  },
  gamblerBankAccountFilterBySite(
    {
      GamblerId,
      Gambler,
      bankCode,
      accountNo,
      accountName,
      lockWithdraw,
      active,
      verifyName,
      autoDeposit,
      disabledDepositTstamp,
      validateTurnover,
      accountNameRetrieved,
    }: IGamblerBankAccount,
    providerAccount: IProviderAccount | null,
  ): IGamblerBankAccountSearchBySiteResult {
    return {
      GamblerId,
      bankCode,
      accountNo,
      accountName,
      verifyName,
      lockWithdraw,
      active,
      autoDeposit,
      disabledDepositTstamp,
      validateTurnover,
      accountNameRetrieved,
      username: Gambler.username,
      telNo: sensitiveInfo(this.telNoMapping(Gambler.telNo), 4, '*'),
      gameAccount: providerAccount?.username ?? null,
    };
  },
};
