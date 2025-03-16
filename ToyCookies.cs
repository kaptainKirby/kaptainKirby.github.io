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
 * @param {float} expirationDate The date the cookie will expire
 */
function CreateCookie(name, value, expirationDate)
{
    //Creates a cookie with the specified name, and expiration date (in days)
    document.cookie = name + '=' + value + '; ' + GetExpirationDate(expirationDate) + ' path=/';
    console.log(name + '=' + value + '; ' + GetExpirationDate(expirationDate) + ' path=/');
}


var decodedCookies;

/**
 * 
 * @param {string} cookie_name 
 */
function ReadCookie(cookie_name)
{
    //Creates first part of the cookie name to be found
    var name = cookie_name + '=';

    //Gets all cookies related to this website
    //This returns a long string of cookies, all separated by semicolons
    decodedCookies = decodeURIComponent(document.cookie);
    //Splits the cookie string into numerous individual cookie strings inside an array
    var cookieArray = decodedCookies.split(';');
    //Loops over array of cookie data
    for (var i = 0; i < cookieArray.length; i++)
    {
        var cookie = cookieArray[i];
        //Nullifies leading white space
        while (cookie.charAt(0) == ' ')
        {
            cookie = cookie.substring(1);
        }

        //If the name of the cookie matches the name given, grab the cookie
        if (cookie.indexOf(name) == 0)
            return cookie.substring(name.length, cookie.length);
    }

    //If the cookie is not found, print an error message
    console.warn("ERROR: COOKIE NOT FOUND");
    return ""; //Return nothing
}

/**
 * Deletes a cookie by setting its expiration date to the past
 * @param {string} name 
 */
function DeleteCookie(name)
{
    //If cookie is being deleted, you can set the value to anything, in this case - nothing.
    document.cookie = name + '=;' + GetExpirationDate(-1);
}

/**
* Changes the cookie from textbox.
* For testing purposes only.
*/
function SetCookieText(name, expirationDate)
{
    var value = document.getElementById("message").value;
    console.log(value);
    CreateCookie(name, value, expirationDate);

    CreateCookie("Test", "TESTING", expirationDate);
}

/**
 * Changes the text on the website to the cookie data.
 * For testing purposes only.
 */
function ChangeCookieDisplayText(name)
{
    document.getElementById("CookieText").innerHTML = ReadCookie(name);
}

/**
* Saves the cookies into a txt file and downloads it onto the computer
*/
function SaveFile()
{
    var data = decodedCookies;
    console.log(data);

    //Converts the data to a plain text Blob
    //A blob is a raw data type that is immutable. It can be read as binary or as text and can be converted into a ReadableStream.
    var dataToBlob = new Blob([data], {type:"text/plain"});

    //Converts Blob to a URL link, which acts as the value stored inside the text file
    var dataToSaveAsURL = window.URL.createObjectURL(dataToBlob);

    //Names the file. Makes the file into a .txt (text) file
    var fileNameSaveAs = "TaskMasterSaveData.txt";

    //Creates a new link object
    var downloadlink = document.createElement("a");

    //Names the download file
    downloadlink.download = fileNameSaveAs;

    //Sets what text the link displays on the page - Catch case - shouldn't actually need this
    downloadlink.innerHTML = "Download File";

    //Adds the URL link to the created link. the contents of the URL link are the cookies
    downloadlink.href = dataToSaveAsURL;

    //Adds download link to the body of the page
    document.body.appendChild(downloadlink);

    //Clicks on the link
    downloadlink.click();

    //Removes link from page
    downloadlink.remove();
}

/**
* Loads the file selected onto the cookies
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
        var cookieData = reader.result;

        //Loops forever until a semicolon is not found
        while(cookieData.indexOf(';') != -1)
        {
            //Creates cookie data from text file
            cookieData = CreateCookieDataFromFile(cookieData);
        }
        //Creates one more cookie for last one
        CreateCookieDataFromFile(cookieData);
    }

    //Have the reader start reading the first file inputted. Ignore all other files.
    reader.readAsText(fileInput.files[0]);
}

/**
* Creates cookie data from a certain string format
* This is a helper method, thus this should ONLY be called by LoadFile(event).
*/
function CreateCookieDataFromFile(data)
{
    //Nullifies leading white space
    while (data.charAt(0) == ' ')
    {
        data = data.substring(1);
    }
    var indexOfEqualsSign = data.indexOf('=');
    var indexOfSemiColon = data.indexOf(';');
            

    var name = data.substring(0, indexOfEqualsSign);
    var value = "";
    if (indexOfSemiColon != -1)
        value = data.substring(indexOfEqualsSign + 1, indexOfSemiColon);
    else
        value = data.substring(indexOfEqualsSign + 1);
    CreateCookie(name, value, 400);

    data = data.substring(indexOfSemiColon + 1);
    return data;
}

/**
 * Quality of life function that automatically formats the expiration time and date for cookie usage
 * Setting days to negative will make the cookie expire immediately, thus deleting the cookie
 * 
 * @param {float} days - the amount of time that needs to past for the cookie to expire.
 * @returns string - string is a time in UTC time format
 */
function GetExpirationDate(days)
{
    //Automatically formats date for cookie usage
    return 'expires=' + GetTime(days).toUTCString() + ';';
}

/**
 * Gets an expiration time specified by the amount of days into the future
 * @returns Date Object
 */
function GetTime(days)
{
    //Gets the current date
    var date = new Date(Date.now());

    //Gets the current time
    var currentTime = date.getTime();

    //Finds a future time, based on current time
    //There are 864e5 milliseconds in one day, which is where that number comes from.
    var expireTime = currentTime + days*864e5;

    //Sets date variable to the expired time
    date.setTime(expireTime);

    //Returns the date as a string
    return date;
}