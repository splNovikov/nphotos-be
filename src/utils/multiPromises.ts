// todo: fetch function with data?

import { BadRequestException } from '@nestjs/common';

// todo: too much params. Can we remove context, stat and fetch?
const fetchData = async (
  context,
  data: any[] = [],
  fetchFunction: any,
  limit: number = 1,
): Promise<any[]> => {
  if (!data || !data.length) {
    return;
  }

  const sharedObj = {
    promiseIndex: -1,
    res: {},
  };
  const simultaneousPromises = [];

  for (let i = 0; i < limit; i++) {
    simultaneousPromises.push(
      new Promise(resolve => {
        infiniteFetch(context, data, fetchFunction, sharedObj, res => {
          resolve(res);
        });
      }),
    );
  }

  return Promise.all(simultaneousPromises)
    .then(() => sharedObj.res)
    .then(res => Object.values(res));
};

const infiniteFetch = async (
  context: any,
  data: any[],
  fetchFunction: any,
  sharedObj: { promiseIndex: number; res: any },
  cb: any,
): Promise<any> => {
  sharedObj.promiseIndex += 1;
  const index = sharedObj.promiseIndex;

  if (!data[index]) {
    return cb(sharedObj.res);
  }

  let res;

  try {
    res = await fetchFunction.call(context, data[index]);
  } catch (e) {
    // todo: test that it works:
    res = new BadRequestException(e.message);
  }

  sharedObj.res[index] = res;

  return infiniteFetch(context, data, fetchFunction, sharedObj, cb);
};

export { fetchData };
