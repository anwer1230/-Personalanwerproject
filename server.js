const express = require('express');
const path = require('path');
const fs = require('fs'); // استيراد مكتبة الملفات للتحقق من الوجود
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// 1. تحديد المسارات الأساسية (Routes) بشكل واضح
// =====================================================

// ** المسار الرئيسي (الصفحة الرئيسية) **
// سيحاول العثور على index.html في عدة أماكن محتملة
app.get('/', (req, res) => {
    // قائمة بالأماكن التي قد يوجد بها ملف الصفحة الرئيسية
    const possiblePaths = [
        path.join(__dirname, 'templates', 'index.html'), // المجلد الذي أرسلت رابطه
        path.join(__dirname, 'index.html'),
        path.join(__dirname, 'public', 'index.html'),
        path.join(__dirname, 'static', 'index.html')
    ];

    // ابحث عن أول ملف موجود وأرسله
    for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
            console.log(`✅ تم العثور على الصفحة الرئيسية في: ${filePath}`);
            return res.sendFile(filePath);
        }
    }

    // إذا لم يتم العثور على أي ملف، أرسل رسالة خطأ مفيدة
    console.error('❌ لم يتم العثور على ملف index.html في أي من المسارات المتوقعة.');
    res.status(404).send(`
        <html dir="rtl"><body style="font-family:Arial; padding:20px">
        <h2>⚠️ ملف الصفحة الرئيسية غير موجود</h2>
        <p>تأكد من وجود ملف <code>index.html</code> داخل مجلد <code>templates</code>.</p>
        </body></html>
    `);
});

// =====================================================
// 2. خدمة الملفات الثابتة (Static Files) - هذا هو الحل لمشكلتك!
// =====================================================

// ** المجلدات التي توجد فيها ملفات التصميم (CSS) والصور و JavaScript **
// الأمر express.static يخبر الخادم بمكان هذه الملفات

// (أ) خدمة الملفات من مجلد 'static' (الأكثر شيوعاً)
app.use('/static', express.static(path.join(__dirname, 'static')));

// (ب) خدمة الملفات من مجلد 'assets' (إذا كان لديك مجلد بهذا الاسم)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// (ج) خدمة الملفات من مجلد 'css' مباشرة (إذا أردت)
app.use('/css', express.static(path.join(__dirname, 'css')));

// (د) خدمة الملفات من مجلد 'js' مباشرة
app.use('/js', express.static(path.join(__dirname, 'js')));

// (هـ) خدمة الملفات من مجلد 'images' مباشرة
app.use('/images', express.static(path.join(__dirname, 'images')));

// **مهم جداً**: هذا السطر يخدم الملفات من مجلد 'templates' نفسه،
// لكن مع الاحتفاظ بمساره. قد تحتاجه إذا كانت ملفات CSS داخل templates.
app.use('/templates', express.static(path.join(__dirname, 'templates')));

// =====================================================
// 3. مسار تحميل تطبيق APK (كما طلبت سابقاً)
// =====================================================
app.get('/download', (req, res) => {
    const apkPath = path.join(__dirname, 'downloads', 'app.apk');
    
    // تحقق من وجود ملف APK قبل الإرسال
    if (fs.existsSync(apkPath)) {
        res.download(apkPath, 'تطبيقي.apk');
    } else {
        // إذا لم يوجد ملف APK، أرسل صفحة بديلة
        res.send(`
            <html dir="rtl"><body style="font-family:Arial; padding:20px">
            <h2>📱 تحميل التطبيق</h2>
            <p>ملف التطبيق غير متوفر حالياً. سيتم رفعه قريباً.</p>
            <a href="/">العودة للرئيسية</a>
            </body></html>
        `);
    }
});

// =====================================================
// 4. معالجة جميع المسارات الأخرى (للتأكد من عدم وجود أخطاء 404)
// =====================================================
app.get('*', (req, res) => {
    res.status(404).send(`
        <html dir="rtl"><body style="font-family:Arial; padding:20px">
        <h2>404 - الصفحة غير موجودة</h2>
        <p>عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
        <a href="/">العودة للرئيسية</a>
        </body></html>
    `);
});

// =====================================================
// 5. تشغيل الخادم
// =====================================================
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل بنجاح على المنفذ ${PORT}`);
    console.log(`📂 المسار الرئيسي للمشروع: ${__dirname}`);
    console.log(`🖼️  مجلد القوالب (templates): ${path.join(__dirname, 'templates')}`);
    console.log(`🎨 مجلد الملفات الثابتة (static): ${path.join(__dirname, 'static')}`);
    
    // تحقق من وجود المجلدات الهامة وأخبر المستخدم
    if (!fs.existsSync(path.join(__dirname, 'static'))) {
        console.log('⚠️  تحذير: مجلد \'static\' غير موجود. أنشئه وضع فيه ملفات CSS.');
    }
    if (!fs.existsSync(path.join(__dirname, 'templates'))) {
        console.log('⚠️  تحذير: مجلد \'templates\' غير موجود.');
    }
});app.get('*', (req, res) => {
  res.status(404).send('الصفحة غير موجودة');
});

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
