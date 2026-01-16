const RolePagePermission = require('../models/rolepagepermission.modal');
const PageMaster = require('../models/pagemaster.model');

/**
 * @param {string} pageCode - e.g. USER_LIST
 * @param {string} action   - e.g. view | create | edit | delete
 */
function checkPermission(pageCode, action = 'view') {
  return async (req, res, next) => {
    try {
      const { userTypeId } = req.session.user;

      // 1️⃣ Find page by code
      const page = await PageMaster.findOne({
        pageCode,
        isActive: true
      });

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      // 2️⃣ Check role permission
      const permission = await RolePagePermission.findOne({
        userTypeId,
        pageId: page._id,
        isActive: true
      });


      if (!permission) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // 3️⃣ Check action
      if (!permission || permission.actions?.[action] !== true) {
        return res.status(403).json({ message: 'Action not allowed' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Permission check failed' });
    }
  };
}

module.exports = checkPermission;
