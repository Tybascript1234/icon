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

        const runButton = document.createElement("button");
        runButton.innerHTML = '<ion-icon name="open-outline"></ion-icon>';
        runButton.addEventListener("click", function() {
            let outputDiv = document.getElementById(`output-div-${index}`);

            // إذا لم يكن الـ div موجودًا، أنشئه
            if (!outputDiv) {
                outputDiv = document.createElement("div");
                outputDiv.id = `output-div-${index}`;
                outputDiv.style.position = "fixed";
                outputDiv.style.top = "0";
                outputDiv.style.left = "0";
                outputDiv.style.width = "100%";
                outputDiv.style.height = "100%";
                outputDiv.style.background = "white";
                outputDiv.style.zIndex = "1000";

                const closeButton = document.createElement("button");
                closeButton.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
                closeButton.style.position = "absolute";
                closeButton.style.top = "5px";
                closeButton.style.right = "5px";
                closeButton.classList.add("close-btn"); // إضافة الكلاس هنا
                closeButton.addEventListener("click", function() {
                    outputDiv.remove();
                });

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
