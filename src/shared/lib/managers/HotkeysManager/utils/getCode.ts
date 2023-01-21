export const getCode = (code: string): string =>
  code
    .toLowerCase()
    .replace(/(^(digit|key|arrow))|(([^w])(left|right)$)/, '$4')
    .replace(
      /numpad(.?)/,
      (_, key: string) => `num${key.charAt(0).toUpperCase() + key.slice(1)}`
    );
