const express = require('express');
const userRouter = express.Router();
const { adminAuthMiddleware, userAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { addUser, loginUser, updateProfile, getAllUsers, getUserById, deleteUserById, updateUserById, forgotUserPassword, resetUserPassword, resendUserOtp } = require('../controllers/user.controller');



/**
  * @swagger
  * tags:
  *   name: User
  *   description: API for managing users
  */




/**
  * @swagger
  * /api/User/Register:
  *   post:
  *     summary: Register a new user
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UserRegister'
  *     responses:
  *       201:
  *         description: User registered successfully
  */
userRouter.post('/Register', addUser);
/**
  * @swagger
  * /api/User/Login:
  *   post:
  *     summary: Login a user
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *              $ref: '#/components/schemas/UserLogin'
  *     responses:
  *       200:
  *         description: User logged in successfully
  */
userRouter.post('/Login', loginUser);

/**
  * @swagger
  * /api/User/UpdateProfile:
  *   post:
  *     summary: Update user profile
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateProfile'
  *     responses:
  *       200:
  *         description: Profile updated successfully
  */

userRouter.post('/UpdateProfile', userAuthMiddleware, updateProfile);
/**
  * @swagger
  * /api/User/GetAllUsers:
  *   post:
  *     summary: Get All User 
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllUser'
  *     responses:
  *       200:
  *         description: Success
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 type: object
  */
userRouter.post('/GetAllUsers', adminAuthMiddleware, getAllUsers);

/**
  * @swagger
  * /api/User/GetUserById/{id}:
  *   get:
  *     summary: Get user by Id
  *     tags: [User]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: User Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns User object.
  */
userRouter.get('/GetUserById/:id', userAuthMiddleware, getUserById);

/**
  * @swagger
  * /api/User/DeteteUserById/{id}:
  *   put:
  *     summary: Delete user by ID
  *     tags: [User]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: User ID
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: User deleted successfully
  */
userRouter.put('/DeteteUserById/:id', adminAuthMiddleware, deleteUserById);

/**
  * @swagger
  * /api/User/UpdateUserById/{id}:
  *   put:
  *     summary: Update user by ID
  *     tags: [User]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: User ID
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: User updated successfully
  */
userRouter.put('/UpdateUserById/:id', adminAuthMiddleware, updateUserById);


/**
  * @swagger
  * /api/User/ForgotUserPassword:
  *   post:
  *     summary: Forgot User password
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/ForgotUserPassword'
  *     responses:
  *       200:
  *         description: Password Reset successfully
  */
userRouter.post('/ForgotUserPassword', forgotUserPassword);


/**
  * @swagger
  * /api/User/ResetUserPassword:
  *   post:
  *     summary: Reset User Password
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/ResetUserPassword'
  *     responses:
  *       200:
  *         description: Password Reset successfully 
  */
userRouter.post('/ResetUserPassword', resetUserPassword);


/**
  * @swagger
  * /api/User/ResendUserOtp:
  *   post:
  *     summary: Resend User OTP
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/ResendUserOtp'
  *     responses:
  *       200:
  *         description: OTP send successfully
  */
userRouter.post('/ResendUserOtp', resendUserOtp);

module.exports = userRouter;