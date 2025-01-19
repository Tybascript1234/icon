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
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    const originalContent = copyButton.innerHTML;
                    copyButton.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
                    setTimeout(() => {
                        copyButton.innerHTML = originalContent;
                    }, 1000);
                }).catch(err => {
                    console.error("فشل النسخ: ", err);
                    alert("فشل النسخ. جرب متصفحًا أحدث.");
                });
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");
                    alert("تم النسخ باستخدام الطريقة البديلة!");
                } catch (err) {
                    alert("فشل النسخ.");
                }
                document.body.removeChild(textarea);
            }
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
                    alert("فشل المشاركة.");
                });
            } else {
                alert("ميزة المشاركة غير مدعومة في هذا المتصفح.");
            }
        });

        const runButton = document.createElement("button");
        runButton.innerHTML = '<ion-icon name="open-outline"></ion-icon>';
        runButton.addEventListener("click", function() {
            let outputDiv = document.getElementById(`output-div-${index}`);

            // إذا لم يكن الـ div موجودًا، أنشئه
            if (!outputDiv) {
                const outputDiv = document.createElement("div");
                outputDiv.id = `output-div-${index}`;
                outputDiv.style.position = "fixed";
                outputDiv.style.top = "0";
                outputDiv.style.left = "0";
                outputDiv.style.width = "100%";
                outputDiv.style.height = "100%";
                outputDiv.style.background = "white";
                outputDiv.style.zIndex = "1000";
                outputDiv.style.display = "flex";
                outputDiv.style.justifyContent = "center";
                outputDiv.classList.add("my-class"); // إضافة الكلاس
                
                // إنشاء الزر
                const closeButton = document.createElement("button");
                closeButton.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
                closeButton.style.position = "absolute";
                closeButton.style.top = "5px";
                closeButton.classList.add("close-btn"); // إضافة الكلاس هنا
                closeButton.addEventListener("click", function() {
                    outputDiv.remove();
                });
                
                // إضافة الزر إلى الـ div
                outputDiv.appendChild(closeButton);
                
                // إضافة الحدث للـ div
                outputDiv.addEventListener("mousemove", function (event) {
                    if (event.clientY <= 0) {
                        // إذا كان المؤشر ضمن 20px من الأعلى
                        closeButton.style.margin = "100px"; // تغيير استايل الزر
                        closeButton.style.color = "white";
                        
                        // إزالة الاستايل بعد 3 ثوانٍ
                        clearTimeout(outputDiv._hideTimer);
                        outputDiv._hideTimer = setTimeout(() => {
                            closeButton.style.margin = ""; // إزالة الاستايل
                            closeButton.style.color = "";
                        }, 3000);
                    }
                });
                
                // إضافة الـ div إلى المستند
                document.body.appendChild(outputDiv);

                const outputFrame = document.createElement("iframe");
                outputFrame.id = `output-${index}`;
                outputFrame.style.width = "100%";
                outputFrame.style.height = "100%";
                outputFrame.style.border = "none";

                outputDiv.appendChild(closeButton);
                outputDiv.appendChild(outputFrame);
                document.body.appendChild(outputDiv);
            }

            // اكتب الكود في الـ iframe
            const code = editor.getValue();
            const outputFrame = document.getElementById(`output-${index}`);
            outputFrame.contentWindow.document.open();
            outputFrame.contentWindow.document.write(code);
            outputFrame.contentWindow.document.close();
        });

        // إضافة الأزرار إلى الحاوية
        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(shareButton);
        buttonsContainer.appendChild(runButton);

        // إضافة الأزرار أسفل كل محرر
        textarea.parentElement.appendChild(buttonsContainer);
    });
};











// ------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    // عند الضغط على زر
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس "cold" من كل الأزرار
            buttons.forEach(btn => btn.classList.remove('cold'));
            // إضافة الكلاس "cold" للزر الحالي
            button.classList.add('cold');

            // إخفاء كل الديفات
            contents.forEach(content => content.classList.remove('active'));
            // عرض الديف المستهدف
            const target = button.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
});



// -----------------------------------------------------------------------------------------------------    


document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.wave-button');
    
    elements.forEach(element => {

      function createRipple(e) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        let x, y;
        if (e.clientX && e.clientY) {
          x = e.clientX - rect.left - size / 2;
          y = e.clientY - rect.top - size / 2;
        } 
        else if (e.touches && e.touches[0]) {
          x = e.touches[0].clientX - rect.left - size / 2;
          y = e.touches[0].clientY - rect.top - size / 2;
        }

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600); // مدة الأنيميشن للموجة
      }

      element.addEventListener('mousedown', (e) => {
        createRipple(e); // أنشئ الموجة عند الضغط
      });

      element.addEventListener('touchstart', (e) => {
        createRipple(e); // أنشئ الموجة عند اللمس
      });
    });
  });
