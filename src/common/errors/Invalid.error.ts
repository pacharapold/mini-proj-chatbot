export enum EC {
  // COMMON
  INTERNAL_SERVER_ERROR,
  UNKNOWN_ERROR,
  MISSING_FIELD,
  UNKNOWN_FIELD,
  WRONG_DATE_FORMAT,
  WRONG_TIME_FORMAT,
  NEED_LOGIN,
  NEED_OTHER_ROLE,
  SESSION_EXPIRED,
  INVALID_REQUEST,
  START_DATE_MUST_BEFORE_END_DATE,
  START_TIME_MUST_BEFORE_END_TIME,
  NUMBER_ONLY,
  QUEUE_SERVICE_ERROR,
  // GAMBLER
  INVALID_TEL_NO,
  INVALID_PASSWORD,
  TEL_NO_ALREADY_EXIST,
  BANK_ACCOUNT_ALREADY_EXIST,
  ACCOUNT_NO_HAS_WRONG_LENGTH,
  INCORRECT_TEL_NO_OR_PASSWORD,
  REGISTER_OUT_OF_TIME,
  GAMBLER_DOES_NOT_EXIST,
  FORGET_PASSWORD_HAVE_TO_WAIT_MORE,
  CHANGE_PASSWORD_HAVE_TO_WAIT_MORE,
  CANNOT_REUSE_AN_OLD_PASSWORD,
  // ADMIN
  ADMIN_DOES_NOT_EXIST,
  INCORRECT_PASSWORD,
  OPERATOR_DOES_NOT_EXIST,
  OPERATOR_ALREADY_EXIST,
  // OTP
  OTP_REQUEST_HAVE_TO_WAIT_MORE,
  OTP_REQUEST_DOES_NOT_EXIST,
  OTP_REQUEST_WAS_EXPIRED,
  // PUPPETEER CHANNEL
  PUPPETEER_CHANNEL_DOES_NOT_EXIST,
  PUPPETEER_CHANNEL_ALREADY_EXIST,
  PUPPETEER_CHANNEL_ALREADY_ACTIVE,
  PUPPETEER_CHANNEL_ALREADY_INACTIVE,
  PUPPETEER_CHANNEL_NOT_MATCHED,
  CHANNEL_TYPE_DOES_NOT_EXIST,
  OTHER_OWNER_ACTIVE_SAME_IP_ADDRESS,
  // BANK
  BANK_DOES_NOT_EXIST,
  // NOMINEE
  NOMINEE_ALREADY_EXIST,
  NOMINEE_DOES_NOT_EXIST,
  // NOMINEE_BANK_ACCOUNT
  NOMINEE_BANK_ACCOUNT_ALREADY_ACTIVE,
  NOMINEE_BANK_ACCOUNT_ALREADY_INACTIVE,
  NOMINEE_BANK_ACCOUNT_ALREADY_EXIST,
  NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST,
  NOMINEE_BANK_ACCOUNT_SHOULD_ACTIVATE_AT_LEAST_1,
  INTERNET_BANKING_CANNOT_BE_NULL_FOR_THIS_TYPE,
  NOMINEE_BANK_ACCOUNT_FOR_WITHDRAW_DOES_NOT_EXIST,
  NOMINEE_BANK_ACCOUNT_ALREADY_AUTO,
  NOMINEE_BANK_ACCOUNT_ALREADY_NOT_AUTO,
  NOMINEE_BANK_ACCOUNT_MUST_BE_ACTIVE,
  // ACCOUNT TYPE
  ACCOUNT_TYPE_DOES_NOT_EXIST,
  // GAMBLER BANK ACCOUNT
  GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST,
  GAMBLER_BANK_ACCOUNT_INACTIVE,
  GAMBLER_BANK_ACCOUNT_LOCK_WITHDRAW,
  GAMBLER_BANK_ACCOUNT_ALREADY_RETRIEVED_NAME,
  GAMBLER_BANK_ACCOUNT_VERIFY_NAME_DOES_NOT_EXIST,
  GAMBLER_BANK_ACCOUNT_NOT_VERIFY_YET,
  GAMBLER_BANK_ACCOUNT_ALREADY_AUTO_DEPOSIT,
  GAMBLER_BANK_ACCOUNT_ALREADY_NOT_AUTO_DEPOSIT,
  GAMBLER_BANK_ACCOUNT_ALREADY_VALIDATE_TURNOVER,
  GAMBLER_BANK_ACCOUNT_ALREADY_NOT_VALIDATE_TURNOVER,
  // SMS DEVICE
  KEY_ALREADY_EXIST,
  // CONFIG
  CONFIG_DOES_NOT_EXIST,
  // UI_VERSION
  UI_TYPE_DOES_NOT_EXIST,
  // BALANCE
  BALANCE_DOES_NOT_EXIST,
  // PROVIDER_ACCOUNT
  GAMBLER_ALREADY_ASSIGN_PROVIDER_ACCOUNT,
  PROVIDER_ACCOUNT_NOT_EMPTY,
  PROVIDER_ACCOUNT_DOES_NOT_EXIST,
  // WITHDRAW REQUEST
  MINIMUM_WITHDRAW_AMOUNT,
  MAXIMUM_WITHDRAW_COUNT,
  NOT_ENOUGH_BALANCE,
  STILL_INCOMPLETE_WORK_WITHDRAW,
  WITHDRAW_REQUEST_DOES_NOT_EXIST,
  WITHDRAW_REQUEST_CANNOT_CANCEL_OTHER_RESERVE,
  WITHDRAW_REQUEST_ALREADY_RESERVED,
  WITHDRAW_REQUEST_NOT_RESERVE_YET,
  WITHDRAW_REQUEST_ALREADY_APPROVED,
  WITHDRAW_REQUEST_CANNOT_APPROVED_BY_OTHER,
  WITHDRAW_REQUEST_NOT_CHECKING_YET,
  WITHDRAW_REQUEST_ALREADY_EXECUTED,
  WITHDRAW_REQUEST_ACTION_DOES_NOT_EXIST,
  WITHDRAW_REQUEST_WRONG_APPROVE_STATUS,
  WITHDRAW_REQUEST_CANNOT_RETRY_WITH_NOT_AUTO_WITHDRAW,
  WITHDRAW_REQUEST_CANNOT_RETRY_WITH_NOT_FAIL_STATUS,
  WITHDRAW_REQUEST_WRONG_STATUS,
  WITHDRAW_REQUEST_ALREADY_CREATE_ACTION_REQUEST,
  // BALANCE CHANGE
  BALANCE_CHANGE_DOES_NOT_EXIST,
  // ARTICLE
  ARTICLE_DOES_NOT_EXIST,
  PROMOTION_ARTICLE_DOES_NOT_EXIST,
  PROMOTION_ARTICLE_MUST_HAVE_PROMOTION_TAG,
  // WORK
  WORK_ALREADY_COMPLETED,
  NOT_OWN_THIS_WORK,
  WORK_DOES_NOT_EXIST,
  // SMS
  SMS_REFERENCE_WRONG_LENGTH,
  SMS_NO_CURRENTLY_MESSAGE,
  SMS_DOES_NOT_EXIST,
  // Action Request
  SLIP_IMAGE_REQUIRE,
  BANK_MSG_DOES_NOT_EXIST,
  TITLE_REQUIRE,
  EXPLAIN_REQUIRE,
  ACTION_REQUEST_DOES_NOT_EXIST,
  ACTION_REQUEST_ALREADY_APPROVED,
  ACTION_REQUEST_CANNOT_APPROVE_BY_SAME_REQUESTER,
  // GAMBLER NEW
  REFERENCE_DOES_NOT_EXIST,
  AMOUNT_MISMATCH,
  GAMBLER_BANK_ACCOUNT_MISMATCH,
  ACTION_REQUEST_NOT_APPROVE,
  // GAMBLER NEW 19/08/20
  REGISTER_CHANNEL_DOES_NOT_EXIST,
  GAMBLER_CANNOT_DEPOSIT_TO_OTHER_NOMINEE_BANK_ACCOUNT,
  // DEPOSIT
  MINIMUM_DEPOSIT_AMOUNT,
  NOMINEE_BANK_ACCOUNT_BALANCE_ALREADY_UPDATE,
  GAMBLER_BANK_ACCOUNT_DISABLE_AUTO_DEPOSIT,
  NOMINEE_BANK_ACCOUNT_DISABLE_AUTO_DEPOSIT,
  MAXIMUM_WITHDRAW_AMOUNT_PER_TIME,
  MAXIMUM_WITHDRAW_AMOUNT_PER_DAY,
  // BANK MSG
  BANK_MSG_DOESNT_HAVE_AMOUNT,
  // COMMISSION
  COMMISSION_DOES_NOT_EXIST,
  COMMISSION_ALREADY_ACCEPTED,
  COMMISSION_WAS_EXPIRED,
  TURN_OVER_NOT_UP_TO_TARGET,
  // Q&A
  QUESTION_DOES_NOT_EXIST,
  // USER GUIDE
  USER_GUIDE_DOES_NOT_EXIST,
  // SITE CONFIG
  SITE_DOES_NOT_EXIST,
  SITE_ALREADY_EXIST,
  SITE_CANNOT_DELETE,
  NOMINEE_BANK_ACCOUNT_NOT_FOR_DEPOSIT,
  NOMINEE_BANK_ACCOUNT_MISMATCH_SEQUENCE,
  GAMBLER_BANK_ACCOUNT_ALREADY_UPDATE,
  GAMBLER_BANK_ACCOUNT_ALREADY_ACCOUNT_NAME_RETRIEVED,
  GAMBLER_BANK_ACCOUNT_ALREADY_NOT_ACCOUNT_NAME_RETRIEVED,
  TX_REPORT_DOES_NOT_EXIST,
  // AGENT REPORT
  AGENT_USERNAME_DOES_NOT_EXIST,
  IMI_AGENT_REPORT_SERVICE_ERROR,
  IMIWIN_SYSTEM_MAINTENANCE,
  DETAIL_TX_REPORT_DOES_NOT_EXIST,
  DETAIL_TX_NEED_SOME_INFO_TO_UPDATE,
  DETAIL_TX_REPORT_ALREADY_MAPPING_BALANCE_CHANGE_ID,
  TX_REPORT_CANNOT_GET_REPORT_FROM_VERIFY_TYPE,
  TX_REPORT_CANNOT_CREATE_DATE_AFTER_TODAY,
  STILL_WORKING_REFRESH_BALANCE,
  TARGET_NOT_EXIST,
}

