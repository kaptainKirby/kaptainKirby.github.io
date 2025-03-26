/**
 * Summary: Manages cookies in a server.
 * The creation of cookies, editing of cookies, and deletion of cookies are the same process.
 *
 * When creating a cookie, you need to give it a name, value, (optional) expiration date, and (optional) path
 * When editing a cookie, you create a new cookie. If a cookie with the same name already exists, it replaces it
 * When deleting a cookie, you can set the expiration date to a past date.
 *
 * If an expiration date is not provided, the cookie is deleted immediately when the broswer closes.
 * I didn't do too much research on it, but that sounds kind of useless, if we want the cookie to persist.
 *
 * If the path is not provided, the cookie is only viewable by the current domain (the website).
 * I don't think we need our cookies to be viewed outside the website, so I elected to leave it unprovided.
 *
 * Author: Ryan Herwig
 */

const IS_DEBUGGING = true;

/**
 * Creates a cookie with a specified name and value
 * @param {string} name The name of the cookie to create
 * @param {string} value The value to be stored inside the cookie
 */
function SetLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Finds the cookie data and reads it based off the key provided
 * @param {string} cookie_name - the key of the cookie
 * @returns string - the value inside the key
 */
function GetLocalStorage(key) {
    if (key != "HashData" || IS_DEBUGGING) //Reserved Word
        return localStorage.getItem(key);
    else
        return "";
}

function GetAllLocalStorage() {
    var data = "";
    //Loops through the local storage contents
    for (var i = 0; i < localStorage.length; i++) {
        //If key is not null
        if (localStorage.key(i) != "null" && (localStorage.key(i) != "HashData" || IS_DEBUGGING)) {
            //Adds string to data
            data += localStorage.key(i) + "=" + GetLocalStorage(localStorage.key(i)) + ";";
        }
    }
    return data;
}

/**
 * Deletes ALL local storage related to this webpage
 */
function DeleteLocalStorage() {
    localStorage.clear();
}

/**
 * Changes the test text to the local storage data value of the key
 * @param {*} key - the key to the local storage data
 */
function ChangeText(key) {
    document.getElementById("text").innerHTML = GetLocalStorage(key);
}

/**
 * For debugging purposes only
 * Sets a a certain key's value to the text box's field on the page
 * @param {string} key
 */
function TestSetLocalStorage(key) {
    //Gets the message
    var value = document.getElementById("message").value;

    //Sets the key's value
    SetLocalStorage(key, value);

    //TESTING
    SetLocalStorage("TEST", "TESTING");
}

/**
 * Saves the local storage data into a txt file and downloads it onto the computer
 */
function SaveFile() {
    //Data
    var data = GetAllLocalStorage();
    data = Encrypt();
    //Converts the data to a plain text Blob
    //A blob is a raw data type that is immutable. It can be read as binary or as text and can be converted into a ReadableStream.
    var dataToBlob = new Blob([data], { type: "text/plain" });

    //Converts Blob to a URL link, which acts as the value stored inside the text file
    var dataToSaveAsURL = window.URL.createObjectURL(dataToBlob);

    //Creates a new link object
    var downloadlink = document.createElement("a");

    //Names the download file. Makes it a .txt (text) file.
    downloadlink.download = "TaskMasterSaveData.txt";

    //Adds the URL link to the created link. the contents of the URL link are the local storage
    downloadlink.href = dataToSaveAsURL;

    //Adds download link to the body of the page
    document.body.appendChild(downloadlink);

    //Clicks on the link
    downloadlink.click();

    //Removes link from page
    downloadlink.remove();
}

/**
 * Loads the file selected onto the local storage
 */
