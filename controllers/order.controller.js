//import createError from "../utils/createError"
import Order from "../models/order.model.js";
import Service from "../models/service.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const service = await Service.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: service.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    serviceId: service._id,
    img: service.cover,
    title: service.title,
    buyerId: req.userId,
    sellerId: service.userId,
    price: service.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
export const updateOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).send("Order not found");
    }

    res.status(200).send(updatedOrder);
  } catch (err) {
    next(err);
  }
};