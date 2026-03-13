const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// خدمة الملفات الثابتة (مثل CSS, JS, الصور)
app.use(express.static(path.join(__dirname, 'static')));

// الصفحة الرئيسية - تأكد من وجود ملف HTML الرئيسي
// إما index.html في المجلد الرئيسي أو ملف في مجلد templates
app.get('/', (req, res) => {
  // جرب أولاً: هل يوجد index.html في المجلد الرئيسي؟
  const mainIndex = path.join(__dirname, 'index.html');
  // أو جرب: هل المشروع يستخدم مجلد templates؟
  const templateIndex = path.join(__dirname, 'templates', 'index.html');
  
  // أرسل الملف الموجود
  res.sendFile(mainIndex, (err) => {
    if (err) {
      // إذا لم يوجد index.html في المجلد الرئيسي، جرب مجلد templates
      res.sendFile(templateIndex, (err2) => {
        if (err2) {
          // إذا لم يوجد أي ملف، أرسل رسالة بسيطة
          res.send('مرحباً! المشروع يعمل. لكن ملف الصفحة الرئيسية غير موجود.');
        }
      });
    }
  });
});

// مسار مخصص لصفحة تحميل APK (إذا أردت إضافتها)
app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, 'download.html'));
});

// المسار الافتراضي لأي طلب آخر
app.get('*', (req, res) => {
  res.status(404).send('الصفحة غير موجودة');
});

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
