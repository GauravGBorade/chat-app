import Chat from "../models/chat.js";
import User from "../models/user.js";

export const getAllChats = async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    allChats = await User.populate(allChats, {
      path: "lastMessage.sender",
      select: "name email",
    });
    res.status(200).send(allChats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createChat = async (req, res) => {
  //get the user Id with which current logged in user wants to chat
  const receiverUserId = req.params.id.toString();
  if (!receiverUserId) {
    return res.status(400).json({ message: "Error Something Went Wrong" });
  }

  //check if chat with this person already exists
  let doesChatAlreadyExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: receiverUserId } } },
    ],
  })
    .populate({
      path: "users",
      select: "-password",
    })
    //add user who sent last message too
    .populate({
      path: "lastMessage",
    });

  doesChatAlreadyExist = await User.populate(doesChatAlreadyExist, {
    path: "lastMessage.sender",
    select: "name email",
  });

  //if chat exists then send it else create one
  if (doesChatAlreadyExist.length > 0) {
    res.send(doesChatAlreadyExist[0]);
  } else {
    //create chat object with logged In user and user from body
    let chat = {
      chatName: req.user.name,
      isGroupChat: false,
      users: [req.user._id, receiverUserId],
    };

    try {
      //save chat to DB
      const newChat = new Chat(chat);
      await newChat.save();

      // find this created chat and send back to frontend
      const createdChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(createdChat);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong" });
    }
  }
};

export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.groupName) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  let users = JSON.parse(req.body.users);

  users.push(req.user);
  try {
    const newGroupChat = new Chat({
      chatName: req.body.groupName,
      users: users,
      isGroupChat: true,
      admin: req.user,
    });
    await newGroupChat.save();

    const createGroupChat = await Chat.findOne({
      _id: newGroupChat._id,
    })
      .populate("users", "-password")
      .populate("admin", "-password");

    res.status(200).json(createGroupChat);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
