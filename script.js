window.addEventListener("load", function () {
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
});











document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    const line = document.querySelector('.line');

    // تحديث موقع الخط
    const updateLinePosition = (button) => {
        const rect = button.getBoundingClientRect();
        const parentRect = button.parentElement.getBoundingClientRect();
        line.style.width = `${rect.width}px`;
        line.style.left = `${rect.left - parentRect.left}px`;
    };

    // وظيفة لتغيير التبويب النشط
    const activateTab = (targetId) => {
        buttons.forEach(btn => btn.classList.remove('cold'));
        contents.forEach(content => content.classList.remove('active'));

        const targetButton = document.querySelector(`.tab-button[data-target="${targetId}"]`);
        const targetContent = document.getElementById(targetId);

        if (targetButton && targetContent) {
            targetButton.classList.add('cold');
            targetContent.classList.add('active');
            updateLinePosition(targetButton);
        }
    };

    // التحقق من وجود hash في الرابط لعرض الديف المناسب
    const hash = window.location.hash;
    if (hash) {
        activateTab(hash.slice(1));
    } else {
        buttons[0].classList.add('cold');
        contents[0].classList.add('active');
        updateLinePosition(buttons[0]);
    }

    // عند الضغط على زر
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            activateTab(target);
            window.history.pushState({ target }, '', `#${target}`);
        });
    });

    // التعامل مع زر الرجوع أو التقدم في المتصفح
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.target) {
            activateTab(state.target);
        } else if (window.location.hash) {
            activateTab(window.location.hash.slice(1));
        } else {
            activateTab(buttons[0].getAttribute('data-target'));
        }
    });

    // ضبط موقع الخط عند إعادة التحميل
    window.addEventListener('resize', () => {
        const activeButton = document.querySelector('.tab-button.cold');
        if (activeButton) updateLinePosition(activeButton);
    });
});




// -----------------------------------------------------------------------------------------------------    


document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.waveer-button');
    
    elements.forEach(element => {

      let isRippleActive = false; // منع الموجة من التكرار إذا كانت مفعلة بالفعل

      function createRipple(e) {
        if (isRippleActive) return; // إذا كانت الموجة مفعلة بالفعل لا تنشأ موجة جديدة

        isRippleActive = true; // تفعيل الموجة

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

        // إزالة الموجة بعد انتهاء الأنيميشن
        setTimeout(() => {
          ripple.remove();
          isRippleActive = false; // إعادة تفعيل إمكانية إضافة موجة جديدة
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






  function confirmDownload(fileName) {
    const confirmation = confirm('Android تنزيل التطبيق');
    if (confirmation) {
      downloadFile(fileName);
    }
  }

  function downloadFile(fileName) {
    const link = document.createElement('a');
    link.href = `./path/to/your/files/${fileName}`;  // قم بتحديد مسار الملفات هنا
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
