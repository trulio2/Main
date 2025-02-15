import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { sha256 } from 'js-sha256'
import { Server } from 'socket.io'
import * as technicalIndicators from 'technicalindicators'
import { StockData } from './types'
import { calculateFibonacciPivots } from './utils/pivots'

@Injectable()
export class AppService {
  private _lastUpdate: Date
  private _lastPriceDate: Date
  private _apiUrl = 'https://www.bitmex.com'
  private _secret = ''
  private _analysis: any
  private _maxSize = 500
  private _orderSize = 100

  async handleNewData(newTrade: string, server: Server) {
    server.emit('stream', newTrade)
  }

  async handleCurrentPrice(last: any) {
    if (this._lastPriceDate) {
      if (new Date().getTime() - this._lastPriceDate.getTime() < 12000) {
        return
      }
    }

    const lastData = last[last.length - 1]
    const price = Math.floor(lastData.price)
    const side = lastData.side
    const size = lastData.size
    const timestamp = new Date(lastData.timestamp)

    console.log(`${side} ${size} at ${price}`)

    this._lastPriceDate = timestamp

    if (
      !this._lastUpdate ||
      timestamp.getTime() - this._lastUpdate.getTime() > 300000
    ) {
      this._lastUpdate = timestamp
      const analysis = await this.getIndicators('1d')

      if (analysis) {
        this._analysis = analysis
      }
    }

    this.handleNewTrade(price)
  }

  async handleNewTrade(price: number) {
    const promises: Promise<any>[] = []
    promises.push(this.getOpenPositions())
    promises.push(this.getOpenOrders())

    const [position, openOrders] = await Promise.all(promises)

    const pivots = this._analysis?.pivots[this._analysis?.pivots.length - 1]

    if (!position || !pivots) return

    await this.shouldBuy(price, position, pivots, openOrders)
    await this.shouldSell(price, position, pivots, openOrders)
  }

  async shouldBuy(price: number, position: any, pivots: any, openOrders: any) {
    if (position.size >= this._maxSize || price >= position.entry) {
      return
    }

    const buyOrders = openOrders.filter((order: any) => order.side === 'Buy')

    if (!position.size && price > pivots['R1']) {
      return
    }

    if (buyOrders.length === 0) {
      if (price > pivots['PP']) {
        await this.createOrder('Buy', price - 200, this._orderSize)
      } else {
        await this.createOrder('Buy', price - 100, this._orderSize)
      }

      return
    }

    const orderPrice = buyOrders[0].price

    if (price > pivots['PP']) {
      const buyPrice = price - 200

      const diff = Math.abs(price - orderPrice)

      if (diff < 200) return

      await this.closeAllOpenOrders()
      await this.createOrder('Buy', buyPrice, this._orderSize)

      return
    }
    const buyPrice = price - 100

    const diff = Math.abs(price - orderPrice)

    if (diff < 100) return

    await this.closeAllOpenOrders()
    await this.createOrder('Buy', buyPrice, this._orderSize)
  }

  async shouldSell(price: number, position: any, pivots: any, openOrders: any) {
    if (position.size <= 0 || price <= position.entry) {
      return
    }

    const sellOrders = openOrders.filter((order: any) => order.side === 'Sell')

    if (sellOrders.length === 0) {
      if (price < pivots['PP']) {
        await this.createOrder('Sell', price + 200, this._orderSize)
      } else {
        await this.createOrder('Sell', price + 100, this._orderSize)
      }

      return
    }

    const orderPrice = sellOrders[0].price

    if (price < pivots['PP']) {
      const sellPrice = price + 200

      const diff = Math.abs(price - orderPrice)

      if (diff < 200) return

      await this.closeAllOpenOrders()
      await this.createOrder('Sell', sellPrice, this._orderSize)

      return
    }

    const sellPrice = price + 100

    const diff = Math.abs(price - orderPrice)

    if (diff < 100) return

    await this.closeAllOpenOrders()
    await this.createOrder('Sell', sellPrice, this._orderSize)
  }

  async createOrder(side: string, price: number, size: number) {
    try {
      const verb = 'POST'
      const path = '/api/v1/order'
      const expires = new Date().getTime() + 60 * 1000

      const data = {
        symbol: 'XBTUSD',
        side,
        orderQty: size,
        price,
        ordType: 'Limit',
      }

      const signature = sha256.hmac
        .update(
          this._secret,
          verb + path + String(expires) + JSON.stringify(data),
        )
        .hex()

      console.log('creating new order', data)

      await axios.post(`${this._apiUrl}${path}`, data, {
        headers: {
          'api-expires': expires,
          'api-key': '',
          'api-signature': signature,
        },
      })

      return true
    } catch (e) {
      console.log('error creating order', e)
      return false
    }
  }

