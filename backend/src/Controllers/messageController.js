import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";

//! adding message to db
//* Route - /api/message
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed");
    return res.send(400).json({ message: "Invalid Data" });
  }

  //crete new message object
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    //add creted message object to db and populate all required fields
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    //populate lastMesasge field in db
    await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });

    res.json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

//! getting messages from db
//* Route - /api/message/:chatId

export const getAllMessages = async (req, res) => {
  //get chat id from frontend in url
  const chatId = req.params.chatId;
  if (!chatId) {
    console.log("Invalid data passed");
    return res.send(400).json({ message: "Invalid Data" });
  }

  try {
    //find messages in that chat and return
    const allMessages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");

    return res.status(200).send(allMessages);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
