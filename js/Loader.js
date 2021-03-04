/**
 * ContentGrpID-1 stands for HOME. (depends on index.xml !)
 */
const HOME_ID = "ContentGrpID-1";
/**
 * ./pages/home.html is current start up page. (depends on index.xml !)
 */
const HOME_SOURCE = "./pages/home.html";

/**
*  A global XMLHttpRequest Object.
*/
var xmlHTTPRequest = createXMLHTTPRequestObject();
/**
*  A global XMLDOM Object or null.
*/
var XMLDomObject = null;
/**
*  True, if there is an XMLDOM Object.
*/
var XMLDomEnable = XMLDomEnable();

/**
 * Indicates wether a image show is enabled or not. 
 */
var imageShowEnabled = false;
/**
 * The period from change to change (milisecond). 
 */
var imageShowPeriod = 0;
/**
 * The current image (0 based).
 */
var imageShowCounter = 0;
var imgShowTimer = null;

/**
 * Image array used for the image show. 
 */
var imageShowImages = new Array();
/**
 * Indicates that images being loaded before.
 */
var imageShowImagesLoaded = false;
/**
 * Indicates wether a image show is initialzed or not. 
 */
var imageShowInitialized = false;

/**
 * current position is an imageshow page. 
 */
var onImageShowPage = false;

/**
 * current device is a small one. 
 */
var smallSizeDevice = false;
/**
 * current device is a middle one. 
 */
var middleSizeDevice = false;
/**
 * current device is a big one. 
 */
var bigSizeDevice = false;

/**
 * Indicates a open left navigation. 
 */
var smallLeftNavOpen = false;
/**
 * Indicates a open top navigation. 
 */
var smallTopNavOpen = false;

/**
 * Sets the favicon, loads the HOME page and initialize the image show.
 */
window.onload = function () {
    'use strict'

    try {
        var faviconPath = queryXPath("/database/favicon");

        //set the favicon
        var link = document.createElement('link');
        link.rel = "shortcut icon";
        link.type = "image/x-icon";
        link.href = faviconPath;

        document.head.appendChild(link);

        imageShowEnabled = queryXPath("/database/imgShow/@enabled",true);
        imageShowPeriod = queryXPath("/database/imgShow/@period",true);

        if(!(imageShowPeriod > 0)){
            imageShowPeriod=0;
            imageShowEnabled=false;
        }

        initializeMedia();

        getContent(HOME_ID, HOME_SOURCE, "mainContent")

        if (smallSizeDevice) {
            //we have to close the top menue....
            document.getElementById("groupNav").classList.add("smallHide");
            document.getElementById("mainNav").classList.add("smallHide");
        }
        else if (middleSizeDevice) {
            //we have to close the top menue....
            document.getElementById("groupNav").classList.add("smallHide");
        }
    }
    catch (e) {
        window.alert("onLoad:" + e);
    }
};

/**
 * Closes all navigation if the mainContent area will be clicked.
 */
function onMainContentClicked() {
    //We have to difference between two scenaries...
    if (smallLeftNavOpen) {
        //...by purpose
        turnSmallButton("smallButtonLeft");
    }
    //...by chance
    closeLeftNavigation();

    //Again, we have to difference between two scenaries...
    if (smallTopNavOpen) {
        //...by purpose
        turnSmallButton("smallButtonRight");
    }
    //...by chance
    closeTopNavigation();

    //... at all we'll close it!
}

/**
 * Initializes an media change caller and set initial values for smallMediaDevice, 
 * middleMediaDevice, bigMediaDevice. Also updates the home page if neccessarie.
 */
