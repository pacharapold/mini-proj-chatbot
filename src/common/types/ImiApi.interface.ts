import BigNumber from 'bignumber.js';

export interface IImiApi {
  register(req: RegisterRequest): Promise<RegisterResponse>;
  login(req: LoginRequest): Promise<LoginResponse>;
  deposit(req: DepositRequest): Promise<DepositResponse>;
  withdraw(req: WithdrawRequest): Promise<WithdrawResponse>;
  getTransferLog(req: TransferLogRequest): Promise<TransferLogResponse>;
  getPlayerBalance(req: PlayerBalanceRequest): Promise<PlayerBalanceResponse>;
  changePassword(req: ChangePasswordRequest): Promise<ChangePasswordResponse>;
  getTicketDetail(req: TicketDetailRequest): Promise<TicketDetailResponse>;
  logout(req: LogoutRequest): Promise<LogoutResponse>;
  openGame(req: OpenGameRequest): Promise<OpenGameResponse>;
  getGameList(): Promise<GameListResponse>;
  suspendPlayer(req: SuspendPlayerRequest): Promise<SuspendPlayerResponse>;
  getCurrentCredit(req: CurrentCreditRequest): Promise<CurrentCreditResponse>;
  getOutstandingTicketDetail(
    req: OutstandingTicketRequest,
  ): Promise<TicketDetailResponse>;
  xRegister(req: RegisterRequest): Promise<RegisterResponse>;
}

export type RegisterRequest = {
  Username: string;
  Agentname: string;
  Fullname: string;
  Password: string;
  Currency: string;
  Dob: string;
  Gender: number;
  Email: string;
  Mobile: string;
  Ip: string;
  TimeStamp: number;
  Sign: string;
};

export type RegisterResponse = {
  Result: null | {
    Id: number;
    Username: string;
    Password: string | null;
    UtcLastLoginTime: string;
    LastLoginIP: string;
    AccountType: string;
    Lang: string;
    TimeZone: string;
    Currency: string;
    Suspended: boolean;
    Actived: boolean;
    Role: number;
    UtcCreatedTime: string;
    Balance: number;
    MultiCurrency: boolean;
    FullName: string;
    Remark: string | null;
    CashMode: boolean;
  };
  TargetUrl: string | null;
  Success: boolean;

  // dont know the actual format of Error
  Error: any | null;

  Message: string | null;
};

export type LoginRequest = {
  Username: string;
  Partner: string;
  TimeStamp: number;
  Sign: string;
  Domain: string;
  Lang: string;
  IsMobile: boolean;
};

export type LoginResponse = {
  Error: number;
  Message: string;
  Sign: string;
  TimeStamp: number;
  UTC: string | null;
  Token: string;
  RedirectUrl: string;
};

export type DepositRequest = {
  AgentName: string;
  PlayerName: string;
  Amount: number;
  TimeStamp: number;
  Sign: string;
  TransactionId?: string | null;
};

type CommonReponse = {
  Success: boolean;

  // dont know the actual format of Error
  Error: any | null;

  Message: string | null;
};

export type DepositResponse = CommonReponse;

export type WithdrawRequest = DepositRequest;
export type WithdrawResponse = DepositResponse;

export type ChangePasswordRequest = {
  Playername: string;
  Partner: string;
  Newpassword: string;
  TimeStamp: number;
  Sign: string;
};

export type ChangePasswordResponse = {
  Status: boolean;
};

export type TransferLogRequest = {
  AgentName: string;
  PlayerName: string;
  From: string;
  To: string;
  TransferType: number;
  PageSize: number;
  PageIndex: number;
  TimeStamp: number;
  sign: string;
};

export type TransferLogRec = {
  FromUsername: string;
  ToUsername: string;
  CreatedBy: string;
  Amount: number;
  LatestAmount: number;
  CreationTime: string;
  StatementDate: string;
};

export type TransferLogResponse = {
  Result: null | {
    Records: TransferLogRec[];
    Total: number;
    PageIndex: number;
    PageSize: number;
  };
  Success: boolean;

  // dont know the actual format of Error
  Error: any | null;

  Message: string | null;
};

export type TicketDetailRequest = {
  StartTime: string;
  EndTime: string;
  PlayerName: string;
  Partner: string;
  TimeStamp: number;
  sign: string;
  PageSize: number;
  PageIndex: number;
};

export type OutstandingTicketRequest = {
  Partner: string;
  TimeStamp: number;
  sign: string;
  PageSize: number;
  PageIndex: number;
};

