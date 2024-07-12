// src/pages/api/reset-password.js

export default function handler(req, res) {
    const { token, employeeId } = req.query;

    // Chuyển hướng người dùng đến trang frontend với query parameters
    res.writeHead(302, {
        Location: `/auth/reset-password?token=${token}&employeeId=${employeeId}`
    });
    res.end();
}
