export const maskId = (nationalId: number | string): string => {
  return (nationalId + '').replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")
}