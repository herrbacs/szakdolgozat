export enum TokenCategory {
  Basic = "basic",
  Medium = "medium",
  High = "high",
}

export type TokenPurchaseRequest = {
  category: TokenCategory
}

export type TokenPurchaseResponse = {
  new_balance: number
}
