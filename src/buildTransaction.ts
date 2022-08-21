interface ClosingAccount {
  accountId: string
  amount: number
}

interface RecipientAccount {
  accountId: string
  credit: number
}

type Transfer = [
  ClosingAccount['accountId'],
  RecipientAccount['accountId'] | null,
  number
]

type RebalancingTx = {
  transfers: Array<Transfer>
  operationalFee: number
}

class InsuficientFundsError extends Error {
  constructor() {
    super('not enough funds for rebalance')
    this.name = 'InsuficientFundsError'
  }
}

const FEE = 10

export const newRebalancingTx = (
  closingAccounts: Array<ClosingAccount>,
  recipientAccounts: Array<RecipientAccount>
): RebalancingTx => {
  const amount = closingAccounts.reduce((acc, { amount }) => acc + amount, 0)
  const credit = recipientAccounts.reduce((acc, { credit }) => acc + credit, 0)

  // Fail early
  if (amount < credit + FEE) {
    throw new InsuficientFundsError()
  }

  /**
   * Use descending order with pop and push to always work with the
   * lowest amount, emptying closingAccounts as soon as possible.
   */
  const closings = structuredClone(closingAccounts).sort(
    ({ amount: a }, { amount: b }) => b - a
  )

  const txToRecipients = recipientAccounts.flatMap((rec) => {
    let creditLeft = rec.credit
    const txToRecipient: Array<Transfer> = []

    while (creditLeft > 0) {
      const closing = closings.pop()
      if (!closing) {
        throw new InsuficientFundsError()
      }
      const value = Math.min(creditLeft, closing.amount)
      closing.amount -= value
      creditLeft -= value
      txToRecipient.push([closing.accountId, rec.accountId, value])
      if (closing.amount > 0) {
        closings.push(closing)
      }
    }

    return txToRecipient
  })

  /**
   * Pay the current fee while using the lowest amount on closingAccounts
   * in order to avoid more transactions to the new reserve.
   */
  let recipientFee = txToRecipients.length * FEE
  while (recipientFee > 0) {
    const closing = closings.pop()
    if (!closing) {
      throw new InsuficientFundsError()
    }
    const value = Math.min(recipientFee, closing.amount)
    closing.amount -= value
    recipientFee -= value
    if (closing.amount > 0) {
      closings.push(closing)
    }
  }

  /**
   * Option A)
   * Every remaining closingAccount transfers their amount to the
   * new reserve while substracting its own fee. Any balance lower
   * than the fee will be untransferable and break the rebalancing.
   * Option B)
   * The alternative would be to transfer the sub-fee amounts at a
   * loss, accumulating fees to be substracted on whatever account
   * has enough amount. But even then the last one could have an
   * untransferable amount as well.
   *
   * Without further clarification on the best option, I choose A)
   * because it's easier to implement, and throw an error.
   */
  const txToReserve = closings.map(({ accountId, amount }) => {
    /**
     * Another dilema, using < or <=. Is it useful to have a
     * transaction of 0 value?
     */
    if (amount <= FEE) {
      throw new InsuficientFundsError()
    }
    return [accountId, null, amount - FEE] as Transfer
  })

  const transfers = [...txToRecipients, ...txToReserve]
  return { transfers, operationalFee: transfers.length * FEE }
}

/**
 * We are dealing with money here, not just pizza. Let's have a function
 * to make sure everything's ok with the final rebalance.
 */
export const verifyRebalancingTx = (
  closingAccounts: Array<ClosingAccount>,
  recipientAccounts: Array<RecipientAccount>,
  rebalancingTx: RebalancingTx
) => {
  const amounts: Record<ClosingAccount['accountId'], number> =
    closingAccounts.reduce(
      (acc, { accountId, amount }) => {
        acc[accountId] = amount
        acc['__totalAmount__'] += amount
        return acc
      },
      { __totalAmount__: 0 }
    )

  const credits: Record<RecipientAccount['accountId'], number> =
    recipientAccounts.reduce(
      (acc, { accountId, credit }) => {
        acc[accountId] = credit
        acc['__totalCredit__'] += credit
        return acc
      },
      { __totalCredit__: 0 }
    )

  const transferred = rebalancingTx.transfers.reduce(
    (acc, [closingId, recipientId, value]) => {
      acc.amounts[closingId] -= value
      acc.amounts['__totalAmount__'] -= value
      if (recipientId) {
        acc.credits[recipientId] -= value
        acc.credits['__totalCredit__'] -= value
      }
      return acc
    },
    { amounts, credits }
  )

  const isFeeCorrect =
    rebalancingTx.transfers.length * FEE === rebalancingTx.operationalFee
  const isFeePaid =
    transferred.amounts['__totalAmount__'] === rebalancingTx.operationalFee

  const isAllClosingAccountedFor = Object.values(transferred.amounts).every(
    (value: number) => value >= 0
  )
  const isAllRecipientAccountedFor = Object.values(transferred.credits).every(
    (value: number) => value === 0
  )

  return (
    isFeeCorrect &&
    isFeePaid &&
    isAllClosingAccountedFor &&
    isAllRecipientAccountedFor
  )
}
