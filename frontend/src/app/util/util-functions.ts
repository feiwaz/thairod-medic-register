export function maskId(nationalId: number | string): string {
  return (nationalId + '').replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")
}

export function partialMaskId(nationalId: number | string): string {
  let finalValue = '';
  if (nationalId) {
    const inputValue = (nationalId + '').trim().split('-').join('');
    finalValue = inputValue;
    if (inputValue.length < 5) {
      finalValue = inputValue.replace(/(\d{1})/, "$1-")
    } else if (inputValue.length < 10) {
      finalValue = inputValue.replace(/(\d{1})(\d{4})/, "$1-$2-")
    } else if (inputValue.length < 12) {
      finalValue = inputValue.replace(/(\d{1})(\d{4})(\d{5})/, "$1-$2-$3-")
    } else if (inputValue.length < 13) {
      finalValue = inputValue.replace(/(\d{1})(\d{4})(\d{5})(\d{2})/, "$1-$2-$3-$4-")
    } else {
      finalValue = inputValue.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")
    }
  }
  return finalValue;
}

export function numbersOnly(event: any) {
  const input = String.fromCharCode(event.keyCode);
  if (!/^[0-9]*$/.test(input)) {
    event.preventDefault();
  }
}