function LoadFile(event) {
    //Gets the input from the chosen file
    var fileInput = event.target;

    //Creates a reader to read a txt file
    var reader = new FileReader();

    //Once the reader has finished loading the file, get the result
    reader.onload = function () {
        //Grabs the read data
        var data = reader.result;
        data = Decyrpt(data);
        if (data != "") {
            //Loops forever until a semicolon is not found
            while (data.indexOf(";") != -1) {
                //Creates local storage data from text file
                data = EditLocalStorageFromFile(data);
            }
            //Creates one more local storage data for last one
            EditLocalStorageFromFile(data);

            console.log(GetAllLocalStorage());
        }
    };

    //Have the reader start reading the first file inputted. Ignore all other files.
    reader.readAsText(fileInput.files[0]);
}

/**
 * Creates local storage data from a certain string format
 * This is a helper method, thus this should ONLY be called by LoadFile(event).
 */
function EditLocalStorageFromFile(data) {
    //Nullifies leading white space
    while (data.charAt(0) == " ") {
        data = data.substring(1);
    }

    //Gets crucial indexes
    var indexOfEqualsSign = data.indexOf("=");
    var indexOfSemiColon = data.indexOf(";");

    //String concatenation
    var name = data.substring(0, indexOfEqualsSign);
    var value = "";

    //If there is a semicolon remaining
    if (indexOfSemiColon != -1)
        value = data.substring(indexOfEqualsSign + 1, indexOfSemiColon);
    //No semicolons left
    else value = data.substring(indexOfEqualsSign + 1);
    SetLocalStorage(name, value);

    data = data.substring(indexOfSemiColon + 1);
    return data;
}

//Variables to set up Vigenere Cipher
const alphabet = "U+CZN0?`hwW4pjKf:VXSn#L<531/[z_.8}&kbD\"Go7J!(@sHI*e,-g]r2Mi6yPQaOdxFY$R=9T{E%^>cB;vu|)q~ ltmA\\'";
const hashDifference = alphabet.length / 100;
const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const keyWord = "MaRSBAR";
const keyLength = keyWord.length;

//Variables to set up salting
//Adds random letters equal to the number
//Iterates through array after every encrypted letter
//Loops back to beginning when it reaches the end
const saltAmountArray = [1, 2, 3, 4, 5];

function Encrypt() {
    //Gets the data from the storage
    var plainText = GetAllLocalStorage();
    console.log("Plain Text: " + plainText);

    //Creates Vigenere Cipher using keyWord
    var cipherAlphabets = CreateCipherAlphabets();

    var encyrptedText = "";
    var beforeSaltEncyrptedText = "";

    var keyIndex = 0;
    var plainTextIndex = 0;

    //Salt Iterator
    var saltIterator = 0;

    //Takes less time, but slightly more memory
    var cipherTextSize = cipherAlphabets.length;

    //Loops through the plain text to encrypt it
    for (var i = 0; i < plainText.length; i++) {
        //If key index is greater than the end, cycle it back to beginning
        if (keyIndex >= cipherTextSize)
            keyIndex = 0;
        //Gets the current letter being encrypted
        var letter = plainText.at(i);

        //Finds the of the letter in the alphabet
        plainTextIndex = alphabet.indexOf(letter);

        encyrptedText += cipherAlphabets[keyIndex][plainTextIndex];
        beforeSaltEncyrptedText += cipherAlphabets[keyIndex][plainTextIndex];

        //Adds salt to encryption
        //  - Adds random junk inbetween letters
        for (var j = 0; j < saltAmountArray[saltIterator]; j++) {
            var randomChar = Math.floor(Math.random() * alphabet.length);
            encyrptedText += alphabet.at(randomChar);
        }

        //Increments iterators
        keyIndex++;
        saltIterator++;

        //Resets salt array
        if (saltIterator >= saltAmountArray.length)
            saltIterator = 0;
    }

    //DEBUG - print out encypted text
    if (IS_DEBUGGING) {
        console.log("Before Salt Encrypted Text: " + beforeSaltEncyrptedText);
        console.log("Encyrpted Text: " + encyrptedText);
    }

    //Hashing
    var hashValue = 0;
    for (var i = 0; i < encyrptedText.length; i++) {
        hashValue = Math.round((hashValue + alphabet.indexOf(encyrptedText.at(i)) / 100) * 100) / 100;
    }

    //Increases hash to be equal to the length of the alphabet
    var difference = Math.round((hashValue % hashDifference) * 100) / 100;
    var addedValue = Math.round((hashDifference - difference) * 100) / 100;
    if (addedValue == hashDifference)
        addedValue = 0;

    //Adds extra letter to the end
    encyrptedText += alphabet.at(addedValue * 100);

    //Increases hash value by added letter's value
    hashValue = Math.round((hashValue + addedValue) * 100) / 100;
    SetLocalStorage("HashData", hashValue);

    if (IS_DEBUGGING) {
        console.log(GetAllLocalStorage());
        console.log("Hash Data = " + hashValue);
    }

    return encyrptedText;
}

