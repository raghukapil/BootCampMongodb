const express = require('express');
const { verityToken, authorize } = require('../middleware/verifyToken.middleware');
const { getUserById, getUsers, updateUser, createUser, deleteUser } = require("../controller/user.contoller");

const router = express.Router();

router.use(verityToken);
router.use(authorize('admin'));

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;