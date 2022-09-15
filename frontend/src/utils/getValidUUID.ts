export default function getValidUUID (str: string | undefined) {
  if (str === undefined) { return false };
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  const valid_uuid = regexExp.test(str);
  return valid_uuid;
};