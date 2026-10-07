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
        // تفعيل الصوت وإلغاء أي نطق قديم عند الضغط
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (!isListening) {
            try {
                recognition.start();
            } catch (e) {
                console.log(e);
            }
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
        console.error("خطأ التعرف الصوتي:", event.error);
        if (event.error === 'no-speech') {
            statusText.textContent = "لم يتم رصد صوت، حاول مرة أخرى.";
        } else {
            statusText.textContent = "حدث خطأ، حاول مجدداً.";
        }
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
    let reply = "أهلاً بك في مكتبة كلية الهندسة بشبين الكوم. بصفتي مسؤولة الاستقبال، كيف يمكنني مساعدتك اليوم؟";
    const q = input.toLowerCase();

    // 1. التحية والسؤال عن الحال أو السؤال العام
    if (q.includes('ازيك') || q.includes('كيفك') || q.includes('اخبارك') || q.includes('عامل ايه') || q.includes('عامل إيه')) {
        reply = "الحمد لله أنا بخير! أنا مسؤولة الاستقبال هنا، اسألني عن مواعيد المكتبة، أو الأقسام، أو شروط الاستعارة.";
    }
    // 2. التعريف بآريا
    else if (q.includes('دورك') || q.includes('انت مين') || q.includes('مين انت') || q.includes('وظيفتك') || q.includes('مين') || q.includes('اسمك')) {
        reply = "أنا آريا، مسؤولة الاستقبال الذكية في مكتبة كلية الهندسة بشبين الكوم، ومهمتي هي مساعدتك في معرفة مواعيد المكتبة، أماكن الأقسام، وإجراءات الإعارة.";
    }
    // 3. مواعيد العمل
    else if (q.includes('مواعيد') || q.includes('وقت') || q.includes('ساعات') || q.includes('تفتح') || q.includes('تغلق') || q.includes('متى')) {
        reply = "تفتح المكتبة أبوابها من الأحد إلى الخميس، من الساعة الثامنة إلا ربع صباحاً، وحتى الواحدة إلا ربع ظهراً.";
    } 
    // 4. الاستعارة والإعارة
    else if (q.includes('إعارة') || q.includes('استعارة') || q.includes('كتاب') || q.includes('كتب')) {
        reply = "مدة الاستعارة الإلكترونية أسبوع قابل للتجديد، وعدد الكتب المسموح بإعارتها كتاب واحد أسبوعياً من خلال الإيميل الأكاديمي.";
    } 
    // 5. الأستاذة أسماء (مدني وإنتاج)
    else if (q.includes('مدني') || q.includes('إنتاج') || q.includes('أسماء')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة المدنية أو قسم هندسة الإنتاج والتصميم، توجه إلى الأستاذة أسماء عبد الفتاح عرب.";
    } 
    // 6. الأستاذة رشا (كهربية وقوى)
    else if (q.includes('كهربية') || q.includes('قوى') || q.includes('رشا')) {
        reply = "في حالة السؤال عن كتب في قسم الهندسة الكهربية أو قسم هندسة القوى الميكانيكية، توجه إلى الأستاذة رشا أحمد إبراهيم.";
    } 
    // 7. الأستاذة دينا (علوم أساسية، معمارية، رسائل)
    else if (q.includes('معمارية') || q.includes('علوم') || q.includes('رسائل') || q.includes('دينا')) {
        reply = "في حالة السؤال عن كتب العلوم الأساسية، الرسائل العلمية، أو الهندسة المعمارية، توجه إلى الأستاذة دينا عبد الفتاح ناصف.";
    } 
    // 8. المدير عفيفي
    else if (q.includes('مدير') || q.includes('عفيفي')) {
        reply = "مدير إدارة مكتبة كلية الهندسة هو الأستاذ عفيفي محمد عوض.";
    } 
    // 9. القاعات والأماكن
    else if (q.includes('قاعة') || q.includes('قاعات') || q.includes('دور') || q.includes('أماكن')) {
        reply = "يوجد بالمكتبة قاعتان: قاعة بالدور الأرضي بقسم قوة ميكانيكية، والقاعة الرئيسية بالدور الأول العلوي للأقسام الهندسية الأخرى.";
    }

    appendMessage(reply, 'aria-message');
    speakText(reply);
}

// دالة النطق المباشرة والمدعومة من المتصفح
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95; 
        utterance.pitch = 1.0;

        // محاولة اختيار صوت عربي تلقائياً إن وجد في المتصفح
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.includes('ar') || v.lang.includes('AR'));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
}
