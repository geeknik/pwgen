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
