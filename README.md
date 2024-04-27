## pwgen,  a secure password generator bookmarklet

![image](https://github.com/geeknik/pwgen/assets/466878/ee455995-ad38-4fde-9e6c-491e875f826d)

### Overview
This bookmarklet generates strong, complex passwords directly from your browser. It leverages multiple sources of entropy combined with cryptographically secure random number generation to ensure high-quality, unpredictable password outcomes.

### Features
- Generates passwords using a mix of uppercase, lowercase, numbers, and special characters.
- Utilizes multiple entropy sources including `document.title`, `window.location.hostname`, `document.referrer`, and user-provided input.
- Provides detailed statistics about the generated password, including character distribution and entropy estimates.

### Installation
1. Copy the following JavaScript code:

```javascript
javascript:(function(){
  var titleEntropy = document.title.length;
  var domainEntropy = window.location.hostname.length / 2;
  var referrerEntropy = document.referrer.length / 2;
  var userEntropyText = prompt('Please enter some random text to add personal entropy:', '');
  var userEntropy = userEntropyText.length;
  var combinedEntropy = Array.from(new TextEncoder().encode(document.title + window.location.hostname + document.referrer + userEntropyText)).reduce((acc, cur) => (acc + cur * 31) % 104729, 0).toString();
  var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lower = "abcdefghijklmnopqrstuvwxyz";
  var numbers = "0123456789";
  var special = "!@#$%^&*()_+-=[]{}|;':,.<>?";
  var charset = upper + lower + numbers + special;
  var length = 32;
  var password = '';
  var stats = { upper: 0, lower: 0, numbers: 0, special: 0 };
  var entropyBytes = new Uint8Array(length);
  window.crypto.getRandomValues(entropyBytes);
  for (var i = 0; i < length; i++) {
    var index = (entropyBytes[i] + combinedEntropy.charCodeAt(i % combinedEntropy.length)) % charset.length;
    var char = charset.charAt(index);
    password += char;
    if (upper.includes(char)) stats.upper++;
    else if (lower.includes(char)) stats.lower++;
    else if (numbers.includes(char)) stats.numbers++;
    else if (special.includes(char)) stats.special++;
  }
  var message = 'Your secure password is:\n ' + password +
                '\n\nStatistics:\n' +
                ' - Length: ' + length + ' characters\n' +
                ' - Uppercase letters: ' + stats.upper + '\n' +
                ' - Lowercase letters: ' + stats.lower + '\n' +
                ' - Numbers: ' + stats.numbers + '\n' +
                ' - Special characters: ' + stats.special + '\n' +
                '\nEstimated Entropy (bits):\n' +
                ' - Window Title: ' + (titleEntropy * 0.5).toFixed(2) + '\n' +
                ' - Document Domain: ' + domainEntropy.toFixed(2) + '\n' +
                ' - Document Referrer: ' + referrerEntropy.toFixed(2) + '\n' +
                ' - User Input: ' + (userEntropy * 0.6).toFixed(2);
  alert(message);
})();
```

2. Create a new bookmark in your browser:
   - Right-click the bookmarks bar and select **Add bookmark**.
   - Name the bookmark, e.g., "Secure Password Generator".
   - Paste the copied JavaScript code into the URL or Location field.
   - Save the bookmark.

### Usage
- Click the bookmarklet whenever you need to generate a secure password.
- Follow the prompt to input random text, which adds personal entropy to the password generation process.
- The password, along with its statistics and entropy sources, will be displayed in an alert box.

### Security Notes
- The generated passwords are influenced by several entropy sources, making each password unique and secure.
- Regularly update your browser to enhance security and ensure compatibility.

### Limitations
- The randomness and security are dependent on the browser's implementation of `crypto.getRandomValues` and the entropy of the user input.
- This tool is designed for convenience and should not be solely relied upon for generating passwords for highly sensitive systems.
