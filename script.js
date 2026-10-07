const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');
const chatContainer = document.getElementById('chat-container');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// ضمان تحميل الأصوات في المتصفح
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

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
        // تفاعل إجباري لفتح قناة الصوت في المتصفح
        unlockAudio();
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

function unlockAudio() {
    if ('speechSynthesis' in window) {
        const dummy = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(dummy);
    }
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function processAriaResponse(input) {
    let reply = "أهلاً بك في مكتبة كلية الهندسة بشبين الكوم. بصفتي مسؤولة الاستقبال، كيف يمكنني مساعدتك اليوم؟";
    const q = input.toLowerCase();

    // مواعيد العمل
    if (q.includes('مواعيد') || q.includes('وقت') || q.includes('ساعات') || q.includes('تفتح') || q.includes('تغلق') || q.includes('متى')) {
        reply = "تفتح المكتبة أبوابها من الأحد إلى الخميس، من الساعة الثامنة إلا ربع صباحاً، وحتى الواحدة إلا ربع ظهراً.";
    } 
    // الاستعارة والإعارة
    else if (q.includes('إعارة') || q.includes('استعارة') || q.includes('كتاب') || q.includes('كتب')) {
        reply = "مدة الاستعارة الإلكترونية أسبوع قابل للتجديد، وعدد الكتب المسموح بإعارتها كتاب واحد أسبوعياً من خلال الإيميل الأكاديمي.";
    } 
    // الأستاذة أسماء (مدني وإنتاج)
    else if (q.includes('مدني') || q.includes('إنتاج') || q.includes('أسماء')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة المدنية أو قسم هندسة الإنتاج والتصميم، توجه إلى الأستاذة أسماء عبد الفتاح عرب.";
    } 
    // الأستاذة رشا (كهربية وقوى)
    else if (q.includes('كهربية') || q.includes('قوى') || q.includes('رشا')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة الكهربية أو قسم هندسة القوى الميكانيكية، توجه إلى الأستاذة رشا أحمد إبراهيم.";
    } 
    // الأستاذة دينا (علوم أساسية، معمارية، رسائل)
    else if (q.includes('معمارية') || q.includes('علوم') || q.includes('رسائل') || q.includes('دينا')) {
        reply = "في حالة السؤال عن كتب العلوم الأساسية، الرسائل العلمية، أو الهندسة المعمارية، توجه إلى الأستاذة دينا عبد الفتاح ناصف.";
    } 
    // المدير عفيفي
    else if (q.includes('مدير') || q.includes('عفيفي')) {
        reply = "مدير إدارة مكتبة كلية الهندسة هو الأستاذ عفيفي محمد عوض.";
    } 
    // القاعات والأماكن
    else if (q.includes('قاعة') || q.includes('قاعات') || q.includes('دور') || q.includes('أماكن')) {
        reply = "يوجد بالمكتبة قاعتان: قاعة بالدور الأرضي بقسم قوة ميكانيكية، والقاعة الرئيسية بالدور الأول العلوي للأقسام الهندسية الأخرى.";
    }

    appendMessage(reply, 'aria-message');
    speakText(reply);
}

// دالة النطق المحدثة
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95; 
        utterance.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.includes('ar') || v.lang.includes('AR'));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
}
