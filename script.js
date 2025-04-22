window.addEventListener("load", function () {
    // حدد جميع عناصر textarea مع الفئة "editor"
    const editors = document.querySelectorAll(".editor");

    // مر على كل عنصر وأضف محررًا وأزرارًا
    editors.forEach((textarea, index) => {
        const editor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            mode: "javascript",
            theme: "default",
            extraKeys: { "Ctrl-Space": "autocomplete" },
            hintOptions: { completeSingle: false }
        });

        editor.on("inputRead", function(cm, change) {
            if (change.text[0] && /[a-zA-Z0-9$_]/.test(change.text[0])) {
                cm.showHint({ completeSingle: false });
            }
        });

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "home-work-button";

        // زر النسخ
        const copyButton = document.createElement("button");
        copyButton.innerHTML = '<ion-icon name="copy"></ion-icon>';
        copyButton.addEventListener("click", function () {
            const code = editor.getValue();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    const originalContent = copyButton.innerHTML;
                    copyButton.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
                    setTimeout(() => {
                        copyButton.innerHTML = originalContent;
                    }, 1000);
                }).catch(err => {
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

        // زر المشاركة
        const shareButton = document.createElement("button");
        shareButton.innerHTML = '<ion-icon name="share-social"></ion-icon>';
        shareButton.addEventListener("click", function () {
            const code = editor.getValue();
            if (navigator.share) {
                navigator.share({
                    title: "مشاركة الكود",
                    text: code
                }).catch(err => {
                    alert("فشل المشاركة.");
                });
            } else {
                alert("ميزة المشاركة غير مدعومة في هذا المتصفح.");
            }
        });

        // زر التشغيل
        const runButton = document.createElement("button");
        runButton.innerHTML = '<ion-icon name="open-outline"></ion-icon>';
        runButton.addEventListener("click", function () {
            const outputDiv = document.getElementById("output-div");
            const outputFrame = document.getElementById("output-frame");
            const closeButton = outputDiv.querySelector(".close-btn");
            const reloadButton = outputDiv.querySelector(".reload-btn");
            const copyFrameUrlButton = document.getElementById("copy-frame-url");
            const shareFrameUrlButton = document.getElementById("share-frame-url");
            const fullscreenButton = document.getElementById("fullscreen-frame");

            // عرض الـ div
            outputDiv.style.display = "block";

            // دالة لتحميل المحتوى في الـ iframe
            const loadContent = () => {
                const code = editor.getValue();
                outputFrame.contentWindow.document.open();
                outputFrame.contentWindow.document.write(code);
                outputFrame.contentWindow.document.close();
            };

            // تحميل المحتوى أول مرة
            loadContent();

            // إضافة حدث لإغلاق النافذة
            closeButton.addEventListener("click", function () {
                outputDiv.style.display = "none";
            });

            // إعادة تحميل المحتوى
            reloadButton.addEventListener("click", function () {
                loadContent();
                setTimeout(() => {
                    reloadButton.style.transform = "rotate(0deg)";
                }, 500);
            });

            // توليد رابط Blob للفريم
            const generateFrameBlobUrl = () => {
                const code = editor.getValue();
                const blob = new Blob([code], { type: 'text/html' });
                return URL.createObjectURL(blob);
            };

            // زر نسخ رابط الفريم
            copyFrameUrlButton.addEventListener("click", () => {
                const blobUrl = generateFrameBlobUrl();
                navigator.clipboard.writeText(blobUrl).then(() => {
                    copyFrameUrlButton.innerHTML = 'Copied';
                    setTimeout(() => {
                        copyFrameUrlButton.innerHTML = 'Copy link';
                    }, 1000);
                }).catch(err => {
                    alert("فشل نسخ الرابط.");
                });
            });

            // زر مشاركة رابط الفريم
            shareFrameUrlButton.addEventListener("click", () => {
                const blobUrl = generateFrameBlobUrl();
                if (navigator.share) {
                    navigator.share({
                        title: "عرض الكود",
                        url: blobUrl
                    }).catch(err => {
                        alert("فشل المشاركة.");
                    });
                } else {
                    alert("مشاركة الرابط غير مدعومة.");
                }
            });

            // زر ملء الشاشة
            fullscreenButton.addEventListener("click", () => {
                if (outputDiv.requestFullscreen) {
                    outputDiv.requestFullscreen();
                } else if (outputDiv.webkitRequestFullscreen) {
                    outputDiv.webkitRequestFullscreen();
                } else if (outputDiv.msRequestFullscreen) {
                    outputDiv.msRequestFullscreen();
                }
            });

            // التفاعل مع الأخطاء في الـ iframe
            const errorConsole = document.getElementById("error-console");
            errorConsole.innerHTML = ""; // تفريغ الأخطاء القديمة
            errorConsole.style.display = "none"; // إخفاء الديف مؤقتًا

            const iframeWindow = outputFrame.contentWindow;

            // إعادة تعريف console.error داخل iframe
            iframeWindow.console.error = function (...args) {
                errorConsole.style.display = "block";

                args.forEach(err => {
                    const errorMessage = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
                    
                    const errorDiv = document.createElement("div");
                    errorDiv.innerHTML = `
                        <button class="xx0">
                            <div id="edw" style="margin-right: 10px;"></diV>
                            <span>${errorMessage}</span>
                        </button>
                    `;
                    
                    errorConsole.appendChild(errorDiv.firstElementChild);
                });
            };

            // التقط أخطاء JavaScript داخل iframe
            iframeWindow.onerror = function (message, source, lineno, colno, error) {
                errorConsole.style.display = "block";
                
                const errorHTML = `
                    <button class="xx0">
                        <div id="edw" style="margin-right: 10px;"></diV>
                        <span>${message} at line ${lineno}, column ${colno}</span>
                    </button>
                `;
                
                errorConsole.insertAdjacentHTML('beforeend', errorHTML);
                return false; // للسماح بإظهار الخطأ أيضًا في console المتصفح العادي
            };

            // استخدم try...catch داخل iframe للتقاط الأخطاء التي تحدث أثناء التحميل
            try {
                outputFrame.contentWindow.eval(editor.getValue());
            } catch (e) {
                console.error("خطأ في الكود داخل الـ iframe:", e);
            }
        });

        // زر فتح ملف متعدد
        const openFileButton = document.createElement("button");
        openFileButton.innerHTML = '<ion-icon name="folder-open"></ion-icon>';
        openFileButton.title = "فتح ملفات من الجهاز";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".txt,.js,.html,.css,.json,.xml";
        fileInput.multiple = true; // السماح بتحميل ملفات متعددة
        fileInput.style.display = "none";

        openFileButton.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            const files = this.files;
            const fileReaders = [];
            let loadedFilesCount = 0;
            let code = '';

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function (e) {
                    loadedFilesCount++;
                    code += e.target.result; // إضافة محتوى الملف إلى المتغير

                    if (loadedFilesCount === files.length) {
                        // عند تحميل جميع الملفات
                        editor.setValue(code);
                        openFileButton.title = `تم تحميل: ${files.length} ملفات`;
                    }
                };

                reader.readAsText(file);
                fileReaders.push(reader);
            }
        });

        // إضافة الأزرار للحاوية
        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(shareButton);
        buttonsContainer.appendChild(runButton);
        buttonsContainer.appendChild(openFileButton);
        buttonsContainer.appendChild(fileInput); // مخفي

        // إلحاق الحاوية بأسفل المحرر
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
    const confirmation = confirm('هل أنت متأكد أنك تريد تنزيل هذا الملف؟');
    if (confirmation) {
      downloadFile(fileName);
    }
  }

  function downloadFile(fileName) {
    const link = document.createElement('a');
    link.href = `./${fileName}`;  // تعديل المسار حسب مكان وجود الملفات
    link.download = fileName;
    link.click();
  }



  
  document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.click-button');
    const allMenus = document.querySelectorAll('.menu3');
    const overlay = document.getElementById('menu-overlay');
  
    buttons.forEach(button => {
      const menuId = button.getAttribute('data-menu');
      const menu3 = document.getElementById(menuId);
  
      button.addEventListener('click', (e) => {
        e.stopPropagation();
      
        // إغلاق القوائم الأخرى
        allMenus.forEach(m => {
          m.style.display = 'none';
        });
      
        // إظهار مؤقت للقائمة لأخذ أبعادها بدقة
        menu3.style.visibility = 'hidden';
        menu3.style.display = 'block';
      
        const rect = button.getBoundingClientRect();
        const menuWidth = menu3.offsetWidth;
        const menuHeight = menu3.offsetHeight;
        const margin = 5;
      
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
      
        let left = rect.left;
        let top = rect.bottom + margin;
      
        if (left + menuWidth > windowWidth) {
          left = windowWidth - menuWidth - margin;
          if (left < 0) left = 0;
        }
      
        if (top + menuHeight > windowHeight) {
          top = rect.top - menuHeight - margin;
          if (top < 0) top = 0;
        }
      
        menu3.style.left = `${left}px`;
        menu3.style.top = `${top}px`;
        menu3.style.visibility = 'visible';
        overlay.style.display = 'block';
      });      
    });
  
    function closeMenus() {
      document.querySelectorAll('.menu3').forEach(menu3 => {
        menu3.style.display = 'none';
      });
      overlay.style.display = 'none';
    }
  
    overlay.addEventListener('mousedown', closeMenus);
    overlay.addEventListener('touchstart', closeMenus);
  });
  

  // الحصول على الأزرار والديف
const showButton = document.getElementById('showButton');
const popupDiv = document.getElementById('popupDiv');
const closeButton = document.getElementById('hide-error-console');

// إظهار الديف عند النقر على زر "أظهر الديف"
showButton.addEventListener('click', () => {
  popupDiv.style.display = 'block';
});

// إغلاق الديف عند النقر على زر "إغلاق"
closeButton.addEventListener('click', () => {
  popupDiv.style.display = 'none';
});
