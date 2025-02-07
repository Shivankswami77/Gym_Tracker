export const SetLocalStorage = (key: string, value: any) =>
  localStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value)
  );
export const GetLocalStorage = (key: string, parse = false): string | null => {
  let val = localStorage.getItem(key);
  if (parse && val !== null) {
    try {
      val = JSON.parse(val);
    } catch (e) {
      console.log(e);
    }
  }
  return val;
};
