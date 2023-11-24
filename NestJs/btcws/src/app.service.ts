import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { Server } from 'socket.io'
import * as technicalIndicators from 'technicalindicators'
import { StockData } from './types'
import { calculateFibonacciPivots } from './utils/pivots'

@Injectable()
export class AppService {
  async handleNewData(newTrade: string, server: Server) {
    server.emit('stream', newTrade)
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

    console.log(analysis['1h'])
  }

  async getIndicators(binSize: string) {
    const params = {
      binSize,
      symbol: 'XBTUSD',
      columns: 'open,close,low,high,volume',
      count: 60,
      reverse: true,
    }

    const response = await axios
      .get('https://www.bitmex.com/api/v1/trade/bucketed', { params })
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
  }
}
