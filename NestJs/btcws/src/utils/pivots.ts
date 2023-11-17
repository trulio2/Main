import { StockData } from '../types/stock-data'

export const calculateFibonacciPivots = (data: StockData) => {
  const pivots = data.close.map((_, index) => {
    if (index === 0) {
      return null
    }

    const high = data.high[index - 1]
    const low = data.low[index - 1]
    const close = data.close[index - 1]

    const pp = (high + low + close) / 3
    const range = high - low

    return {
      PP: pp,
      R1: pp + 0.382 * range,
      R2: pp + 0.618 * range,
      R3: pp + range,
      S1: pp - 0.382 * range,
      S2: pp - 0.618 * range,
      S3: pp - range,
    }
  })

  return pivots
}
