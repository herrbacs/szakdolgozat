export type TokenPurchaseRequest = {
  category: "basic" | "medium" | "high"
}

export type TokenPurchaseResponse = {
  new_balance: number
}
