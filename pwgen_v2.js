javascript:(function(){
  function getEntropyFromText(text) {
    return Array.from(new TextEncoder().encode(text)).reduce((acc, cur) => (acc + cur * 31) % 104729, 0);
  }

  var titleEntropy = document.title.length;
  var domainEntropy = window.location.hostname.length;
  var referrerEntropy = document.referrer.length;
  var userEntropyText = prompt('Please enter some random text to add personal entropy:', '');
  var userEntropy = userEntropyText.length;
  var combinedEntropy = getEntropyFromText(document.title + window.location.hostname + document.referrer + userEntropyText).toString();

  var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lower = "abcdefghijklmnopqrstuvwxyz";
  var numbers = "0123456789";
  var special = "!@#$%^&*()_+-=[]{}|;':,.<>?";
  var charset = upper + lower + numbers + special;
  var length = 32;

  var password = '';
  var stats = { upper: 0, lower: 0, numbers: 0, special: 0 };

  function getRandomChar(type) {
    if (type === 'upper') return upper.charAt(Math.floor(Math.random() * upper.length));
    if (type === 'lower') return lower.charAt(Math.floor(Math.random() * lower.length));
    if (type === 'numbers') return numbers.charAt(Math.floor(Math.random() * numbers.length));
    if (type === 'special') return special.charAt(Math.floor(Math.random() * special.length));
  }

  var entropyBytes = new Uint8Array(length);
  window.crypto.getRandomValues(entropyBytes);

  password += getRandomChar('upper'); stats.upper++;
  password += getRandomChar('lower'); stats.lower++;
  password += getRandomChar('numbers'); stats.numbers++;
  password += getRandomChar('special'); stats.special++;

  for (var i = 4; i < length; i++) {
    var index = (entropyBytes[i] + combinedEntropy.charCodeAt(i % combinedEntropy.length)) % charset.length;
    var char = charset.charAt(index);
    password += char;
    if (upper.includes(char)) stats.upper++;
    else if (lower.includes(char)) stats.lower++;
    else if (numbers.includes(char)) stats.numbers++;
    else if (special.includes(char)) stats.special++;
  }

  function shufflePassword(password) {
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  password = shufflePassword(password);

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
