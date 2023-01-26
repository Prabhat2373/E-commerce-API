const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
} = require("../Controller/OrderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");

router.route("/order/new").post(newOrder);

router.route("/order/:id").get(getSingleOrder);

router.route("/orders/me").get(myOrders);

router
    .route("/admin/orders")
    .get(authorizeRoles("admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(authorizeRoles("admin"), updateOrder)
    .delete(authorizeRoles("admin"), deleteOrder);

module.exports = router;