function initializeMedia() {
    'use strict';

    try {
        var smallMedia = window.matchMedia('only screen and (max-width: 640px)');
        smallMedia.addListener(smallMediaListener);

        var middleMedia = window.matchMedia('only screen and (min-width: 641px) and (max-width: 1024px)');
        middleMedia.addListener(middleMediaListener);

        var bigMedia = window.matchMedia('only screen and (min-width: 1025px)');
        bigMedia.addListener(bigMediaListener);

        if (smallMedia.matches) {
            smallSizeDevice = true;
            middleSizeDevice = false;
            bigSizeDevice = false;
        }
        if (middleMedia.matches) {
            smallSizeDevice = false;
            middleSizeDevice = true;
            bigSizeDevice = false;

            initializeImageShow();
        }
        if (bigMedia.matches) {
            smallSizeDevice = false;
            middleSizeDevice = false;
            bigSizeDevice = true;

            initializeImageShow();
        }
    }
    catch (e) {
        window.alert("initializeMedia:" + e);
    }
}

/**
 * Initializes the imgShow.
 */
function initializeImageShow() {
    'use strict';

    try {
        if (imageShowEnabled && !imageShowInitialized) {
            var imgPaths = queryXPathList("/database/imgShow/showImage[text()]");

            for (var i = 0; i < imgPaths.length; i++) {
                var image = document.createElement('img');
                image.setAttribute('class', 'imageShowImage');
                image.setAttribute('id', 'imageShowImage' + i);
                image.setAttribute('title', 'Imageshow');
                image.setAttribute('alt', 'Teil der Imageshow');
                image.setAttribute('src', imgPaths[i]);

                image.style.setProperty('opacity', 0);

                imageShowImages.push(image);
            }

            imageShowInitialized = true;
        }

        if (onImageShowPage && !imageShowImagesLoaded) {
            //We're on a page with an imgShow-container and images are not been loaded yet.
            var imgShowContainer = document.getElementById('imgShow');
            if (imgShowContainer != undefined) {
                for (var i = 0; i <
                    imageShowImages.length; i++) {
                    imgShowContainer.appendChild(imageShowImages[i]);
                }
            }

            imageShowImagesLoaded = true;
        }
    }
    catch (e) {
        window.alert("changeImgShowPicture:" + e);
    }
}

/**
 * Changes the current imgShow-image
 */
function changeImgShowPicture() {
    'use strict';

    var arrLength = this.imageShowImages.length;

    try {
        var curImage = document.getElementById('imageShowImage' + imageShowCounter);
        if(curImage != undefined)
        curImage.style.opacity = "0";

        imageShowCounter++;
        if (imageShowCounter >= arrLength) {
            imageShowCounter = 0;
        }

        curImage = document.getElementById('imageShowImage' + imageShowCounter);
        if (curImage != undefined) {
            curImage.style.opacity = "1";
        }
    }
    catch (e) {
        window.alert("changeImgShowPicture:" + e);
    }
}

/**
 * Listener for small media
 * @param {type} mq media change caller
 */
function smallMediaListener(mq) {
    'use strict';

    try {
        if (mq.matches) {
            smallSizeDevice = true;
            middleSizeDevice = false;
            bigSizeDevice = false;

            //We have to difference between two scenaries...
            if (smallTopNavOpen) {
                //...by purpose
                turnSmallButton("smallButtonRight");
            }
            //...by chance
            closeTopNavigation();
            //... at all we'll close it!
        }
    }
    catch (e) {
        window.alert("smallMediaListener:" + e);
    }
}

/**
 * Listener for middle media
 * @param {type} mq media change caller
 */
function middleMediaListener(mq) {
    'use strict';

    try {
        if (mq.matches) {
            smallSizeDevice = false;
            middleSizeDevice = true;
            bigSizeDevice = false;

            //We have to difference between two scenaries...
            if (smallLeftNavOpen) {
                //...by purpose
                turnSmallButton("smallButtonLeft");
            }
            //...by chance
            closeLeftNavigation();
            //... at all we'll close it!

            initializeImageShow();

            if (imgShowTimer == null) {
                imgShowTimer = setInterval(changeImgShowPicture, imageShowPeriod);
            }
        }
    }
    catch (e) {
        window.alert("middleMediaListener:" + e);
    }
}

/**
 * Listener for big media
 * @param {type} mq media change caller
 */
