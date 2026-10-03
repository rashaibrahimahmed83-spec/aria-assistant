const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');
const chatContainer = document.getElementById('chat-container');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.textContent = "متصفحك لا يدعم التعرف على الصوت، استخدم Google Chrome";
    micBtn.disabled = true;
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let isListening = false;

    micBtn.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });

    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        statusText.textContent = "أنا أستمع إليك الآن...";
    };

    recognition.onresult = (event) => {
        const userText = event.results[0][0].transcript;
        appendMessage(userText, 'user-message');
        processAriaResponse(userText);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        statusText.textContent = "حدث خطأ في التعرف على الصوت، حاول مجدداً.";
    };

    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('listening');
        statusText.textContent = "اضغط للتحدث";
    };
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function processAriaResponse(input) {
    let reply = "أهلاً بك في مكتبة كلية الهندسة بشبين الكوم[cite: 1, 2, 3]. يمكنني مساعدتك في معرفة مواعيد العمل، أسماء الأخصائيين، القاعات، أو خطوات الاستعارة الإلكترونية[cite: 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].";
    const q = input.toLowerCase();

    // مواعيد العمل
    if (q.includes('مواعيد') || q.includes('وقت') || q.includes('ساعات') || q.includes('تفتح') || q.includes('تغلق') || q.includes('الساعة') || q.includes('متى')) {
        reply = "تفتح المكتبة أبوابها يومياً من الساعة 8:45 صباحاً وحتى 1:45 ظهراً[cite: 1].";
    } 
    // الاستعارة والإعارة
    else if (q.includes('إعارة') || q.includes('استعارة') || q.includes('كتاب') || q.includes('كتب') || q.includes('أسبوع')) {
        reply = "مدة الاستعارة الإلكترونية أسبوع قابل للتجديد، وعدد الكتب المسموح بإعارتها كتاب واحد أسبوعياً من خلال الإيميل الأكاديمي عبر موقع المكتبة[cite: 2, 3].";
    } 
    // الأستاذة أسماء (مدني وإنتاج)
    else if (q.includes('مدني') || q.includes('إنتاج') || q.includes('أسماء')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة المدنية أو قسم هندسة الإنتاج والتصميم، توجه إلى الأستاذة أسماء عبد الفتاح عرب[cite: 1, 6, 11].";
    } 
    // الأستاذة رشا (كهربية وقوى)
    else if (q.includes('كهربية') || q.includes('قوى') || q.includes('رشا')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة الكهربية أو قسم هندسة القوى الميكانيكية، توجه إلى الأستاذة رشا أحمد إبراهيم[cite: 1, 6, 10].";
    } 
    // الأستاذة دينا (علوم أساسية، معمارية، رسائل)
    else if (q.includes('معمارية') || q.includes('علوم') || q.includes('رسائل') || q.includes('دينا')) {
        reply = "في حالة السؤال عن كتب العلوم الأساسية، الرسائل العلمية، أو الهندسة المعمارية، توجه إلى الأستاذة دينا عبد الفتاح ناصف[cite: 1, 6, 9].";
    } 
    // المدير عفيفي
    else if (q.includes('مدير') || q.includes('عفيفي')) {
        reply = "مدير إدارة مكتبة كلية الهندسة هو الأستاذ عفيفي محمد عوض[cite: 6, 13, 14].";
    } 
    // القاعات والأماكن
    else if (q.includes('قاعة') || q.includes('قاعات') || q.includes('دور') || q.includes('أماكن') || q.includes('مساحة')) {
        reply = "يوجد بالمكتبة قاعتين: قاعة بالدور الأرضي لقسم قوة ميكانيكية وتحتوي على العلوم الأساسية والمعمارية والرسائل، والقاعة الرئيسية بالدور الأول العلوي للأقسام الهندسية الأخرى[cite: 1, 7].";
    }
    // الموقع والرابط
    else if (q.includes('موقع') || q.includes('رابط') || q.includes('إلكتروني')) {
        reply = "يمكنك زيارة موقع المكتبة عبر الرابط الرسمي المتاح على بوابة الكلية أو موقع الاستعارة عن بعد[cite: 2, 3, 5].";
    }

    appendMessage(reply, 'aria-message');
    speakText(reply);
}

function speakText(text) {
    if (typeof responsiveVoice !== "undefined") {
        responsiveVoice.speak(text, "Arabic Female", { rate: 1.0 });
    } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
    }
}
