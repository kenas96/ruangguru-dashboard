export const Regex = {
  REGEX_NUMBER_ONLY: /^[0-9+]*$/,
  REGEX_CURRENCY_ONLY: /\B(?=(\d{3})+(?!\d))/g,
  REGEX_PARSER_CURRENCY: /\$\s?|(,*)/g,
  REGEX_NUMBER_DECIMAL: /^\d+\.?\d*$/,
  REGEX_ALPHABET_ONLY: /[A-Za-z_]/,
  REGEX_CONTAIN_ALPHABET_NUMBER: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
  REGEX_EMAIL: /\S+@\S+\.\S+/
};