function bigMediaListener(mq) {
    'use strict';

    try {
        if (mq.matches) {
            smallSizeDevice = false;
            middleSizeDevice = false;
            bigSizeDevice = true;

            initializeImageShow();

            if (imgShowTimer == null) {
                imgShowTimer = setInterval(changeImgShowPicture, imageShowPeriod);
            }
        }
    }
    catch (e) {
        window.alert("bigMediaListener:" + e);
    }
}

/**
 * Tries to instanciate an XMLDOM Object.
 * Sets the XMLDOMEnable.
 * @returns {type} AxtiveXObject - Microsoft.XMLDOM
 */
function XMLDomEnable() {
    'use strict';

    try {
        XMLDomObject = new ActiveXObject("Microsoft.XMLDOM");
        XMLDomObject.async = false;
        XMLDomObject.preserveWhiteSpace = true;
        XMLDomObject.load("./xml/database.xml");

        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * Creates an XMLHttpRequest Object if possible.
 * @returns {type} xmlHTTPRequest - The object or null
 */
function createXMLHTTPRequestObject() {
    'use strict';

    try { //there is an xmlHttpRequest object
        xmlHTTPRequest = new XMLHttpRequest();
    }
    catch (e) {
        try { //let's try an early ActiveX
            XMLHttpRequest = new new ActiveXObject("Micrososft.XMLHttp")
        }
        catch (e) { //there is no such object
            return null;
        }
    }

    return xmlHTTPRequest;
}

/**
 * Gets the content of an file and fill the innerHTML of the given target
 * @param {type} id - The ID of the menue
 * @param {type} source - A valid source like ./sample.html or an URL
 * @param {type} target - A valid target like targetDiv which must own an innerHTML section
 */
function getContent(id, source, target) {
    'use strict';

    changeContentClass(id);
    if (smallSizeDevice && smallTopNavOpen) {
        //we have to close the top menue....
        turnSmallButton('smallButtonRight');
    }

    try {
        if (xmlHTTPRequest) {
            xmlHTTPRequest.open('GET', source);
            xmlHTTPRequest.onreadystatechange = function () {
                if ((xmlHTTPRequest.status === 200) && (xmlHTTPRequest.readyState === 4)) {
                    document.getElementById(target).innerHTML = xmlHTTPRequest.responseText;
                    openContentBook();

                    var imgShowContainer = document.getElementById('imgShow');
                    if (imgShowContainer != undefined) {
                            onImageShowPage = true;
                            imageShowCounter = 0;

                            for (var i = 0; i < imageShowImages.length; i++) {
                                imgShowContainer.appendChild(imageShowImages[i]);
                            }

                            if (middleSizeDevice || bigSizeDevice) {
                                //we have to start the imgShow...
                                imgShowTimer = setInterval(changeImgShowPicture, imageShowPeriod);
                            }
                    }
                    else {
                        onImageShowPage = false;
                        clearInterval(imgShowTimer);
                        imgShowTimer = 0;
                    }
                }
            }
            xmlHTTPRequest.send();
        }
    }
    catch (e) {
        window.alert("getContent:" + e);
    }
}

/**
 * Sets the selected and unselected class for both groups of menues.
 * In case of: Content changed
 * @param {type} newActiveGroup - The new menue item
 */
function changeContentClass(newActiveGroup) {
    'use strict'

    try {
        var allSelectedMainNav = document.querySelectorAll("#mainNav ul li.selected");
        var allSelectedGroupNav = document.querySelectorAll("#groupNav ul li.selected");

        //clear groupNav
        for (var i = 0; i < allSelectedGroupNav.length; i++) {
            allSelectedGroupNav[i].classList.remove("selected");
            allSelectedGroupNav[i].classList.add("unselected");
        }

        for (var i = 0; i < allSelectedMainNav.length; i++) {
            allSelectedMainNav[i].classList.remove("selected");
            allSelectedMainNav[i].classList.add("unselected");
        }

        var newActive = document.querySelector("#" + newActiveGroup)

        if (newActive) {
            newActive.classList.remove("unselected");
            newActive.classList.add("selected");
        }
    }
    catch (e) {
        window.alert("changeContentClass:" + e);
    }
}

/**
 * Gets images based of the selected group and pass them onward to createImageHTML.
 * @param {type} source - A valid source pointing to a group-ID in database.xml
 * @param {type} target - A valid target like targetDiv which must own an innerHTML section
 */
function getImages(source, target) {
    'use strict';

    var xml;
    var imageArray = new Array();

    try {

        //Because images will be shown, the imgShow must be finished.
        onImageShowPage = false;
        clearInterval(imgShowTimer);

        var rootQuery = "/database/root";

        var devicePathQuery = "/database/sizes/small";//default

        if (smallSizeDevice) {
            devicePathQuery = "/database/sizes/small";

            //we have to close the left menue....
            turnSmallButton('smallButtonLeft');
        }
        else if (middleSizeDevice) {
            devicePathQuery = "/database/sizes/middle";

            //we have to close the left menue....
            turnSmallButton('smallButtonLeft');
        }
        else if (bigSizeDevice) {
            devicePathQuery = "/database/sizes/large";
        }

        var groupPathQuery = "/database/groups/group[@id=\'" + source + "\']/@path";
        var imagesQuery = "/database/groups/group[@id=\'" + source + "\']/images/image[text()]";

        var root = "";
        var devicePath = "";
        var groupPath = "";
        var path = "";

        changeImageGroupClass(source);

        if (!XMLDomEnable && xmlHTTPRequest) {
            //window.alert("W3C conform");
            xmlHTTPRequest.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    getImageCallBack(source, target, xmlHTTPRequest.responseXML);
                }
            };
            xmlHTTPRequest.open("GET", "./xml/database.xml", true);
            xmlHTTPRequest.send();
        }
        else {
            //window.alert("Old browser");
            if (XMLDomObject && XMLDomObject != null) {
                root = XMLDomObject.selectNodes(rootQuery)[0].text;
                devicePath = XMLDomObject.selectNodes(devicePathQuery)[0].text;
                groupPath = XMLDomObject.selectNodes(groupPathQuery)[0].text;

                path = root + '\/' + devicePath + '\/' + groupPath;

                var images = XMLDomObject.selectNodes(imagesQuery);

                for (var i = 0; i < images.length; i++) {
                    var completePath = path + '\/' + images[i].text;
                    imageArray.push(completePath);
                }

                createImageHTML(imageArray, target);
            }
        }
    }
    catch (e) {
        window.alert("getImages:" + e);
    }
}

