const db = uniCloud.database();
const _ = db.command;
const recordCollection = db.collection("blood-sugar");

export const addRecord = async (params) => {
  const userId = params.userId;
  const dateStr = params.dateStr;
  if (!userId || !dateStr) {
    return Promise.reject(new Error("缺少必要的参数"));
  }
  const response = await recordCollection
    .where({
      userId,
      dateStr,
    })
    .get();
  const isExist = response.result?.data?.length > 0;
  if (isExist) {
    const id = response.result.data[0]._id;
    return await recordCollection.doc(id).update(params);
  } else {
    return await recordCollection.add(params);
  }
};

export const getRecordList = async (params) => {
  const start = params.start;
  const end = params.end;
  const userId = params.userId;
  const response = await recordCollection
    .orderBy("date desc")
    .where({
      userId,
      date: _.gte(start).and(_.lte(end)),
    })
    .get();
  return response.result.data;
};

export const getRecordById = async (id) => {
  const response = await recordCollection.doc(id).get({
    getOne: true,
  });
  return response.result.data;
};

export const updateRecord = async (id, params) => {
  const response = await recordCollection.doc(id).update(params);
  return response.result;
};

export const removeRecord = async (id) => {
  const response = await recordCollection.doc(id).remove();
  return response.result;
};
