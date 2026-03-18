// server/controllers/orderController.js
// Order controller for handling order operations

const Order = require('../models/Order');
const User = require('../models/User');
const Menu = require('../models/Menu');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, restaurantId, restaurantName, totalAmount, deliveryFee } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      deliveryFee: deliveryFee || 0,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      restaurantId,
      restaurantName,
      deliveryStatus: 'placed'
    });

    // Add order to user's order history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orderHistory: order._id }
    });

    // Increase popularity of ordered items
    for (const item of items) {
      await Menu.findByIdAndUpdate(item.menuItemId, {
        $inc: { popularity: 1 }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (would be admin in a real app)
const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryStatus = deliveryStatus;

    if (deliveryStatus === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.deliveryStatus !== 'placed' && order.deliveryStatus !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.deliveryStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
