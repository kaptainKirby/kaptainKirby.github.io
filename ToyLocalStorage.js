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

/**
 * Creates a cookie with a specified name and value
 * @param {string} name The name of the cookie to create
 * @param {string} value The value to be stored inside the cookie
 */
function SetLocalStorage(key, value)
{
    localStorage.setItem(key, value);
}

/**
 * Finds the cookie data and reads it based off the key provided
 * @param {string} cookie_name - the key of the cookie
 * @returns string - the value inside the key
 */
function GetLocalStorage(key)
{
    return localStorage.getItem(key);
}

/**
 * Deletes ALL local storage related to this webpage
 */
function DeleteLocalStorage()
{
    localStorage.clear();
}

/**
 * Changes the test text to the local storage data value of the key
 * @param {*} key - the key to the local storage data
 */
function ChangeText(key)
{
    document.getElementById("text").innerHTML = GetLocalStorage(key);
}

/**
 * For debugging purposes only
 * Sets a a certain key's value to the text box's field on the page
 * @param {string} key 
 */
function TestSetLocalStorage(key)
{
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
function SaveFile()
{
    //Data
    var data = "";

    //Loops through the local storage contents
    for (var i = 0; i < localStorage.length; i++)
    {
        //If key is not null
        if (localStorage.key(i) != "null")
        {
            //Adds string to data
            data += localStorage.key(i) + "=" + GetLocalStorage(localStorage.key(i)) + ";";
        }
    }
    //Debug
    console.log(data);

    //Converts the data to a plain text Blob
    //A blob is a raw data type that is immutable. It can be read as binary or as text and can be converted into a ReadableStream.
    var dataToBlob = new Blob([data], {type:"text/plain"});

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
function LoadFile(event)
{
    //Gets the input from the chosen file
    var fileInput = event.target;

    //Creates a reader to read a txt file
    var reader = new FileReader();

    //Once the reader has finished loading the file, get the result
    reader.onload = function()
    {
        //Grabs the read data
        var data = reader.result;

        //Loops forever until a semicolon is not found
        while(data.indexOf(';') != -1)
        {
            //Creates local storage data from text file
            data = EditLocalStorageFromFile(data);
        }
        //Creates one more local storage data for last one
        EditLocalStorageFromFile(data);
    }

    //Have the reader start reading the first file inputted. Ignore all other files.
    reader.readAsText(fileInput.files[0]);
}

/**
* Creates local storage data from a certain string format
* This is a helper method, thus this should ONLY be called by LoadFile(event).
*/
function EditLocalStorageFromFile(data)
{
    //Nullifies leading white space
    while (data.charAt(0) == ' ')
    {
        data = data.substring(1);
    }

    //Gets crucial indexes
    var indexOfEqualsSign = data.indexOf('=');
    var indexOfSemiColon = data.indexOf(';');
            
    //String concatenation
    var name = data.substring(0, indexOfEqualsSign);
    var value = "";

    //If there is a semicolon remaining
    if (indexOfSemiColon != -1)
        value = data.substring(indexOfEqualsSign + 1, indexOfSemiColon);
    else //No semicolons left
        value = data.substring(indexOfEqualsSign + 1);
    SetLocalStorage(name, value);

    data = data.substring(indexOfSemiColon + 1);
    return data;
}