function Decyrpt(text) {
    //Gets the cipherAlphabet
    var cipherAlphabets = CreateCipherAlphabets();

    //Hashes encyrpted text
    var hashValue = 0;
    for (var i = 0; i < text.length; i++) {
        hashValue = Math.round((hashValue + alphabet.indexOf(text.at(i)) / 100) * 100) / 100;
    }
    console.log("Hash: " + hashValue);
    console.log(Math.round((hashValue % hashDifference) * 100) / 100);
    if (Math.round((hashValue % hashDifference) * 100) / 100 != 0.95) {
        console.log("ERROR: Incorrect File or File has been tampered with!");
        return "";
    }

    //Unsalts the encyption
    var plaintext = "";
    var encryptedText = "";
    var saltIterator = 0;

    var textLength = text.length;

    //Removes salt to encryption
    //  - Removes the random junk inbetween letters
    for (var i = 0; i < textLength; i++) {
        var firstLetter = text.substring(0, 1);
        var afterSalt = text.substring(saltAmountArray[saltIterator] + 1);
        text = afterSalt;
        encryptedText += firstLetter;

        //Increments salt iterator
        saltIterator++;

        //Resets salt array
        if (saltIterator >= saltAmountArray.length)
            saltIterator = 0;
    }

    var keyIndex = 0;
    var encryptedTextIndex;
    var cipherIndex;
    var encyrptedTextLength = encryptedText.length;
    var index;

    for (var i = 0; i < encyrptedTextLength; i++) {
        if (keyIndex >= cipherAlphabets.length)
            keyIndex = 0;
        encryptedTextIndex = alphabet.indexOf(encryptedText.at(i));
        cipherIndex = alphabet.indexOf(cipherAlphabets[keyIndex][0]);

        index = encryptedTextIndex - cipherIndex;

        if (index >= 0)
            plaintext += alphabet.at(index);
        else {
            index *= -1;
            plaintext += alphabet.at(alphabet.length - index);
        }

        keyIndex++;
    }

    return plaintext;
}

function CreateCipherAlphabets() {
    //Creates Alphabets
    var cipherAlphabets = [];

    for (var i = 0; i < keyLength; i++) {
        var alphabetLength = alphabet.length;
        var index = alphabet.indexOf(keyWord[i]);

        var temp = [];

        for (var j = 0; j < alphabetLength; j++) {
            if (index + j >= alphabet.length) {
                alphabetLength -= j;
                index = 0;
                j = 0;
            }
            temp.push(alphabet.at(index + j));
        }
        cipherAlphabets.push(temp);
    }

    //DEBUGGING PURPOSES
    if (IS_DEBUGGING) {
        var alphaStr = "";
        //Prints out Alphabet
        for (var i = 0; i < alphabet.length; i++) {
            alphaStr += alphabet.at(i) + " ";
        }
        console.log(alphaStr);

        //Prints the key
        for (var i = 0; i < cipherAlphabets.length; i++) {
            var str = "";
            for (var j = 0; j < cipherAlphabets[0].length; j++) {
                str += cipherAlphabets[i][j] + " ";
            }
            console.log(str);
        }
    }
    return cipherAlphabets;
}