export type TicketDetailRec = {
  ID: number;
  Vendor: number;
  Product: number;
  TicketSessionID: string;
  RawTicketID: number;
  TicketID: string;
  MemberName: string;
  VendorPlayerName: string;
  GameType: string;
  RoundID: string;
  Stake: number;
  StakeMoney: number;
  WinLoss: number;
  Result: string;
  Currency: string;
  VendorTicketDateUTC: string;
  StatementDate: string;
  PlayerID: number;
  PlayerWinLoss: number;
  PlayerCommission: number;
  PlayerCommissionAmount: number;
  AgentID: number;
  AgentWinLoss: number;
  AgentCommission: number;
  AgentCommissionAmount: number;
  MasterAgentID: number;
  MasterAgentWinLoss: number;
  MasterAgentCommission: number;
  MasterAgentCommissionAmount: number;
  SeniorID: number;
  SeniorWinLoss: number;
  SeniorCommission: number;
  SeniorCommissionAmount: number;
  SuperSeniorID: number;
  SuperSeniorWinLoss: number;
  SuperSeniorCommission: number;
  SuperSeniorCommissionAmount: number;
  AdminID: number;
  AdminWinLoss: number;
  AdminCommission: number;
  AdminCommissionAmount: number;
  CompanyID: number;
  CompanyWinLoss: number;
  CompanyCommission: number;
  CompanyCommissionAmount: number;
  Error: number;
  Remark: string;
  MemberID: number;
  MemberRole: number;
  IsRaw: number;
  Ip: string;
  Metadata: string;
  TicketType: number;
  AgentPositionTaking: number;
  MasterAgentPositionTaking: number;
  SeniorPositionTaking: number;
  SuperSeniorPositionTaking: number;
  AdminPositionTaking: number;
  CompanyPositionTaking: number;
  ValidAmount: number;
  AgentValidAmount: number;
  MasterAgentValidAmount: number;
  SeniorValidAmount: number;
  SuperSeniorValidAmount: number;
  AdminValidAmount: number;
  CompanyValidAmount: number;
  Type: number;
};

export type TicketDetailResponse = {
  Result: {
    Tickets: TicketDetailRec[];
  };
  TargetUrl: string | null;
  Success: boolean;
  Error: { Code: number; Message: string };
  Message: string;
};

export type PlayerBalanceRequest = {
  AgentName: string;
  PlayerName: string;
  TimeStamp: number;
  sign: string;
};

export type PlayerBalanceResponse = {
  Error: number;
  Message: string;
  Sign: string;
  TimeStamp: number;
  UTC: string;
  Balance: number | null;
};

export type LogoutRequest = {
  Partner: string;
  TimeStamp: number;
  Sign: string;
  Token: string;
};

export type LogoutResponse = {
  ErrorCode: number;
  ErrorMessage: string;
};

export type CurrentCreditRequest = {
  AgentName: string;
  TimeStamp: number;
  sign: string;
};

export type CurrentCreditResponse = {
  Error: number;
  Message: string;
  Sign: string;
  TimeStamp: number;
  UTC: string;
  Credit: number;
};

export type SuspendPlayerRequest = {
  Partner: string;
  TimeStamp: number;
  Sign: string;
  PlayerName: string;
  Status: number;
};

export type SuspendPlayerResponse = CommonReponse;

export type GameListRec = {
  GameType: string;
  GameCode: string;
  GameName: string;
  SupportedPlatForms: string;
  Specials: string;
  Technology: any | null;
  Order: number;
  DefaultWidth: number;
  DefaultHeight: number;
  Image1: string;
};

export type GameListResponse = {
  Result: GameListRec[];
  TargetUrl: string | null;
  Success: boolean;
  Error: any | null;
  Message: string | null;
};

export type OpenGameRequest = {
  Vendor: string;
  Lang: string;
  GameCode: string;
  Browser: string;
};

export type OpenGameResponse = {
  Error: any | null;
  Message: string | null;
  Success: boolean;
  Result: {
    Data: string;
    Settings: any;
  };
  TargetUrl: string | null;
};

export type imiConfig = {
  transferUrl: string;
  authUrl: string;
  ticketUrl: string;
  playUrl: string;
  gameListUrl: string;
  apiKey: string;
};

export type checkTransactionStatusResponse = {
  Error: number;
  Message: string | null;
  PlayerName: string;
  TransactionId: string;
  Success: boolean;
};

export type checkTransactionStatusRequest = {
  AgentName: string;
  PlayerName: string;
  TimeStamp: number;
  Sign: string;
  TransactionId: string;
};

export type fetchTicketRequest = {
  StartTime: string; // (UTC time)
  EndTime: string; // (UTC time, within 30seconds)
  Partner: string;
  TimeStamp: number;
  sign: string;
};

export type fetchTicketResponse = TicketDetailResponse;

export interface IWinLoseResponse {
  Result: IWinLoseResult;
  Success: boolean;
  Error: number | null;
  Message: string | null;
}

export interface IWinLoseResult {
  Total: number;
  Records: IWinLoseRecord[];
  Summary: IWinLoseSummary;
}

export interface IWinLoseRecord {
  Details: IWinLoseDetail[];
  PlayerId: number;
  MemberId: number;
  UserName: string;
  FullName: string;
  TurnOver: BigNumber;
  GrossComm: BigNumber;
  Company: BigNumber;
  Role: number;
  Loyalty: BigNumber;
}

export interface IWinLoseDetail {
  Role: number;
  Win: BigNumber;
  Comm: BigNumber;
  ValidAmount: BigNumber;
  Loyalty: BigNumber;
  Total: BigNumber;
}

export interface IWinLoseSummary {
  Details: Record<string, IWinLoseDetail>;
  Win: BigNumber;
  Comm: BigNumber;
  TurnOver: BigNumber;
  GrossComm: BigNumber;
  PayOut: BigNumber;
  Company: BigNumber;
  ValidAmount: BigNumber;
  Loyalty: BigNumber;
}

export interface IWinLoseRequest {
  AgentCurrency: boolean;
  Currency: string;
  StartTime: string;
  EndTime: string;
  MemberId: number;
  PageIndex: number;
  PageSize: number;
  PlayerId: number;
  PlayerName: string;
  Products: number[];
}
