import { BadRequestException } from '@nestjs/common';

async function simultaneousPromises(
  data: any[] = [],
  fetchFunction: any,
  limit: number = 1,
): Promise<any[]> {
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
        infiniteFetch(data, fetchFunction, sharedObj, res => {
          resolve(res);
        });
      }),
    );
  }

  return Promise.all(simultaneousPromises)
    .then(() => sharedObj.res)
    .then(res => Object.values(res));
}

const infiniteFetch = async (
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
    res = await fetchFunction(data[index]);
  } catch (e) {
    res = e.message;
  }

  sharedObj.res[index] = res;

  return infiniteFetch(data, fetchFunction, sharedObj, cb);
};

export { simultaneousPromises };
