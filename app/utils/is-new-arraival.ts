/**
 * 新商品
 * @param date
 * @param daysOld
 * @returns
 */
export function isNewArrival(date: string, daysOld = 30) {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  )
}
