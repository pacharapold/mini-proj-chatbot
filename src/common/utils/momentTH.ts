import moment from 'moment';

export interface MomentTH {
  getTime(): number;
  toMoment(): moment.Moment;

  toDate(): Date;
  dateStr(): string;
  timeStr(): string;
  fullTimeStr(): string;
  dateTimeStr(): string;
  fullDateTimeStr(): string;

  dayOfWeek(): number;
  year(): number;
  month(): number;
  date(): number;
  hour(): number;
  minute(): number;
  second(): number;
  millisecond(): number;

  startOfDay(): MomentTH;
  endOfDay(): MomentTH;
  startOfMonth(): MomentTH;
  addDay(n: number): MomentTH;
  addMinute(n: number): MomentTH;
  addSec(n: number): MomentTH;
  addMSec(n: number): MomentTH;
  changeTime(timeStr: string): MomentTH;
  format(pattern?: string): string;
  diff(m: MomentTH): number;
  compareTo(m: MomentTH): number;
}

export const MomentTH = class implements MomentTH {
  public t: number;

  public static SUNDAY = 0;
  public static MONDAY = 1;
  public static TUESDAY = 2;
  public static WEDNESDAY = 3;
  public static THURSDAY = 4;
  public static FRIDAY = 5;
  public static SATURDAY = 6;
  public static DAY_EN = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(
    ',',
  );
  public static DAY_EN_ABBR = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',');
  public static DAY_TH = 'อาทิตย์,จันทร์,อังคาร,พุธ,พฤหัส,ศุกร์,เสาร์'.split(
    ',',
  );
  public static DAY_TH_ABBR = 'อา.,จ.,อ.,พ.,พฤ.,ศ.,ส.'.split(',');
  public static MONTH_EN = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(
    ',',
  );
  public static MONTH_EN_ABBR = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(
    ',',
  );
  public static MONTH_TH = 'มกราคม,กุมภาพันธ์,มีนาคม,เมษายน,พฤษภาคม,มิถุนายน,กรกฎาคม,สิงหาคม,กันยายน,ตุลาคม,พฤศจิกายน,ธันวาคม'.split(
    ',',
  );
  // tslint:disable-next-line: max-line-length
  public static MONTH_TH_ABBR = 'ม.ค.,ก.พ.,มี.ค.,เม.ย.,พ.ค.,มิ.ย.,ก.ค.,ส.ค.,ก.ย.,ต.ค.,พ.ย.,ธ.ค.'.split(
    ',',
  );

  /**
   * m as 1-12
   */
  public static ymd(y: number, m: number, d: number): MomentTH {
    return momentTH(
      `${y.toString().padStart(4, '0')}-${m
        .toString()
        .padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
    );
  }

  /**
   * 2020-04-20 true
   * 2019-02-29 false
   * 2020-02-29 true
   * 2020/04/20 true
   *
   * yyyy-mm-dd or yyyy/mm/dd
   */
  public static isValidDate(s: string): boolean {
    if (!s || s.length !== 10) return false;
    const tmp = s.split('/').join('-');
    return momentTH(s).dateStr() === tmp;
  }

  /**
   * 15:59:59 true
   * 15:20 true
   * 15:20:59 true
   * 15:20:59 true
   * 15:20:49:293 true
   * 15:20:49.293 true
   */

  public static isValidTime(s: string): boolean {
    if (!s || (s.length !== 5 && s.length !== 8 && s.length !== 12)) {
      return false;
    }
    let tmp = s.length === 5 ? `${s}:00.000` : s.length === 8 ? `${s}.000` : s;
    tmp = `${tmp.substring(0, 8)}.${tmp.substring(9)}`;
    return momentTH(`2020-01-01 ${s}`).fullTimeStr() === tmp;
  }

  /**
   * 15:59:59 true
   * 2020-04-20 true
   * 2019-02-29 false
   * 2020/04/20 15:20 true
   * 2020/04/16 15:20:59 true
   * 2020/04/16 15:20:59.999 true
   */
  public static isValidDateTime(s: string): boolean {
    if (
      !s ||
      (s.length !== 11 + 5 && s.length !== 11 + 8 && s.length !== 11 + 12)
    ) {
      return false;
    }
    return (
      s.charAt(10) === ' ' &&
      this.isValidDate(s.substring(0, 10)) &&
      this.isValidTime(s.substring(11))
    );
  }

  /**
   * m as 1-12
   * h as 0:23
   */
  public static ymdhns(
    y: number,
    m: number,
    d: number,
    h: number,
    n: number,
    s: number,
  ): MomentTH {
    return momentTH(
      `${y.toString().padStart(4, '0')}-${m
        .toString()
        .padStart(2, '0')}-${d
        .toString()
        .padStart(2, '0')} ${h
        .toString()
        .padStart(2, '0')}:${n
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
    );
  }

  public constructor(dt?: Date | string | number) {
    this.t = !dt
      ? new Date().getTime()
      : dt instanceof Date
      ? dt.getTime()
      : typeof dt === 'string'
      ? new Date(`${dt} GMT+0700`).getTime()
      : dt;
  }

  public getTime(): number {
    return this.t;
  }

  public toMoment() {
    return moment(this.getTime());
  }

  public toDate(): Date {
    return new Date(this.t);
  }

  public dateStr(): string {
    const dt = this.toDate();
    return `${dt
      .getFullYear()
      .toString()
      .padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  public timeStr(): string {
    const dt = this.toDate();
    return `${dt
      .getHours()
      .toString()
      .padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${dt
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }

  public fullTimeStr(): string {
    const dt = this.toDate();
    return `${dt
      .getHours()
      .toString()
      .padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${dt
      .getSeconds()
      .toString()
      .padStart(2, '0')}.${dt
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;
  }

  public dateTimeStr(): string {
    const dt = this.toDate();
    return `${dt
      .getFullYear()
      .toString()
      .padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt
      .getDate()
      .toString()
      .padStart(2, '0')} ${dt
      .getHours()
      .toString()
      .padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${dt
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }

  public fullDateTimeStr(): string {
    const dt = this.toDate();
    return `${dt
      .getFullYear()
      .toString()
      .padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt
      .getDate()
      .toString()
      .padStart(2, '0')} ${dt
      .getHours()
      .toString()
      .padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${dt
      .getSeconds()
      .toString()
      .padStart(2, '0')}.${dt
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;
  }

  /**
   * 0 = Sunday
   */
  public dayOfWeek(): number {
    return this.toDate().getDay();
  }

  public year(): number {
    return this.toDate().getFullYear();
  }

  /**
   * month 1-12
   */
  public month(): number {
    return this.toDate().getMonth() + 1;
  }

  public date(): number {
    return this.toDate().getDate();
  }

  public hour(): number {
    return this.toDate().getHours();
  }

  public minute(): number {
    return this.toDate().getMinutes();
  }

  public second(): number {
    return this.toDate().getSeconds();
  }

  public millisecond(): number {
    return this.toDate().getMilliseconds();
  }

  public startOfDay(): MomentTH {
    return momentTH(this.dateStr());
  }

  public endOfDay(): MomentTH {
    return momentTH(`${this.dateStr()} 23:59:59:999`);
  }

  public startOfMonth(): MomentTH {
    return MomentTH.ymd(this.year(), this.month(), 1);
  }

  public addDay(n: number): MomentTH {
    return momentTH(this.t + n * 1000 * 60 * 60 * 24);
  }

  public addMinute(n: number): MomentTH {
    return momentTH(this.t + n * 1000 * 60);
  }

  public addSec(n: number): MomentTH {
    return momentTH(this.t + n * 1000);
  }

  public addMSec(n: number): MomentTH {
    return momentTH(this.t + n);
  }

  /**
   *
   * @param timeStr 14:59 14:59:59 14:59:59:999
   */
  public changeTime(timeStr: string): MomentTH {
    if (timeStr.length !== 12 && timeStr.length !== 8 && timeStr.length !== 5) {
      throw new Error('timeStr should be hh:nn or hh:nn:ss or hh:nn:ss:SSS');
    }
    const s = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    return momentTH(`${this.dateStr()} ${s}`);
  }

  /**
   * YYYY-MM-DD
   * DOWT DOW dowt dow => day of week
   * MMMMT MMMM MMMT MMM => month name
   * HH:nn:ss.zzz time part
   */
  public format(pattern?: string): string {
    if (!pattern) {
      return `${this.dateStr()}T${this.timeStr()}+07:00`;
    }
    return pattern
      .replace('BBBB', (this.year() + 543).toString().padStart(4, '0'))
      .replace(
        'BB',
        (this.year() + 543)
          .toString()
          .padStart(4, '0')
          .substring(2),
      )
      .replace(
        'YYYY',
        this.year()
          .toString()
          .padStart(4, '0'),
      )
      .replace(
        'YY',
        this.year()
          .toString()
          .padStart(4, '0')
          .substring(2),
      )
      .replace('DOWT', MomentTH.DAY_TH[this.dayOfWeek()])
      .replace('dowt', MomentTH.DAY_TH_ABBR[this.dayOfWeek()])
      .replace('DOW', MomentTH.DAY_EN[this.dayOfWeek()])
      .replace('dow', MomentTH.DAY_EN_ABBR[this.dayOfWeek()])
      .replace('MMMMT', MomentTH.MONTH_TH[this.month() - 1])
      .replace('MMMT', MomentTH.MONTH_TH_ABBR[this.month() - 1])
      .replace('MMMM', MomentTH.MONTH_EN[this.month() - 1])
      .replace('MMM', MomentTH.MONTH_EN_ABBR[this.month() - 1])
      .replace(
        'MM',
        this.month()
          .toString()
          .padStart(2, '0'),
      )
      .replace(
        'DD',
        this.date()
          .toString()
          .padStart(2, '0'),
      )
      .replace(
        'HH',
        this.hour()
          .toString()
          .padStart(2, '0'),
      )
      .replace(
        'nn',
        this.minute()
          .toString()
          .padStart(2, '0'),
      )
      .replace(
        'ss',
        this.second()
          .toString()
          .padStart(2, '0'),
      )
      .replace(
        'zzz',
        this.millisecond()
          .toString()
          .padStart(3, '0'),
      );
  }

  /**
   * diff of the time of m
   * this.t - m.t  // diff in millionseconds.
   *
   */
  public diff(m: MomentTH): number {
    return this.t - m.getTime();
  }

  public compareTo(m: MomentTH): number {
    return this.t > m.getTime() ? 1 : this.t < m.getTime() ? -1 : 0;
  }
};

export const momentTH = (dt?: Date | string | number): MomentTH => {
  return new MomentTH(dt);
};
