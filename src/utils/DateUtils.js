import moment from "moment";
import "moment/min/locales.min";

export function convertDateToEpoch(value) {
  const epoch = moment(value).valueOf();
  return epoch;
}
export function unixFormatDateTime(value) {
  const date = moment(value).format("MMMM DD, YYYY HH:mm");
  return date;
}
export function unixFormatDate(value) {
  const date = moment(value).format("MMMM DD, YYYY");
  return date;
}

export function unixFormatDateShort(value) {
  const date = moment(value).format("MMM DD, YYYY");
  return date;
}

export function unixFormatDateTimeStripe(value) {
  const date = moment(value).format("YYYY-MM-DD HH:mm:ss");
  return date;
}

export function unixFormatDateStripe(value) {
  const date = moment(value).format("DD-MMM-YYYY");
  return date;
}
export function unixTimeFormat(value) {
  const time = moment(value).format("HH:mm:ss");
  return time;
}
