/** dependencies */
const router = require('express').Router();
// const imageRoutes = require('./routes/imageRoutes');
// const userRoutes = require('./routes/usersRoutes');
const oauth = require('./routes/oauth');
const admin = require('./routes/admin');
// const postRoutes = require('./routes/postsRoutes');

// router.use("/images", imageRoutes);

// router.use("/users", userRoutes);

router.use('/oauth', oauth);
router.use('/admin', admin);

module.exports = router;