const express = require('express');
const path = require('path');
const app = express();

// --- SECURITY: PASSWORD PROTECTION ---
const USERNAME = process.env.APP_USER || 'admin';
const PASSWORD = process.env.APP_PASS || 'imamreza1403';

app.use((req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === USERNAME && password === PASSWORD) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Secure Atlas Dashboard"');
    res.status(401).send('دسترسی غیرمجاز. لطفاً نام کاربری و رمز عبور را وارد کنید.');
});
// ------------------------------------

// Serve the 'dist' folder (or root if running locally)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔒 Secure Dashboard running on port ${PORT}`);
    console.log(`🔑 Username: ${USERNAME} | Password: ${PASSWORD}`);
});
