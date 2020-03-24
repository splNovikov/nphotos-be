import { BadRequestException, Logger } from '@nestjs/common';

async function simultaneousPromises(
  asyncFunctions: any[],
  limit: number = 1,
): Promise<any[]> {
  if (!asyncFunctions || !asyncFunctions.length) {
    return;
  }

  const sharedObj = {
    promiseIndex: -1,
    res: {},
  };
  const promises = [];

  for (let i = 0; i < limit; i++) {
    promises.push(
      new Promise(resolve => {
        infiniteFetch(asyncFunctions, sharedObj, res => {
          resolve(res);
        });
      }),
    );
  }

  return Promise.all(promises)
    .then(() => sharedObj.res)
    .then(res => Object.values(res));
}

const infiniteFetch = async (
  asyncFunctions: any[],
  sharedObj: { promiseIndex: number; res: any },
  cb: any,
): Promise<any> => {
  sharedObj.promiseIndex += 1;
  const index = sharedObj.promiseIndex;

  if (!asyncFunctions[index]) {
    return cb(sharedObj.res);
  }

  let res;

  if (typeof asyncFunctions[index] !== 'function') {
    res = new BadRequestException('Async function is not a function!');
  } else {
    try {
      res = await asyncFunctions[index]();
    } catch (e) {
      Logger.error(e);
      res = e.message;
    }
  }

  sharedObj.res[index] = res;

  return infiniteFetch(asyncFunctions, sharedObj, cb);
};

export { simultaneousPromises };
