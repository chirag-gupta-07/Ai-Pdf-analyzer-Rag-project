document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('pdf-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadForm = document.getElementById('upload-form');
    const statusMessage = document.getElementById('upload-status');
    const activeDocName = document.getElementById('active-doc-name');
    const statusDot = document.querySelector('.status-dot');
    
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatForm = document.getElementById('chat-form');
    const chatHistory = document.getElementById('chat-history');
    
    let isUploading = false;
    let isReady = false;

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                showStatus('error', 'Please select a valid PDF file.');
                uploadBtn.disabled = true;
                fileNameDisplay.textContent = 'Click to browse PDF';
                return;
            }
            
            fileNameDisplay.textContent = file.name;
            uploadBtn.disabled = false;
            hideStatus();
        } else {
            fileNameDisplay.textContent = 'Click to browse PDF';
            uploadBtn.disabled = true;
        }
    });

    // Handle File Upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!fileInput.files.length || isUploading) return;
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        isUploading = true;
        uploadBtn.disabled = true;
        fileInput.disabled = true;
        showStatus('processing', '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing and embedding document...');
        
        // Reset chat UI
        disableChat();
        statusDot.classList.remove('active');
        activeDocName.textContent = 'Processing document...';

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showStatus('success', '<i class="fa-solid fa-check"></i> Document ready!');
                activeDocName.textContent = file.name;
                statusDot.classList.add('active');
                enableChat();
                
                // Clear welcome screen if present
                const welcomeScreen = document.querySelector('.welcome-screen');
                if (welcomeScreen) {
                    welcomeScreen.style.display = 'none';
                }
            } else {
                throw new Error(result.detail || 'Upload failed');
            }
        } catch (error) {
            showStatus('error', `<i class="fa-solid fa-circle-exclamation"></i> Error: ${error.message}`);
            activeDocName.textContent = 'Upload failed';
        } finally {
            isUploading = false;
            fileInput.disabled = false;
            // Let the button stay disabled until a new file is chosen
        }
    });

    // Handle Chat
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const query = chatInput.value.trim();
        if (!query || !isReady) return;
        
        // Add user message
        appendMessage('user', query);
        chatInput.value = '';
        
        // Show typing indicator
        const typingId = showTypingIndicator();
        
        // Disable input while fetching
        chatInput.disabled = true;
        sendBtn.disabled = true;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });
            
            const result = await response.json();
            
            // Remove typing indicator
            document.getElementById(typingId).remove();
            
            if (response.ok) {
                appendMessage('bot', result.answer);
            } else {
                appendMessage('bot', `Error: ${result.detail || 'Failed to get answer'}`);
            }
        } catch (error) {
            document.getElementById(typingId).remove();
            appendMessage('bot', `System Error: ${error.message}`);
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    });

    // UI Helpers
    function showStatus(type, htmlContent) {
        statusMessage.className = `status-message ${type}`;
        statusMessage.innerHTML = htmlContent;
    }

    function hideStatus() {
        statusMessage.className = 'status-message hidden';
    }

    function enableChat() {
        isReady = true;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }

    function disableChat() {
        isReady = false;
        chatInput.disabled = true;
        sendBtn.disabled = true;
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'user' 
            ? '<i class="fa-solid fa-user"></i>' 
            : '<i class="fa-solid fa-robot"></i>';
            
        // Use marked.js if available for markdown, otherwise plain text
        let formattedText = '';
        if (typeof marked !== 'undefined') {
            formattedText = marked.parse(text);
        } else {
            formattedText = text.replace(/\n/g, '<br>');
        }
        
        messageDiv.innerHTML = `
            <div class="avatar">${avatar}</div>
            <div class="bubble markdown-body">${formattedText}</div>
        `;
        
        chatHistory.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.id = id;
        
        messageDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatHistory.appendChild(messageDiv);
        scrollToBottom();
        return id;
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});
