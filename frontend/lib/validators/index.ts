export function validatePinCode(pinCode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pinCode.trim());
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim());
}