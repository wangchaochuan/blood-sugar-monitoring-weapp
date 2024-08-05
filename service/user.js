const userCo = uniCloud.importObject("user-co");
const db = uniCloud.database();
const userCollection = db.collection("users");

const getOpenId = async () => {
  const { code } = await uni.login({
    provider: "weixin",
  });
  if (!code) {
    return null;
  }
  // 获取微信用户openId
  const openId = await userCo.getOpenId(code);
  return openId;
};

export const getUserById = async (id) => {
  const response = await userCollection.doc(id).get({
    getOne: true,
  });
  return response?.result?.data;
};
const getUserByOpenid = async (id) => {
  const response = await userCollection
    .where({
      mp_wx_openid: id,
    })
    .get({
      getOne: true,
    });
  return response.result.data;
};

const register = async (id) => {
  const response = await userCollection.add({
    mp_wx_openid: id,
  });
  return response?.result?.id;
};

export const getUser = async () => {
  const userId = uni.getStorageSync("userId");
  if (userId) {
    return await getUserById(userId);
  } else {
    const openId = await getOpenId();
    const user = await getUserByOpenid(openId);
    if (user) {
      return user;
    }
    const _id = register(openId);
    return await getUserById(_id);
  }
};

export const updateUser = async (id, payload) => {
  if (!id) {
    return Promise.reject(new Error("服务器内部错误,无法更新用户信息!"));
  }
  return await userCollection.doc(id).update(payload);
};

// followUserId 关注者用户Id   noticeUserId  被关注者用户id;
export const addNoticeUser = async (followUserId, noticeUserId) => {
  const followUser = await getUserById(followUserId);
  const noticeUser = await getUserById(noticeUserId);
  const noticeMembers = followUser.attention || [];
  const followMembers = noticeUser.follow || [];
  if (!noticeMembers.includes(noticeUserId)) {
    noticeMembers.push(noticeUserId);
    await updateUser(followUserId, {
      attention: noticeMembers,
    });
  }
  if (!followMembers.includes(followUserId)) {
    followMembers.push(followUserId);
    await updateUser(noticeUserId, {
      follow: followMembers,
    });
  }
};

export const removeNoticeUser = async (followUserId, noticeUserId) => {
  const followUser = await getUserById(followUserId);
  const noticeUser = await getUserById(noticeUserId);
  const noticeMembers = followUser.attention || [];
  const followMembers = noticeUser.follow || [];
  const noticeIndex = noticeMembers.findIndex((v) => v === noticeUserId);
  const followIndex = followMembers.findIndex((v) => v === followUserId);
  if (noticeIndex > -1) {
    noticeMembers.splice(noticeIndex, 1);
    await updateUser(followUserId, {
      attention: noticeMembers,
    });
  }
  if (followIndex > -1) {
    followMembers.splice(followIndex, 1);
    await updateUser(noticeUserId, {
      follow: followMembers,
    });
  }
};
