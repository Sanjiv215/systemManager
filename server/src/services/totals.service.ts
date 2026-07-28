export type AmountItem = {
  quantity: number
  unitPrice: number
  gstRate?: number
  discount?: number
}

export function calculateLine(item: AmountItem) {
  const base = item.quantity * item.unitPrice
  const discount = item.discount || 0
  const taxable = Math.max(base - discount, 0)
  const gstAmount = taxable * ((item.gstRate ?? 18) / 100)
  return {
    subtotal: base,
    discount,
    gstAmount,
    total: taxable + gstAmount,
  }
}

export function calculateDocument(items: AmountItem[]) {
  return items.reduce(
    (acc, item) => {
      const line = calculateLine(item)
      acc.subtotal += line.subtotal
      acc.discountAmount += line.discount
      acc.gstAmount += line.gstAmount
      acc.total += line.total
      return acc
    },
    { subtotal: 0, discountAmount: 0, gstAmount: 0, total: 0 },
  )
}
