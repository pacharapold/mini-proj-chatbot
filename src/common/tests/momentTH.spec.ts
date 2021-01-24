import { expect } from 'chai';
import 'mocha';
import { momentTH, MomentTH } from '../utils/momentTH';

describe('momentTH', () => {
  it('constructor string', () => {
    expect(momentTH('2020-04-05 00:01:01').dateTimeStr()).equal(
      '2020-04-05 00:01:01',
    );
    expect(momentTH('2020/04/05 00:01:01').dateTimeStr()).equal(
      '2020-04-05 00:01:01',
    );
    expect(momentTH('2020/04/05 00:01').dateTimeStr()).equal(
      '2020-04-05 00:01:00',
    );
    expect(momentTH('2020/04/05 01:02:03.004').fullDateTimeStr()).equal(
      '2020-04-05 01:02:03.004',
    );
    expect(momentTH('2020/04/05 01:02:03:004').fullDateTimeStr()).equal(
      '2020-04-05 01:02:03.004',
    );
  });

  it('constructor date', () => {
    const d = new Date('2020-04-05 00:01:01 GMT+0700');
    expect(momentTH(d).dateTimeStr()).equal('2020-04-05 00:01:01');
  });

  it('constructor number', () => {
    const d = new Date('2020-04-05 00:01:01 GMT+0700');
    expect(momentTH(d.getTime()).dateTimeStr()).equal('2020-04-05 00:01:01');
  });

  it('toDate()', () => {
    const d = new Date('2020-04-05 00:01:01 GMT+0700');
    expect(
      momentTH(d)
        .toDate()
        .getTime(),
    ).equal(d.getTime());
  });

  it('dateStr dateTimeStr fullDateTimeStr', () => {
    const d = new Date('2020-04-05 00:01:02:003 GMT+0700');
    expect(momentTH(d).dateStr()).equal('2020-04-05');
    expect(momentTH(d).dateTimeStr()).equal('2020-04-05 00:01:02');
    expect(momentTH(d).timeStr()).equal('00:01:02');
    expect(momentTH(d).fullTimeStr()).equal('00:01:02.003');
    expect(momentTH(d).fullDateTimeStr()).equal('2020-04-05 00:01:02.003');
  });

  it('dayOfWeek()', () => {
    expect(momentTH('2020-04-06 00:01:02').dayOfWeek()).equal(MomentTH.MONDAY);
    expect(momentTH('2020-04-05 00:01:02').dayOfWeek()).equal(MomentTH.SUNDAY);
    expect(momentTH('2020-04-04 23:59:59').dayOfWeek()).equal(
      MomentTH.SATURDAY,
    );
    expect(momentTH('2020-04-03 23:59:59').dayOfWeek()).equal(MomentTH.FRIDAY);
  });

  it('static ymd', () => {
    expect(MomentTH.ymd(2020, 4, 5).dateTimeStr()).equal('2020-04-05 00:00:00');
  });

  it('static ymdhns', () => {
    expect(MomentTH.ymdhns(2020, 4, 5, 1, 2, 3).dateTimeStr()).equal(
      '2020-04-05 01:02:03',
    );
  });

  it('startOfDay', () => {
    expect(
      momentTH('2020-04-06 10:01:02')
        .startOfDay()
        .dateTimeStr(),
    ).equal('2020-04-06 00:00:00');
    expect(
      momentTH('2020-04-06 02:01:02')
        .startOfDay()
        .dateTimeStr(),
    ).equal('2020-04-06 00:00:00');
  });

  it('startOfMonth', () => {
    expect(
      momentTH('2020-04-06 10:01:02')
        .startOfMonth()
        .dateTimeStr(),
    ).equal('2020-04-01 00:00:00');
    expect(
      momentTH('2020-04-06 02:01:02')
        .startOfMonth()
        .dateTimeStr(),
    ).equal('2020-04-01 00:00:00');
  });

  it('addDay', () => {
    expect(
      momentTH('2020-04-29 10:01:02')
        .addDay(3)
        .dateTimeStr(),
    ).equal('2020-05-02 10:01:02');
    expect(
      momentTH('2020-04-02 10:01:02')
        .addDay(-3)
        .dateTimeStr(),
    ).equal('2020-03-30 10:01:02');
  });

  it('addMinute', () => {
    expect(
      momentTH('2020-03-31 23:59:00')
        .addMinute(1)
        .dateTimeStr(),
    ).equal('2020-04-01 00:00:00');
    expect(
      momentTH('2020-03-01 01:59:01')
        .addMinute(-120)
        .dateTimeStr(),
    ).equal('2020-02-29 23:59:01');
  });

  it('changeTime', () => {
    expect(
      momentTH('2020-03-31 23:59:01')
        .changeTime('17:12')
        .dateTimeStr(),
    ).equal('2020-03-31 17:12:00');
    expect(
      momentTH('2020-03-31 23:59:01')
        .changeTime('17:12:02')
        .dateTimeStr(),
    ).equal('2020-03-31 17:12:02');
  });

  it('year month date hour minute second millisecond', () => {
    expect(momentTH('2020-03-31 23:59:01.123').year()).equal(2020);
    expect(momentTH('2020-03-31 23:59:01.123').month()).equal(3);
    expect(momentTH('2020-03-31 23:59:01.123').date()).equal(31);
    expect(momentTH('2020-03-31 23:59:01.123').hour()).equal(23);
    expect(momentTH('2020-03-31 23:59:01.123').minute()).equal(59);
    expect(momentTH('2020-03-31 23:59:01.123').second()).equal(1);
    expect(momentTH('2020-03-31 23:59:01.123').millisecond()).equal(123);
  });

  it('getTime()', () => {
    expect(momentTH('2020-03-31').getTime()).equal(
      new Date('2020-03-31 GMT+07:00').getTime(),
    );
    expect(momentTH('2020-03-31 23:59:01.123').getTime()).equal(
      new Date('2020-03-31 23:59:01.123 GMT+07:00').getTime(),
    );
  });

  it('isValidDate()', () => {
    expect(MomentTH.isValidDate('2020-3-31')).equal(false); // must be yyyy-mm-dd
    expect(MomentTH.isValidDate('0000-01-01')).equal(false);
    expect(MomentTH.isValidDate('2020-00-01')).equal(false);
    expect(MomentTH.isValidDate('2020-01-00')).equal(false);
    expect(MomentTH.isValidDate('2020-03-32')).equal(false);
    expect(MomentTH.isValidDate('2020-04-31')).equal(false);
    expect(MomentTH.isValidDate('2019-02-29')).equal(false);
    expect(MomentTH.isValidDate('2020.03.31')).equal(false); // only - and / are allowed

    expect(MomentTH.isValidDate('2020-03-31')).equal(true);
    expect(MomentTH.isValidDate('2020/03/31')).equal(true);
    expect(MomentTH.isValidDate('2020-02-29')).equal(true);
  });

  it('isValidTime()', () => {
    expect(MomentTH.isValidTime('24:00')).equal(false); // 0-23
    expect(MomentTH.isValidTime('01:60')).equal(false);
    expect(MomentTH.isValidTime('01:01:60')).equal(false);
    expect(MomentTH.isValidTime('01:01:59:1000')).equal(false);
    expect(MomentTH.isValidTime('01:01:59:40')).equal(false); // XX:XX:XX:XXX
    expect(MomentTH.isValidTime('23.59.59.999')).equal(false); // XX:XX:XX:XXX or XX:XX:XX.XXX

    expect(MomentTH.isValidTime('01:01:59.040')).equal(true);
    expect(MomentTH.isValidTime('01:01:59:040')).equal(true); // XX:XX:XX:XXX
    expect(MomentTH.isValidTime('19:11')).equal(true);
    expect(MomentTH.isValidTime('23:59:59')).equal(true);
    expect(MomentTH.isValidTime('23:59:59:999')).equal(true);
  });

  it('isValidDateTime()', () => {
    expect(MomentTH.isValidDateTime('23:59')).equal(false);
    expect(MomentTH.isValidDateTime('23:59:59:999')).equal(false);
    expect(MomentTH.isValidDateTime('2020-01-01')).equal(false);

    expect(MomentTH.isValidDateTime('2020-01-01 01:02:03:004')).equal(true);
  });

  it('format()', () => {
    const input = '2020-04-05 06:07:08.009';
    expect(momentTH(input).format()).equal('2020-04-05T06:07:08+07:00');
    expect(momentTH(input).format('BBBB/YYYY-BB aa YY')).equal(
      '2563/2020-63 aa 20',
    );
    expect(momentTH(input).format('DOW dow DOWT dowt')).equal(
      'Sunday Sun อาทิตย์ อา.',
    );
    expect(momentTH(input).format('MMMM MMM MMMMT MMMT MM')).equal(
      'April Apr เมษายน เม.ย. 04',
    );
    expect(momentTH(input).format('DD HH nn ss zzz')).equal('05 06 07 08 009');
  });

  it('toMoment()', () => {
    const input = '2020-04-05 06:07:08.009';
    expect(
      momentTH(input)
        .toMoment()
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    ).equal(input);
  });
});
