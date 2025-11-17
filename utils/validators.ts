export function isEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v);
}