/**
 * The call back used for the xmlhttprequest call in getImages.
 * @param {type} source - A valid source pointing to a group-ID in database.xml
 * @param {type} target - A valid target like targetDiv which must own an innerHTML section
 * @param {type} xml- The returned xml code
 */
function getImageCallBack(source, target, xml) {
    'use strict';

    var imageArray = new Array();

    try {

        var rootQuery = "/database/root";

        var devicePathQuery = "/database/sizes/small";//default

        if (smallSizeDevice) {
            devicePathQuery = "/database/sizes/small";
        }
        else if (middleSizeDevice) {
            devicePathQuery = "/database/sizes/middle";
        }
        else if (bigSizeDevice) {
            devicePathQuery = "/database/sizes/large";
        }

        var groupPathQuery = "/database/groups/group[@id=\'" + source + "\']/@path";
        var imagesQuery = "/database/groups/group[@id=\'" + source + "\']/images/image[text()]";

        var root = "";
        var devicePath = "";
        var groupPath = "";
        var path = "";

        if (xml.evaluate) {
            root = xml.evaluate(rootQuery, xml, null, XPathResult.ANY_TYPE, null).iterateNext().childNodes[0].nodeValue;
            devicePath = xml.evaluate(devicePathQuery, xml, null, XPathResult.ANY_TYPE, null).iterateNext().childNodes[0].nodeValue;
            groupPath = xml.evaluate(groupPathQuery, xml, null, XPathResult.ANY_TYPE, null).iterateNext().nodeValue;

            path = root + '\/' + devicePath + '\/' + groupPath;

            var images = xml.evaluate(imagesQuery, xml, null, XPathResult.ANY_TYPE, null);

            var imageX = images.iterateNext();
            while (imageX) {
                var completePath = path + '\/' + imageX.childNodes[0].nodeValue;
                imageX = images.iterateNext();
                imageArray.push(completePath);
            }
        }
    }
    catch (e) {
        window.alert("getImageCallBack:" + e);
    }

    createImageHTML(imageArray, target);
}

