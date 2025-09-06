// JavaScript for the password strength evaluator
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const togglePasswordButton = document.getElementById('toggle-password');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthText = document.getElementById('strength-text');
    const crackTimeValue = document.getElementById('crack-time-value');

    // Hint elements
    const hints = {
        length: { element: document.getElementById('hint-length'), icon: document.getElementById('length-icon') },
        uppercase: { element: document.getElementById('hint-uppercase'), icon: document.getElementById('uppercase-icon') },
        lowercase: { element: document.getElementById('hint-lowercase'), icon: document.getElementById('lowercase-icon') },
        number: { element: document.getElementById('hint-number'), icon: document.getElementById('number-icon') },
        special: { element: document.getElementById('hint-special'), icon: document.getElementById('special-icon') }
    };

    // Icon SVGs
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-full h-full text-[#D6B9FC]"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
    const xIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-full h-full text-[#838CE5]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`;

    // Password visibility toggle
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    // Main event listener for password input
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const stats = checkPasswordStrength(password);
        updateUI(stats, password);
    });

    // The main function to evaluate password strength
    function checkPasswordStrength(password) {
        let stats = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        let charSetSize = 0;
        if (stats.uppercase) charSetSize += 26;
        if (stats.lowercase) charSetSize += 26;
        if (stats.number) charSetSize += 10;
        if (stats.special) charSetSize += 32;

        const passwordLength = password.length;
        let entropyBits = 0;
        if (charSetSize > 0) {
            entropyBits = passwordLength * (Math.log(charSetSize) / Math.log(2));
        }

        stats.entropy = entropyBits;
        return stats;
    }

    // Function to update the GUI based on password stats
    function updateUI(stats, password) {
        // Update hints with checkmark/x icons and color
        hints.length.icon.innerHTML = stats.length ? checkIcon : xIcon;
        hints.length.element.classList.toggle('text-[#D6B9FC]', stats.length);
        hints.length.element.classList.toggle('text-[#838CE5]', !stats.length);

        hints.uppercase.icon.innerHTML = stats.uppercase ? checkIcon : xIcon;
        hints.uppercase.element.classList.toggle('text-[#D6B9FC]', stats.uppercase);
        hints.uppercase.element.classList.toggle('text-[#838CE5]', !stats.uppercase);

        hints.lowercase.icon.innerHTML = stats.lowercase ? checkIcon : xIcon;
        hints.lowercase.element.classList.toggle('text-[#D6B9FC]', stats.lowercase);
        hints.lowercase.element.classList.toggle('text-[#838CE5]', !stats.lowercase);

        hints.number.icon.innerHTML = stats.number ? checkIcon : xIcon;
        hints.number.element.classList.toggle('text-[#D6B9FC]', stats.number);
        hints.number.element.classList.toggle('text-[#838CE5]', !stats.number);

        hints.special.icon.innerHTML = stats.special ? checkIcon : xIcon;
        hints.special.element.classList.toggle('text-[#D6B9FC]', stats.special);
        hints.special.element.classList.toggle('text-[#838CE5]', !stats.special);

        // Update strength meter
        let meterWidth = 0;
        let meterColor = 'bg-[#838CE5]';
        let strengthMessage = 'Start typing...';

        if (stats.entropy < 28) {
            meterWidth = (stats.entropy / 28) * 25;
            meterColor = 'bg-red-500';
            strengthMessage = 'Very Weak';
        } else if (stats.entropy < 36) {
            meterWidth = ((stats.entropy - 28) / 8) * 25 + 25;
            meterColor = 'bg-orange-400';
            strengthMessage = 'Weak';
        } else if (stats.entropy < 60) {
            meterWidth = ((stats.entropy - 36) / 24) * 25 + 50;
            meterColor = 'bg-yellow-400';
            strengthMessage = 'Reasonable';
        } else if (stats.entropy < 128) {
            meterWidth = ((stats.entropy - 60) / 68) * 25 + 75;
            meterColor = 'bg-green-500';
            strengthMessage = 'Strong';
        } else {
            meterWidth = 100;
            meterColor = 'bg-green-700';
            strengthMessage = 'Very Strong';
        }

        strengthMeter.style.width = `${meterWidth}%`;
        strengthMeter.className = `h-full rounded-full strength-meter-fill ${meterColor}`;

        strengthText.textContent = password.length > 0 ? strengthMessage : 'Start typing...';

        // Update crack time
        const fast_speed = 10**12;
        if (stats.entropy > 0) {
            const crackTimeSeconds = (2**stats.entropy) / fast_speed;
            crackTimeValue.textContent = formatTime(crackTimeSeconds);
        } else {
            crackTimeValue.textContent = 'N/A';
        }
    }

    // Function to format time for display
    function formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds.toFixed(2)} seconds`;
        } else if (seconds < 3600) {
            return `${(seconds / 60).toFixed(2)} minutes`;
        } else if (seconds < 86400) {
            return `${(seconds / 3600).toFixed(2)} hours`;
        } else if (seconds < 31536000) {
            return `${(seconds / 86400).toFixed(2)} days`;
        } else if (seconds < 31536000000) {
            return `${(seconds / 31536000).toFixed(2)} years`;
        } else {
            return `> 1000 years`;
        }
    }
});