  async getOpenOrders() {
    try {
      const verb = 'GET'
      const path = `/api/v1/order?filter={%22open%22:true}`
      const expires = new Date().getTime() + 60 * 1000

      const signature = sha256.hmac
        .update(this._secret, verb + path + String(expires))
        .hex()

      const response = await axios.get(`${this._apiUrl}${path}`, {
        headers: {
          'api-expires': expires,
          'api-key': '',
          'api-signature': signature,
        },
      })

      return response.data
    } catch {
      return []
    }
  }

  async closeAllOpenOrders(): Promise<boolean> {
    try {
      const verb = 'DELETE'
      const path = `/api/v1/order/all`
      const expires = new Date().getTime() + 60 * 1000

      const signature = sha256.hmac
        .update(this._secret, verb + path + String(expires))
        .hex()

      await axios.delete(`${this._apiUrl}${path}`, {
        headers: {
          'api-expires': expires,
          'api-key': '',
          'api-signature': signature,
        },
      })

      return true
    } catch {
      return false
    }
  }

  async getOpenPositions() {
    try {
      const verb = 'GET'
      const path = '/api/v1/position'
      const expires = new Date().getTime() + 60 * 1000

      const signature = sha256.hmac
        .update(this._secret, verb + path + String(expires))
        .hex()

      const response = await axios.get(`${this._apiUrl}${path}`, {
        headers: {
          'api-expires': expires,
          'api-key': '',
          'api-signature': signature,
        },
      })

      return {
        entry: response.data[0].avgEntryPrice,
        size: response.data[0].currentQty,
      }
    } catch {
      return {
        entry: 0,
        size: 0,
      }
    }
  }

  async chartAnalysis() {
    this.getChartData()
    setInterval(async () => {
      this.getChartData()
    }, 60000)
  }

  async getChartData() {
    const promise1m = new Promise((resolve) => {
      resolve(this.getIndicators('1m'))
    })

    const promise5m = new Promise((resolve) => {
      resolve(this.getIndicators('5m'))
    })

    const promise1h = new Promise((resolve) => {
      resolve(this.getIndicators('1h'))
    })

    const promise1d = new Promise((resolve) => {
      resolve(this.getIndicators('1d'))
    })

    const analysis: any = await Promise.all([
      promise1m,
      promise5m,
      promise1h,
      promise1d,
    ]).then((values) => {
      return {
        '1m': values[0],
        '5m': values[1],
        '1h': values[2],
        '1d': values[3],
      }
    })

    return analysis
  }