export enum HS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  REQUEST_TOO_LONG = 413,
  REQUEST_URI_TOO_LONG = 414,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,

  MOVED_PERMANENTLY = 301,
  PERMANENT_REDIRECT = 308,
}

export interface Invalid extends Error {
  errorCode: string;
  httpStatus: HS;
  details?: any;
}

export const Invalid = class extends Error implements Invalid {
  public errorCode: string;
  public httpStatus: HS;
  public details?: any;

  constructor(
    errorCode: EC,
    httpStatus: HS = HS.INTERNAL_SERVER_ERROR,
    details?: any,
  ) {
    if (typeof errorCode === 'string') {
      super(errorCode);
      this.errorCode = errorCode;
    } else {
      super(EC[errorCode]);
      this.errorCode = EC[errorCode];
    }
    this.httpStatus = httpStatus;
    this.details = details;
  }

  static create(errorCode: EC, httpStatus: HS, details?: any) {
    return new Invalid(errorCode, httpStatus, details);
  }

  static internalError(errorCode: EC, details?: any) {
    return new Invalid(errorCode, HS.INTERNAL_SERVER_ERROR, details);
  }

  static unAuthorized(errorCode: EC, details?: any) {
    return new Invalid(errorCode, HS.UNAUTHORIZED, details);
  }

  static badRequest(errorCode: EC, details?: any): Invalid {
    return new Invalid(errorCode, HS.BAD_REQUEST, details);
  }
};
