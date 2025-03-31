import dayjs from "dayjs";

export function convertExpiration2Text(expiration: number | undefined): string {
  if (expiration === undefined) {
    return ""
  }
  const today = dayjs().endOf("day").valueOf()
  const diff = expiration - today
  if (diff === 0) {
    return "今天"
  }
  if (diff === 60 * 60 * 24) {
    return "明天"
  }
  if (diff === -60 * 60 * 24) {
    return "昨天"
  }
  return dayjs(expiration).format("YYYY-MM-DD")
}