import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger();

  getHello(): string {
    return 'Hello World!';
  }

  blocking() {
    const now = new Date().getTime();
    while (new Date().getTime() < now + 10000) {}
    return {};
  }

  nonBlocking() {
    return new Promise(async (resolve) => {
      setTimeout(() => {
        resolve({});
      }, 10000);
    });
  }

  count() {
    let i = 0;
    while (i < 10_000_000_000) {
      i++;
    }
    return i;
  }

  nCount() {
    return new Promise((resolve) => {
      let i = 0;
      const target = 1_000_000;

      function step() {
        if (i < target) {
          i++;
          setImmediate(step);
        } else {
          resolve(i);
        }
      }

      setImmediate(step);
    });
  }

  async promises() {
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(await this.sleep());
    }
    return results;
  }

  async promisesParallel() {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(this.sleep());
    }
    return Promise.all(promises);
  }

  private async sleep() {
    return new Promise((resolve) => {
      this.logger.log('Start sleep');
      setTimeout(() => {
        this.logger.log('Sleep complete');
        resolve({});
      }, 1000);
    });
  }
}
