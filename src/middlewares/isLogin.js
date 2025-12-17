// Middleware to check if user is logged in
function isLogin(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }

    // Render halaman login dengan pesan error
    return res.status(401).render('login', {
        error: 'Anda harus login terlebih dahulu untuk mengakses halaman ini',
        success: null
    });
}

module.exports = isLogin;