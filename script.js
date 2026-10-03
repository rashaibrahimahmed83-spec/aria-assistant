const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');
const chatContainer = document.getElementById('chat-container');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synthesis = window.speechSynthesis;

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
        // تفاعل إضافي لضمان تفعيل الصوت في المتصفح
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
    if (synthesis) {
        const dummy = new SpeechSynthesisUtterance("");
        synthesis.speak(dummy);
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
    const query = input.toLowerCase();

    if (query.includes('مواعيد') || query.includes('وقت') || query.includes('تفتح') || query.includes('ساعات')) {
        reply = "تفتح المكتبة أبوابها يومياً من الساعة الثامنة إلا ربع صباحاً وحتى الواحدة إلا ربع ظهراً.";
    } 
    else if (query.includes('إعارة') || query.includes('استعارة') || query.includes('كتاب')) {
        reply = "مدة الاستعارة الإلكترونية أسبوع قابل للتجديد، وعدد الكتب المسموح بإعارتها كتاب واحد أسبوعياً من خلال الإيميل الأكاديمي.";
    } 
    else if (query.includes('مدنية') || query.includes('إنتاج') || query.includes('أسماء')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة المدنية أو قسم هندسة الإنتاج والتصميم، توجه إلى الأستاذة أسماء عبد الفتاح عرب.";
    } 
    else if (query.includes('كهربية') || query.includes('قوى') || query.includes('رشا')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة الكهربية أو قسم هندسة القوى الميكانيكية، توجه إلى الأستاذة رشا أحمد إبراهيم.";
    } 
    else if (query.includes('معمارية') || query.includes('علوم أساسية') || query.includes('رسائل') || query.includes('دينا')) {
        reply = "في حالة السؤال عن كتب العلوم الأساسية، الرسائل العلمية، أو الهندسة المعمارية، توجه إلى الأستاذة دينا عبد الفتاح ناصف.";
    } 
    else if (query.includes('مدير') || query.includes('عفيفي')) {
        reply = "مدير إدارة مكتبة كلية الهندسة هو الأستاذ عفيفي محمد عوض.";
    } 
    else if (query.includes('قاعات') || query.includes('دور')) {
        reply = "يوجد بالمكتبة قاعتان: قاعة بالدور الأرضي بقسم قوة ميكانيكية، والقاعة الرئيسية بالدور الأول العلوي للأقسام الهندسية الأخرى.";
    }

    appendMessage(reply, 'aria-message');
    speakText(reply);
}

function speakText(text) {
    if (synthesis) {
        synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        
        // محاولة اختيار صوت عربي متاح تلقائياً
        const voices = synthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }

        synthesis.speak(utterance);
    }
}
