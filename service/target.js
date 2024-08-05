const db = uniCloud.database();
const targetCollection = db.collection("blood-sugar-target");

export const createUserTarget = async (userId) => {
  const response = await getUserTarget(userId);
  if (response) {
    return response;
  }
  const params = {
    user: userId,
    limosis: {
      low: "3.9",
      normal: "6.1",
      high: "7.0",
    },
    beforeMeal: {
      low: "3.9",
      normal: "6.1",
      high: "7.0",
    },
    afterMeal: {
      low: "4.4",
      normal: "7.8",
      high: "11.1",
    },
    beforeSleep: {
      low: "3.9",
      normal: "6.1",
      high: "7.0",
    },
  };
  const res = await targetCollection.add(params);
  if (res.result.id) {
    return {
      ...params,
      _id: res.result.id,
    };
  }
  return null;
};

export const getUserTarget = async (userId) => {
  const response = await targetCollection
    .where({
      user: userId,
    })
    .get({
      getOne: true,
    });
  return response?.result?.data;
};

export const updateUserTarget = async (id, payload) => {
  const response = await targetCollection
    .where({
      user: id,
    })
    .update(payload);
  return response.result;
};
