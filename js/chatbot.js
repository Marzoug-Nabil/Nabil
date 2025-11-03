// AI Chatbot for Portfolio Website
// Author: Marzoug Nabil

class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.setupKeywordResponses();

        // Add welcome message after a short delay
        setTimeout(() => {
            this.addBotMessage("Hi! I'm Nabil's AI assistant. I can help you learn about his experience, skills, projects, and publications. What would you like to know?");
        }, 500);
    }

    createChatbotUI() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div class="chatbot-button" id="chatbot-button">
                    <i class="fas fa-robot"></i>
                    <span class="chatbot-badge">AI</span>
                </div>
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-header-content">
                            <i class="fas fa-robot"></i>
                            <div>
                                <h4>Portfolio Assistant</h4>
                                <span class="chatbot-status">Online</span>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbot-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chatbot-messages" id="chatbot-messages">
                        <!-- Messages will be added here -->
                    </div>
                    <div class="chatbot-input-area">
                        <input
                            type="text"
                            id="chatbot-input"
                            placeholder="Ask me anything about Nabil..."
                            autocomplete="off"
                        />
                        <button id="chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="chatbot-suggestions" id="chatbot-suggestions">
                        <button class="suggestion-btn" data-question="What is your experience?">Experience</button>
                        <button class="suggestion-btn" data-question="What are your skills?">Skills</button>
                        <button class="suggestion-btn" data-question="Tell me about your publications">Publications</button>
                        <button class="suggestion-btn" data-question="How can I contact you?">Contact</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('chatbot-button');
        const close = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const suggestions = document.querySelectorAll('.suggestion-btn');

        button.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.handleUserMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });

        suggestions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                input.value = question;
                this.handleUserMessage();
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');

        if (this.isOpen) {
            window.classList.add('open');
            button.classList.add('open');
            document.getElementById('chatbot-input').focus();
        } else {
            window.classList.remove('open');
            button.classList.remove('open');
        }
    }

    handleUserMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addUserMessage(message);
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and respond
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 800);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageHTML = `
            <div class="chat-message user-message">
                <div class="message-content">${this.escapeHtml(message)}</div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageHTML = `
            <div class="chat-message bot-message">
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">${message}</div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="chat-message bot-message typing-indicator" id="typing-indicator">
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupKeywordResponses() {
        this.responses = {
            // Greeting patterns
            greeting: {
                patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
                responses: [
                    "Hello! I'm here to help you learn about Nabil's experience and expertise. What would you like to know?",
                    "Hi there! Feel free to ask me about Nabil's skills, projects, or experience in AI and Machine Learning.",
                    "Hey! I can tell you about Nabil's work in Quantum ML, cybersecurity, or any of his projects. What interests you?"
                ]
            },

            // Experience questions
            experience: {
                patterns: ['experience', 'work', 'job', 'position', 'career', 'worked', 'employment'],
                response: "Nabil has extensive experience in AI and Machine Learning:\n\n<strong>1. Quantum ML Researcher</strong> at Prime Lab, University of Moncton (Canada)\n- Worked on quantum machine learning for cancer detection\n- Developed quantum neural networks for medical image classification\n- Technologies: Python, TensorFlow, PennyLane, Qiskit\n\n<strong>2. AI Researcher Intern</strong> at Moncton University (Canada)\n- Led analysis of Cicdarknet-2020 dataset for cybersecurity\n- Achieved state-of-the-art results in network traffic classification\n- Technologies: Python, Scikit-learn, SHAP, Ensemble Learning\n\n<strong>3. ML Intern</strong> at 3d Smart Factory (Morocco)\n- Implemented credit card fraud detection system\n- Used advanced classification algorithms and data preprocessing\n\nWould you like to know more about any specific role?"
            },

            // Skills questions
            skills: {
                patterns: ['skill', 'technology', 'technologies', 'tool', 'framework', 'language', 'programming', 'know'],
                response: "Nabil has a diverse and comprehensive skill set:\n\n<strong>Core Programming:</strong> Python, R\n\n<strong>ML Frameworks:</strong> TensorFlow, PyTorch, Scikit-learn\n\n<strong>Quantum Computing:</strong> PennyLane, Qiskit, Quantum Neural Networks\n\n<strong>Deep Learning:</strong> Neural Networks, CNNs, RNNs\n\n<strong>NLP:</strong> NLTK, spaCy, Transformers\n\n<strong>Big Data:</strong> Apache Hadoop, Apache Spark\n\n<strong>Cloud:</strong> AWS, Google Cloud\n\n<strong>Data Analysis:</strong> Pandas, NumPy, Matplotlib, Seaborn\n\nFor a complete list, check out the <a href='skills.html'>Skills page</a>!"
            },

            // Quantum ML questions
            quantum: {
                patterns: ['quantum', 'qml', 'quantum machine learning', 'quantum computing', 'pennylane', 'qiskit'],
                response: "Nabil specializes in Quantum Machine Learning! His work includes:\n\n<strong>Quantum ML for Cancer Detection</strong>\n- Integration of quantum computing with machine learning\n- Medical image classification using quantum neural networks\n- Working with colon polyps and skin cancer segmentation\n- Technologies: PennyLane, Qiskit, TensorFlow\n\n<strong>Publications:</strong>\n- <em>Quantum-Enhanced Dual-Backbone Architecture for Accurate Gastrointestinal Disease Detection Using Endoscopic Imaging</em> (BioMedInformatics, 2025)\n\nThis cutting-edge research demonstrates the potential of quantum computing to enhance accuracy in medical image classification!"
            },

            // Publications questions
            publications: {
                patterns: ['publication', 'paper', 'research', 'published', 'article', 'blog'],
                response: "Nabil has published several research papers and technical articles:\n\n<strong>Academic Publications:</strong>\n\n1. <a href='https://doi.org/10.3390/biomedinformatics5030051' target='_blank'>Quantum-Enhanced Dual-Backbone Architecture for Accurate Gastrointestinal Disease Detection</a> (BioMedInformatics, 2025)\n\n2. <a href='https://www.researchgate.net/publication/386036129_Optimizing_Spare_Parts_Inventory_Management_Using_Genetic_Algorithm' target='_blank'>Optimizing Spare Parts Inventory Management Using Genetic Algorithm</a> (ICOA Conference, 2024)\n\n3. <a href='https://easychair.org/publications/preprint/xCx5' target='_blank'>LIDarknet: Experimenting the Power of Ensemble Learning in Network Traffic Classification</a> (IEEE Cyber Science, 2024)\n\n<strong>Technical Blogs:</strong>\n- <a href='https://medium.com/@nabilmarzoug49/data-science-web-scraping-with-python-b4b1d7655242' target='_blank'>Web Scraping with Python</a>\n- <a href='https://medium.com/@nabilmarzoug49/mastering-decision-trees-for-classification-unleashing-their-full-potential-13c018cbbfb5' target='_blank'>Mastering Decision Trees</a>"
            },

            // Projects questions
            projects: {
                patterns: ['project', 'work on', 'built', 'developed', 'created'],
                response: "Nabil has worked on several impressive projects:\n\n<strong>1. Quantum ML for Cancer Detection</strong>\n- Medical image classification using quantum computing\n- Colon polyps classification and skin cancer segmentation\n- Technologies: Python, TensorFlow, PennyLane, Qiskit\n\n<strong>2. Cybersecurity Research</strong>\n- Network traffic classification for threat detection\n- State-of-the-art results using ensemble learning\n- Technologies: Scikit-learn, XGBoost, SHAP\n\n<strong>3. Credit Card Fraud Detection</strong>\n- ML-based fraud detection system\n- Advanced classification algorithms\n- Technologies: Python, Scikit-learn, ensemble methods\n\nCheck the <a href='experience.html'>Experience page</a> for more details!"
            },

            // Contact questions
            contact: {
                patterns: ['contact', 'email', 'reach', 'get in touch', 'connect', 'linkedin', 'github'],
                response: "You can reach Nabil through:\n\n<strong>Email:</strong> <a href='mailto:nabilmarzoug7@gmail.com'>nabilmarzoug7@gmail.com</a> or emn3789@umoncton.ca\n\n<strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/marzoug-nabil-427103229/' target='_blank'>Marzoug Nabil</a>\n\n<strong>GitHub:</strong> <a href='https://github.com/Marzoug-Nabil' target='_blank'>Marzoug-Nabil</a>\n\n<strong>Medium:</strong> <a href='https://medium.com/@nabilmarzoug49' target='_blank'>@nabilmarzoug49</a>\n\nVisit the <a href='contact.html'>Contact page</a> for more information!"
            },

            // Education questions
            education: {
                patterns: ['education', 'degree', 'university', 'study', 'studied', 'school', 'academic'],
                response: "Nabil has a strong academic background in AI and Machine Learning. He has conducted research at the University of Moncton in Canada, where he worked on cutting-edge projects in Quantum Machine Learning and Cybersecurity.\n\nHe holds several certifications including:\n- Exploratory Data Analysis for Machine Learning (IBM)\n- Foundations: Data, Data, Everywhere (Google)\n- Computer Vision (Kaggle)\n- Machine Learning for Leaders (AWS)\n\nCheck out the <a href='skills.html'>Skills page</a> for all certifications!"
            },

            // Specialization questions
            specialization: {
                patterns: ['specialize', 'specialization', 'expertise', 'expert in', 'focus', 'area'],
                response: "Nabil specializes in several key areas:\n\n<strong>1. Quantum Machine Learning</strong>\n- Research and development in quantum computing applications\n- Medical image classification and analysis\n\n<strong>2. Cybersecurity & ML</strong>\n- Network traffic analysis and threat detection\n- Ensemble learning for security applications\n\n<strong>3. Deep Learning</strong>\n- Neural networks for image classification and NLP\n- Advanced model architectures\n\n<strong>4. Research & Innovation</strong>\n- Publishing research papers\n- Contributing to AI/ML advancement\n\nHe's particularly interested in opportunities related to Quantum ML, Medical Image Analysis, and Cybersecurity!"
            },

            // CV/Resume questions
            cv: {
                patterns: ['cv', 'resume', 'curriculum', 'download'],
                response: "You can download Nabil's CV in two languages:\n\n<a href='Resume_EN.pdf' class='chatbot-link' download>Download CV (English)</a>\n\n<a href='CV_FR.pdf' class='chatbot-link' download>Download CV (Français)</a>\n\nThe CV includes detailed information about his experience, education, skills, and publications."
            },

            // About/Who questions
            about: {
                patterns: ['who are you', 'who is', 'about you', 'about nabil', 'tell me about', 'introduce'],
                response: "Marzoug Nabil is an AI and Machine Learning Engineer specializing in Quantum Computing and Deep Learning. He's passionate about applying cutting-edge technology to solve real-world problems.\n\n<strong>Key Highlights:</strong>\n- Quantum ML researcher at University of Moncton\n- Published multiple research papers in top conferences\n- Expertise in TensorFlow, PyTorch, PennyLane, and Qiskit\n- Strong foundation in statistics, mathematics, and computer science\n- Active technical blogger on Medium\n\nHis work spans quantum machine learning, cybersecurity, and medical image analysis. Would you like to know more about any specific area?"
            },

            // Help questions
            help: {
                patterns: ['help', 'what can you do', 'how can you help', 'options'],
                response: "I can help you learn about Nabil's:\n\n• <strong>Experience</strong> - Professional roles and projects\n• <strong>Skills</strong> - Technical expertise and tools\n• <strong>Publications</strong> - Research papers and blogs\n• <strong>Projects</strong> - Quantum ML, cybersecurity, and more\n• <strong>Contact</strong> - How to get in touch\n• <strong>Education</strong> - Academic background and certifications\n• <strong>Specializations</strong> - Areas of expertise\n\nJust ask me anything! For example:\n- 'What is your experience?'\n- 'What are your quantum ML skills?'\n- 'How can I contact you?'"
            }
        };
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Check for each category
        for (const [category, data] of Object.entries(this.responses)) {
            const matched = data.patterns.some(pattern => lowerMessage.includes(pattern));

            if (matched) {
                if (Array.isArray(data.responses)) {
                    // Random response from array
                    return data.responses[Math.floor(Math.random() * data.responses.length)];
                } else {
                    return data.response;
                }
            }
        }

        // Default response if no match
        return "That's an interesting question! I can tell you about Nabil's experience, skills, publications, projects, or how to contact him. You can also visit the navigation menu to explore different sections of the portfolio. What would you like to know more about?";
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});
