document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    
    // Function to make the assistant introduce itself on page load
    function introduce() {
        console.log('Introducing...');
        speak('Hello, I am Lumen, your voice assistant. How can I help you today?', () => {
            console.log('Introduction completed');
        });
    }

    // Introduce itself after a short delay to ensure everything is loaded
    setTimeout(introduce, 1000);

    document.getElementById('start-btn').addEventListener('click', () => {
        // Check for browser support
        if (!('webkitSpeechRecognition' in window)) {
            alert('This browser does not support speech recognition. Please try Google Chrome.');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.start();

        recognition.onstart = () => {
            output.textContent = 'Listening...';
            console.log('Recognition started');
        };

        recognition.onerror = (event) => {
            output.textContent = 'Error occurred in recognition: ' + event.error;
            console.error('Recognition error:', event.error);
        };

        recognition.onend = () => {
            output.textContent = 'Click the button and speak again!';
            console.log('Recognition ended');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            output.textContent = 'You said: ' + transcript;
            console.log('Recognition result:', transcript);
            handleCommand(transcript);
        };

        function handleCommand(command) {
            console.log('Handling command:', command);
            if (command.includes('introduce yourself')) {
                speak('Hello, I am Lumen, your voice assistant. How can I help you today?');
            } else if (command.includes('open google')) {
                speak('Opening Google', () => {
                    window.open('https://www.google.com', '_blank');
                });
            } else if (command.includes('open youtube')) {
                speak('Opening YouTube', () => {
                    window.open('https://www.youtube.com', '_blank');
                });
            } else if (command.startsWith('search for')) {
                const query = command.replace('search for', '').trim();
                speak('Searching for ' + query, () => {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                });
            } else if (command.startsWith('search in youtube')) {
                const query = command.replace('search in youtube', '').trim();
                speak('Searching in youtube' + query, () => {
                    window.open(`https://www.youtube.com/search?q=${encodeURIComponent(query)}`, '_blank');
                });
            } else if (command.includes('how are you')) {
                speak('I am just a program, but I am here to help you. How can I assist you today?');
            } else {
                speak('Sorry, I did not understand that command. Can you please repeat?');
            }
        }

        function speak(text, callback) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => {
                console.log('Speech has finished.');
                if (callback) callback();
            };
            utterance.onerror = (e) => {
                console.error('An error occurred during speech synthesis:', e);
            };
            window.speechSynthesis.speak(utterance);
        }
    });
});
