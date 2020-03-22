const db = require('../lib/db');

const user = module.exports;

user.updateProfile = async (displayName, company, userId) => {
  const result = await db.query(
    `UPDATE users SET display_name = $1, company = $2 WHERE id = $3 RETURNING *`,
    [displayName, company, userId]
  );

  return result.rows[0];
};
