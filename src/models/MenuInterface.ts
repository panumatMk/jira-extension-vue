export interface Menu {
  label?: string,
  icon?: string,
  command?: () => void,
  separator?: boolean,
  to?: string
}
