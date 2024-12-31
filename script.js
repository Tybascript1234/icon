window.onload = function() {
    // حدد جميع عناصر textarea مع الفئة "editor"
    const editors = document.querySelectorAll(".editor");

    // مر على كل عنصر وأضف محررًا وأزرارًا
    editors.forEach((textarea, index) => {
        // إنشاء CodeMirror لكل محرر
        const editor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            mode: "javascript",
            theme: "default",
            extraKeys: { "Ctrl-Space": "autocomplete" },
            hintOptions: { completeSingle: false }
        });

        // تحسين التكميل التلقائي أثناء الكتابة
        editor.on("inputRead", function(cm, change) {
            if (change.text[0] && /[a-zA-Z0-9$_]/.test(change.text[0])) {
                cm.showHint({ completeSingle: false });
            }
        });

        // إنشاء عناصر الأزرار
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "home-work-button";

        const copyButton = document.createElement("button");
        copyButton.innerHTML = '<ion-icon name="copy"></ion-icon>';
        copyButton.addEventListener("click", function() {
            const code = editor.getValue();
            navigator.clipboard.writeText(code).then(() => {
                const originalContent = copyButton.innerHTML;
                copyButton.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
                setTimeout(() => {
                    copyButton.innerHTML = originalContent;
                }, 1000);
            }).catch(err => {
                console.error("فشل النسخ: ", err);
            });
        });

        const shareButton = document.createElement("button");
        shareButton.innerHTML = '<ion-icon name="share-social"></ion-icon>';
        shareButton.addEventListener("click", function() {
            const code = editor.getValue();
            if (navigator.share) {
                navigator.share({
                    title: "مشاركة الكود",
                    text: code
                }).catch(err => {
                    console.error("فشل المشاركة: ", err);
                });
            } else {
                alert("ميزة المشاركة غير مدعومة في هذا المتصفح.");
            }
        });

        // إضافة الأزرار إلى الحاوية
        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(shareButton);

        // إضافة الأزرار أسفل كل محرر
        textarea.parentElement.appendChild(buttonsContainer);
    });
};