/**
 * Sets the selected and unselected class for both groups of menues.
 * In case of: ImageGroup changed
 * @param {type} newActiveGroup - The new menue item
 */
function changeImageGroupClass(newActiveGroup) {
    'use strict'

    try {
        var allSelectedMainNav = document.querySelectorAll("#mainNav ul li.selected");
        var allSelectedGroupNav = document.querySelectorAll("#groupNav ul li.selected");

        //clear mainNav
        for (var i = 0; i < allSelectedMainNav.length; i++) {
            allSelectedMainNav[i].classList.remove("selected");
            allSelectedMainNav[i].classList.add("unselected");
        }

        for (var i = 0; i < allSelectedGroupNav.length; i++) {
            allSelectedGroupNav[i].classList.remove("selected");
            allSelectedGroupNav[i].classList.add("unselected");
        }

        var newActive = document.querySelector("#" + newActiveGroup)

        if (newActive) {
            newActive.classList.remove("unselected");
            newActive.classList.add("selected");
        }
    }
    catch (e) {
        window.alert("changeImageGroupClass:" + e);
    }
}

/**
 * (Synchronous) Runs queries aganist database.xml which return a string value.
 * @param {type} query - A valid query using xpath
 * @returns {type} String - The Value
 */
function queryXPath(query, isAttribute) {
    'use strict';

    var xml;
    var returnValue="#";

    if (!xmlHTTPRequest) {
        createXMLHTTPRequestObject();
    }

    try {
        if (xmlHTTPRequest) {
            xmlHTTPRequest.open("GET", "./xml/database.xml", false);
            xmlHTTPRequest.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (!XMLDomEnable) {
                        xml = xmlHTTPRequest.responseXML;
                        if (xml.evaluate) {
                            //window.alert("W3C conform");
                            if (!isAttribute) {
                                returnValue = xml.evaluate(query, xml, null, XPathResult.ANY_TYPE, null).iterateNext().childNodes[0].nodeValue;
                            }
                            else if (isAttribute) {
                                returnValue = xml.evaluate(query, xml, null, XPathResult.ANY_TYPE, null).iterateNext().nodeValue;
                            }
                        }
                    }
                    else {
                        if (XMLDomObject && XMLDomObject != null) {
                            //window.alert("Old browser");
                            returnValue = XMLDomObject.selectNodes(query)[0].text;
                        }
                    }
                }
            };
            xmlHTTPRequest.send();
        }
    }
    catch (e) {
        window.alert("queryXPath:" + e);
    }

    return returnValue;
}

/**
 * (Synchronous) Runs queries aganist database.xml which return an array value.
 * @param {type} query - A valid query using xpath
 * @returns {type} Arrayg - The Values
 */