  async getIndicators(binSize: string) {
    try {
      const params = {
        binSize,
        symbol: 'XBTUSD',
        columns: 'open,close,low,high,volume',
        count: 60,
        reverse: true,
      }

      const response = await axios
        .get(`${this._apiUrl}/api/v1/trade/bucketed`, { params })
        .then((res) => res.data)

      const res = response.reverse()

      const data: StockData = {
        open: res.map((item: any) => Math.floor(item.open)),
        high: res.map((item: any) => Math.floor(item.high)),
        close: res.map((item: any) => Math.floor(item.close)),
        low: res.map((item: any) => Math.floor(item.low)),
        volume: res.map((item: any) => Math.floor(item.volume)),
      }

      return {
        bollingerBands: technicalIndicators.BollingerBands.calculate({
          period: 14,
          stdDev: 2,
          values: data.close,
        }),
        ichimoku: technicalIndicators.IchimokuCloud.calculate({
          conversionPeriod: 9,
          basePeriod: 26,
          spanPeriod: 52,
          displacement: 26,
          high: data.high,
          low: data.low,
        }),
        simpleMovingAverage: technicalIndicators.SMA.calculate({
          period: 14,
          values: data.close,
        }),
        movingAverageConvergenceDivergence: technicalIndicators.MACD.calculate({
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
          values: data.close,
          SimpleMAOscillator: false,
          SimpleMASignal: false,
        }),
        exponentialMovingAverage: technicalIndicators.EMA.calculate({
          period: 14,
          values: data.close,
        }),
        weightedMovingAverage: technicalIndicators.WMA.calculate({
          period: 14,
          values: data.close,
        }),
        volumeWeightedAveragePrice: technicalIndicators.VWAP.calculate({
          high: data.high,
          low: data.low,
          close: data.close,
          volume: data.volume,
        }),
        relativeStrengthIndex: technicalIndicators.RSI.calculate({
          period: 14,
          values: data.close,
        }),
        moneyflowIndex: technicalIndicators.MFI.calculate({
          period: 14,
          high: data.high,
          low: data.low,
          close: data.close,
          volume: data.volume,
        }),
        stochastic: technicalIndicators.Stochastic.calculate({
          period: 14,
          high: data.high,
          low: data.low,
          close: data.close,
          signalPeriod: 3,
        }),
        awesomeOscillator: technicalIndicators.AwesomeOscillator.calculate({
          high: data.high,
          low: data.low,
          fastPeriod: 5,
          slowPeriod: 34,
        }),
        parabolicStopandReverse: technicalIndicators.PSAR.calculate({
          high: data.high,
          low: data.low,
          step: 0.02,
          max: 0.2,
        }),
        tripleExponentiallySmoothedAverage: technicalIndicators.TRIX.calculate({
          period: 18,
          values: data.close,
        }),
        rateOfChange: technicalIndicators.ROC.calculate({
          period: 12,
          values: data.close,
        }),
        averageTrueRange: technicalIndicators.ATR.calculate({
          period: 14,
          high: data.high,
          low: data.low,
          close: data.close,
        }),
        accumulationDistributionLine: technicalIndicators.ADL.calculate({
          high: data.high,
          low: data.low,
          close: data.close,
          volume: data.volume,
        }),
        averageDirectionalIndex: technicalIndicators.ADX.calculate({
          period: 14,
          high: data.high,
          low: data.low,
          close: data.close,
        }),
        wilderSmoothing: technicalIndicators.WEMA.calculate({
          period: 14,
          values: data.close,
        }),
        pivots: calculateFibonacciPivots(data),
        bullishResult: technicalIndicators.bullish(data),
        bearishResult: technicalIndicators.bearish(data),
        bullishengulfingpatternResult:
          technicalIndicators.bullishengulfingpattern(data),
        bearishengulfingpatternResult:
          technicalIndicators.bearishengulfingpattern(data),
        bullishharamiResult: technicalIndicators.bullishharami(data),
        bearishharamiResult: technicalIndicators.bearishharami(data),
        bullishharamicrossResult: technicalIndicators.bullishharamicross(data),
        bearishharamicrossResult: technicalIndicators.bearishharamicross(data),
        bullishmarubozuResult: technicalIndicators.bullishmarubozu(data),
        bearishmarubozuResult: technicalIndicators.bearishmarubozu(data),
        bullishspinningtopResult: technicalIndicators.bullishspinningtop(data),
        bearishspinningtopResult: technicalIndicators.bearishspinningtop(data),
        bullishhammerstickResult: technicalIndicators.bullishhammerstick(data),
        bearishhammerstickResult: technicalIndicators.bearishhammerstick(data),
        bullishinvertedhammerstickResult:
          technicalIndicators.bullishinvertedhammerstick(data),
        bearishinvertedhammerstickResult:
          technicalIndicators.bearishinvertedhammerstick(data),
        abandonedbabyResult: technicalIndicators.abandonedbaby(data),
        darkcloudcoverResult: technicalIndicators.darkcloudcover(data),
        downsidetasukigapResult: technicalIndicators.downsidetasukigap(data),
        dojiResult: technicalIndicators.doji(data),
        dragonflydojiResult: technicalIndicators.dragonflydoji(data),
        gravestonedojiResult: technicalIndicators.gravestonedoji(data),
        eveningstarResult: technicalIndicators.eveningstar(data),
        eveningdojistarResult: technicalIndicators.eveningdojistar(data),
        piercinglineResult: technicalIndicators.piercingline(data),
        morningdojistarResult: technicalIndicators.morningdojistar(data),
        morningstarResult: technicalIndicators.morningstar(data),
        threeblackcrowsResult: technicalIndicators.threeblackcrows(data),
        threewhitesoldiersResult: technicalIndicators.threewhitesoldiers(data),
        hammerpatternResult: technicalIndicators.hammerpattern(data),
        hangingmanResult: technicalIndicators.hangingman(data),
        shootingstarResult: technicalIndicators.shootingstar(data),
        tweezerbottomResult: technicalIndicators.tweezerbottom(data),
        tweezertopResult: technicalIndicators.tweezertop(data),
      }
    } catch {
      return {}
    }
  }
}
