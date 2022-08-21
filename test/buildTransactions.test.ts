import { describe, expect, test, assert } from 'vitest'
import { newRebalancingTx, verifyRebalancingTx } from '../src/buildTransaction'

describe('Building a transaction', () => {
  const errorMsg = 'not enough funds for rebalance'

  // Just get the types here so it's easier to write later
  let closing: Parameters<typeof newRebalancingTx>[0] = []
  let recipient: Parameters<typeof newRebalancingTx>[1] = []
  let expected: ReturnType<typeof newRebalancingTx> = {
    transfers: [],
    operationalFee: 0,
  }

  test('No funds for the fee', () => {
    closing = [{ accountId: 'acc1', amount: 500 }]

    recipient = [{ accountId: 'rec1', credit: 500 }]

    expect(() => newRebalancingTx(closing, recipient)).toThrowError(errorMsg)
  })

  test('Expect to fail due to sub-fee reminders', () => {
    closing = [{ accountId: 'acc1', amount: 505 }]

    recipient = [{ accountId: 'rec1', credit: 490 }]

    expect(() => newRebalancingTx(closing, recipient)).toThrowError(errorMsg)
  })

  test('Lucky shot! Single transaction is enough', () => {
    closing = [{ accountId: 'acc1', amount: 500 }]

    recipient = [{ accountId: 'rec1', credit: 490 }]

    expected = {
      transfers: [['acc1', 'rec1', 490]],
      operationalFee: 10,
    }

    expect(newRebalancingTx(closing, recipient)).toEqual(expected)
    expect(verifyRebalancingTx(closing, recipient, expected)).toBe(true)
  })

  test('Multiple recipient and extra for the reserve', () => {
    closing = [{ accountId: 'acc1', amount: 500 }]

    recipient = [
      { accountId: 'rec1', credit: 100 },
      { accountId: 'rec2', credit: 150 },
      { accountId: 'rec3', credit: 70 },
    ]

    expected = {
      transfers: [
        ['acc1', 'rec1', 100],
        ['acc1', 'rec2', 150],
        ['acc1', 'rec3', 70],
        ['acc1', null, 140],
      ],
      operationalFee: 40,
    }

    expect(newRebalancingTx(closing, recipient)).toEqual(expected)
    expect(verifyRebalancingTx(closing, recipient, expected)).toBe(true)
  })

  test('Many to many accounts with stuffed pockets', () => {
    closing = [
      { accountId: 'acc1', amount: 400 },
      { accountId: 'acc2', amount: 500 },
      { accountId: 'acc3', amount: 600 },
      { accountId: 'acc4', amount: 700 },
      { accountId: 'acc5', amount: 800 },
      { accountId: 'acc6', amount: 1000 },
      { accountId: 'acc7', amount: 2000 },
      { accountId: 'acc8', amount: 3000 },
      { accountId: 'acc9', amount: 4000 },
      { accountId: 'acc10', amount: 5000 },
      { accountId: 'acc11', amount: 6000 },
      { accountId: 'acc12', amount: 7000 },
    ]

    recipient = [
      { accountId: 'rec1', credit: 100 },
      { accountId: 'rec2', credit: 150 },
      { accountId: 'rec3', credit: 70 },
      { accountId: 'rec4', credit: 100 },
      { accountId: 'rec5', credit: 150 },
      { accountId: 'rec6', credit: 70 },
      { accountId: 'rec7', credit: 100 },
      { accountId: 'rec8', credit: 150 },
      { accountId: 'rec9', credit: 70 },
      { accountId: 'rec10', credit: 100 },
      { accountId: 'rec11', credit: 150 },
      { accountId: 'rec12', credit: 70 },
      { accountId: 'rec13', credit: 100 },
      { accountId: 'rec14', credit: 150 },
      { accountId: 'rec15', credit: 70 },
      { accountId: 'rec16', credit: 100 },
      { accountId: 'rec17', credit: 150 },
      { accountId: 'rec18', credit: 70 },
      { accountId: 'rec19', credit: 100 },
      { accountId: 'rec20', credit: 150 },
      { accountId: 'rec21', credit: 70 },
      { accountId: 'rec22', credit: 100 },
      { accountId: 'rec23', credit: 150 },
      { accountId: 'rec24', credit: 70 },
      { accountId: 'rec25', credit: 100 },
      { accountId: 'rec26', credit: 150 },
      { accountId: 'rec27', credit: 70 },
      { accountId: 'rec28', credit: 100 },
      { accountId: 'rec29', credit: 150 },
      { accountId: 'rec30', credit: 70 },
      { accountId: 'rec31', credit: 100 },
      { accountId: 'rec32', credit: 150 },
      { accountId: 'rec33', credit: 70 },
      { accountId: 'rec34', credit: 100 },
      { accountId: 'rec35', credit: 150 },
      { accountId: 'rec36', credit: 70 },
    ]

    const result = newRebalancingTx(closing, recipient)

    expect(verifyRebalancingTx(closing, recipient, result)).toBe(true)
    expect(result).toMatchInlineSnapshot(`
      {
        "operationalFee": 470,
        "transfers": [
          [
            "acc1",
            "rec1",
            100,
          ],
          [
            "acc1",
            "rec2",
            150,
          ],
          [
            "acc1",
            "rec3",
            70,
          ],
          [
            "acc1",
            "rec4",
            80,
          ],
          [
            "acc2",
            "rec4",
            20,
          ],
          [
            "acc2",
            "rec5",
            150,
          ],
          [
            "acc2",
            "rec6",
            70,
          ],
          [
            "acc2",
            "rec7",
            100,
          ],
          [
            "acc2",
            "rec8",
            150,
          ],
          [
            "acc2",
            "rec9",
            10,
          ],
          [
            "acc3",
            "rec9",
            60,
          ],
          [
            "acc3",
            "rec10",
            100,
          ],
          [
            "acc3",
            "rec11",
            150,
          ],
          [
            "acc3",
            "rec12",
            70,
          ],
          [
            "acc3",
            "rec13",
            100,
          ],
          [
            "acc3",
            "rec14",
            120,
          ],
          [
            "acc4",
            "rec14",
            30,
          ],
          [
            "acc4",
            "rec15",
            70,
          ],
          [
            "acc4",
            "rec16",
            100,
          ],
          [
            "acc4",
            "rec17",
            150,
          ],
          [
            "acc4",
            "rec18",
            70,
          ],
          [
            "acc4",
            "rec19",
            100,
          ],
          [
            "acc4",
            "rec20",
            150,
          ],
          [
            "acc4",
            "rec21",
            30,
          ],
          [
            "acc5",
            "rec21",
            40,
          ],
          [
            "acc5",
            "rec22",
            100,
          ],
          [
            "acc5",
            "rec23",
            150,
          ],
          [
            "acc5",
            "rec24",
            70,
          ],
          [
            "acc5",
            "rec25",
            100,
          ],
          [
            "acc5",
            "rec26",
            150,
          ],
          [
            "acc5",
            "rec27",
            70,
          ],
          [
            "acc5",
            "rec28",
            100,
          ],
          [
            "acc5",
            "rec29",
            20,
          ],
          [
            "acc6",
            "rec29",
            130,
          ],
          [
            "acc6",
            "rec30",
            70,
          ],
          [
            "acc6",
            "rec31",
            100,
          ],
          [
            "acc6",
            "rec32",
            150,
          ],
          [
            "acc6",
            "rec33",
            70,
          ],
          [
            "acc6",
            "rec34",
            100,
          ],
          [
            "acc6",
            "rec35",
            150,
          ],
          [
            "acc6",
            "rec36",
            70,
          ],
          [
            "acc12",
            null,
            6990,
          ],
          [
            "acc11",
            null,
            5990,
          ],
          [
            "acc10",
            null,
            4990,
          ],
          [
            "acc9",
            null,
            3990,
          ],
          [
            "acc8",
            null,
            2990,
          ],
          [
            "acc7",
            null,
            1740,
          ],
        ],
      }
    `)
  })
})