function queryXPathList(query,functionx) {
    'use strict';

    var xml;
    var returnValue;
    var returnArray=new Array();

    if (!xmlHTTPRequest) {
        createXMLHTTPRequestObject();
    }

    try {
        if (xmlHTTPRequest) {
            xmlHTTPRequest.open("GET", "./xml/database.xml", false);
            xmlHTTPRequest.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (!XMLDomEnable) {
                        xml = xmlHTTPRequest.responseXML;
                        if (xml.evaluate) {
                            returnValue = xml.evaluate(query, xml, null, XPathResult.ANY_TYPE, null);

                            var valueX = returnValue.iterateNext();
                            while (valueX) {
                                returnArray.push(valueX.childNodes[0].nodeValue);
                                valueX = returnValue.iterateNext();
                            }
                        }
                    }
                    else {
                        if (XMLDomObject && XMLDomObject != null) {
                            returnValue = XMLDomObject.selectNodes(query);

                            for (var i = 0; i < returnValue.length; i++) {
                                returnArray.push(returnValue[i].text);
                            }
                        }
                    }
                }
            };
            xmlHTTPRequest.send();
        }
    }
    catch (e) {
        window.alert("queryXPathList:" + e);
    }

    return returnArray;
}

/**
 * Creates a block of html covering images of the given array.
 * @param {type} imageArray - All imagepaths as an array
 * @param {type} target - A valid target like targetDiv which must own an innerHTML section
 */
function createImageHTML(imageArray, target) {
    'use strict';

    var html = "";
    var counter = 1;

    try {
        html += "<div id='mainImgBook'>";
        for (var i = 0; i < imageArray.length; i++) {
            html += "<img id=imgBookImage" + counter + " class='imageBookImage' src=" + imageArray[i] + " ";

            html += "ondblclick=\"openPreviewImage(\'" + imageArray[i] + "\')\" ";

            html += "/>";

            counter++;
        }
        html += "</div>";

        document.getElementById(target).innerHTML = html;
        openImageBook();
    }
    catch (e) {
        window.alert("createImageHTML:" + e);
    }
}

/**
 * Util function to support refresh on the form section.
 */
function forceToggleContactFields() {
    'use strict'

    try {
        document.getElementById("formSubscribeNewsletter").checked = false;
        toggleNewsletterFields();
        document.getElementById("formSitePromotion").checked = false;
        toggleSitePromotionFields();
    }
    catch (e) {
        window.alert("forceToggleContactFields:" + e);
    }
}

/**
 * Changes the class from accessible to not accessible for members of newsletter group.
 * The newsletter group is defined by its class: notAccessibleNewsletterField, accessibleNewsletterField.
 */
function toggleNewsletterFields() {
    'use strict'

    try {
        var checkbox = document.getElementById("formSubscribeNewsletter");
        var checked = checkbox.checked;

        if (checked) {
            var elements = document.getElementsByClassName("notAccessibleNewsletterField");
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.remove("notAccessibleNewsletterField")
            }
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.add("accessibleNewsletterField")
            }
        }
        else {
            var elements = document.getElementsByClassName("accessibleNewsletterField");
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.remove("accessibleNewsletterField")
            }
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.add("notAccessibleNewsletterField")
            }
        }

        document.getElementById("formMail").disabled = !checked;
        document.getElementById("formLanguage").disabled = !checked;
    }
    catch (e) {
        window.alert("toggleNewsletterFields:" + e);
    }
}

/**
 * Changes the class from accessible to not accessible for members of site promotion group.
 * The promotion group is defined by its class: notAccessibleSitePromotionField, accessibleSitePromotionField
 */
function toggleSitePromotionFields() {
    'use strict'

    try {
        var checkbox = document.getElementById("formSitePromotion");
        var checked = checkbox.checked;

        if (checked) {
            var elements = document.getElementsByClassName("notAccessibleSitePromotionField");
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.remove("notAccessibleSitePromotionField")
            }
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.add("accessibleSitePromotionField")
            }

        }
        else {
            var elements = document.getElementsByClassName("accessibleSitePromotionField");
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.remove("accessibleSitePromotionField")

            }
            for (var i = 0; i < elements.length; i++) {//do not change the sequence
                elements[i].classList.add("notAccessibleSitePromotionField")
            }
        }

        document.getElementById("formSiteName").disabled = !checked;
    }
    catch (e) {
        window.alert("toggleSitePromotionFields:" + e);
    }
}

