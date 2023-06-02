export function prettyDate(date) {
  let dateModify = date.toString().substr(0, 10);
  let result =
    dateModify.slice(8, 10) +
    "/" +
    dateModify.slice(5, 7) +
    "/" +
    dateModify.slice(0, 4);
  return result;
}

export function shortDate(date) {
  let result = date.toString().slice(0, 10);
  return result;
}

export const accessToken = () => {
  let accessToken = localStorage.getItem("accessToken");
  return accessToken;
};

export const unescape = (string) => {
 string = string.replace(/&quot;/g, "\"");
 string = string.replace(/#39;/g, "'");
 return string;
}
