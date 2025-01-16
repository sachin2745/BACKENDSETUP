const db = require('../config/db');

// Controller function to handle the users' data fetching
const getUsers = (req, res) => {
    const sql = "SELECT * FROM users WHERE userStatus != 3 ORDER BY userSortBy ASC";
    
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message }); // Handle errors
        }
        return res.json(data); // Return the fetched data as JSON
    });
};

module.exports = {
    getUsers
};
