import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js"; // Import the User model

export const createMessage = async (req, res, next) => {
  try {
    // Retrieve the userImg associated with the userId
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      throw createError(404, "User not found");
    }

    const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: req.userId,
      userImg: currentUser.img, 
      desc: req.body.desc,
    });

    const savedMessage = await newMessage.save();

    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