/*
 * Fügt die Klasse is-active hinzu bzw. entfernt sie
 * Parameter: Klassenname des umschließenden Div-Tag
 */
function turnSmallButton(classname) {
    'use strict'

    var element = document.querySelector("div." + classname + " button");

    if (element.classList.contains("is-active") === true) {
        element.classList.remove("is-active");

        if (classname == "smallButtonLeft") {
            closeLeftNavigation("groupNav");
        }
        else if (classname == "smallButtonRight") {
            closeTopNavigation("mainNav");
        }
    } else {
        element.classList.add("is-active");

        if (classname == "smallButtonLeft") {
            openLeftNavigation("groupNav");
        }
        else if (classname == "smallButtonRight") {
            openTopNavigation("mainNav");
        }
    }
}

/*
 * Klappt das LeftMenü auf
 */
function openLeftNavigation() {
    'use strict'

    if (document.getElementById("groupNav").classList.contains("smallHide")) {
        document.getElementById("groupNav").classList.remove("smallHide")
    }
    document.getElementById("groupNav").classList.add("smallShow")
    smallLeftNavOpen = true;
}

/*
 * Klappt das LeftMenü ein
 */
function closeLeftNavigation() {
    'use strict'

    if (document.getElementById("groupNav").classList.contains("smallShow")) {
        document.getElementById("groupNav").classList.remove("smallShow")
    }
    document.getElementById("groupNav").classList.add("smallHide")
    smallLeftNavOpen = false;

}

/*
 * Klappt das TopMenü auf
 */
function openTopNavigation() {
    'use strict'

    if (document.getElementById("mainNav").classList.contains("smallHide")) {
        document.getElementById("mainNav").classList.remove("smallHide")
    }
    document.getElementById("mainNav").classList.add("smallShow")
    smallTopNavOpen = true;
}

/*
 * Klappt das TopMenü ein
 */
function closeTopNavigation() {
    'use strict'

    if (document.getElementById("mainNav").classList.contains("smallShow")) {
        document.getElementById("mainNav").classList.remove("smallShow")
    }
    document.getElementById("mainNav").classList.add("smallHide")
    smallTopNavOpen = false;
}

function openImageBook() {
    'use strict'

    if (document.getElementById("mainContent").classList.contains("contentMainPage")) {
        document.getElementById("mainContent").classList.remove("contentMainPage")
    }
    document.getElementById("mainContent").classList.add("imageMainPage")
}

function openContentBook() {
    'use strict'

    if (document.getElementById("mainContent").classList.contains("imageMainPage")) {
        document.getElementById("mainContent").classList.remove("imageMainPage")
    }
    document.getElementById("mainContent").classList.add("contentMainPage")
}

function openPreviewImage(path) {
    'use strict'

    var target = document.getElementById("previewImageContent");

    if (target != undefined) {
        var descriptionContainer = document.createElement("div");

        var description = document.createElement("p");

        description.innerHTML = path;
        descriptionContainer.appendChild(description);

        var button = document.createElement("span");
        button.setAttribute('id', 'prevImageCloseButton');
        button.setAttribute('onclick', 'closePreviewImage()');

        var image = document.createElement('img');
        image.setAttribute('id', 'previewImage' + i);
        image.setAttribute('title', path);
        image.setAttribute('alt', path);
        image.setAttribute('src', path);

        for (var i = 0; i < target.childNodes.length; i++) {
            target.removeChild(target.firstChild);
        }

        target.appendChild(image);

        target.appendChild(button);
        target.appendChild(descriptionContainer);

        if (target.classList.contains("hidePreviewImage")) {
            target.classList.remove("hidePreviewImage")
        }
        target.classList.add("showPreviewImage")
    }
}

function closePreviewImage() {
    'use strict'

    if (document.getElementById("previewImageContent").classList.contains("showPreviewImage")) {
        document.getElementById("previewImageContent").classList.remove("showPreviewImage")
    }
    document.getElementById("previewImageContent").classList.add("hidePreviewImage")
}