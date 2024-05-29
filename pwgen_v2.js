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
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    var randomIndex;

    if (type === 'upper') {
      randomIndex = array[0] % upper.length;
      return upper.charAt(randomIndex);
    }
    if (type === 'lower') {
      randomIndex = array[0] % lower.length;
      return lower.charAt(randomIndex);
    }
    if (type === 'numbers') {
      randomIndex = array[0] % numbers.length;
      return numbers.charAt(randomIndex);
    }
    if (type === 'special') {
      randomIndex = array[0] % special.length;
      return special.charAt(randomIndex);
    }
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

  function shufflePassword(password, entropyBytes) {
    var array = password.split('');
    for (var i = array.length - 1; i > 0; i--) {
      var j = entropyBytes[i] % (i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  password = shufflePassword(password, entropyBytes);

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
