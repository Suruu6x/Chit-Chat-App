import asyncHandler from "express-async-handler";
import chatModel from "../Models/chatModel.js";
import userModel from "../Models/userModel.js";

export const accessChatController = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await chatModel
    .find({
      isgroupchat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestmessage");

  isChat = await userModel.populate(isChat, {
    path: "latestmessage",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatname: "sender",
      isgroupchat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await chatModel.create(chatData);

    const FullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");

    res.status(200).send(FullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Fetching Chats Controller
export const fetchChatsController = asyncHandler(async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupadmin", "-password")
      .populate("latestmessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestmessage",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChatController = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({
      success: false,
      message: "Please fill all the fields",
    });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than two users are required to form a group chats");
  }

  users.push(req.user);

  try {
    const groupChat = await chatModel.create({
      chatname: req.body.name,
      users: users,
      isgroupchat: true,
      groupadmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupadmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const renameGroupController = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        chatname: chatName,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupadmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

export const addToGroupController = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupadmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

export const removeFromGroupController = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupadmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});
