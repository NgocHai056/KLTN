import * as moment from 'moment-timezone';

export class UtilsDate {
  static formatDateTimeVNToString(date: Date): string {
    return moment.utc(date).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY h:mm");
  }

  static formatDateVNToString(date: Date): string {
    return moment.utc(date).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY");
  }

  static formatDateInsertDatabase(date: string): string {
    if (date == null || date == "") {
      return "";
    } else {
      return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
  }

  static formatStringDateToDate(date: string): Date {
    return new Date(this.formatDateInsertDatabase(date));
  }
}
