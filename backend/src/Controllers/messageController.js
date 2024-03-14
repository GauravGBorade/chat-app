import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed");
    return res.send(400).json({ message: "Invalid Data" });
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });

    res.json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

export const getAllMessages = async (req, res) => {
  const chatId = req.params.chatId;
  if (!chatId) {
    console.log("Invalid data passed");
    return res.send(400).json({ message: "Invalid Data" });
  }

  try {
    const allMessages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");

    return res.status(200).send(allMessages);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
