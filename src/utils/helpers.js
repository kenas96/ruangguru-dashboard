export function currencyFormatter(value) {
  return `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function currencyParser(value) {
  return value.replace(/\Rp\s?|(,*)/g, '');
}

export function percentageFormatter(value) {
  return `${value}%`;
}

export function percentageParser(value) {
  return value.replace('%', '');
}

export function pcsFormatter(value) {
  return `${value}pcs`;
}

export function pcsParser(value) {
  value.replace('pcs', '');
}
