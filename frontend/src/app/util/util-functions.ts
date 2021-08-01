export function maskId(id: number | string): string {
  return (id + '').replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")
}

export function partialMaskId(id: number | string): string {
  let finalValue = '';
  if (id) {
    const inputValue = (id + '').trim().split('-').join('');
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