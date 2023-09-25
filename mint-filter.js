function toggleElement(element){
  element.style.display = (element.style.display === 'none') ? 'block' : 'none';
}

function toggleInactiveCards(element, searchString, regexPattern) {
    var elementsContainingString = [];

    function findAncestorWithMatchingClass(node, pattern) {
        let ancestor = node.parentElement;
        while (ancestor) {
          if (ancestor.classList) {
            var classNames = Array.from(ancestor.classList);
            if (classNames.some(className => pattern.test(className))) {
              console.log('Hiding card/sub-account ');
              toggleElement(ancestor);
              return ancestor;
            }
          }
          ancestor = ancestor.parentElement;
        }
        return null;
      }

    function traverse(element, searchString) {
        if (element.nodeType === Node.TEXT_NODE) {
          // If it's a text node, check its content for the searchString
          if (element.textContent != null && element.textContent.toLowerCase().includes(searchString.toLowerCase())) {
            var ancestorWithMatchingClass = findAncestorWithMatchingClass(element, regexPattern);
            if (ancestorWithMatchingClass) {
                elementsContainingString.push({ element: element, ancestor: ancestorWithMatchingClass });
            }
          }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
          // If it's an element node, recursively check its children
          element.childNodes.forEach((childElement) => {traverse(childElement, searchString)});
        }
      
        return null; // Return null if not found
    }
  
    traverse(element, searchString);
  
    return elementsContainingString;
}

function toggleInactiveInstitutions(ancestorPattern, descendantPattern){
  parentPattern = "div[class^='" + ancestorPattern + "']";
  childPattern = "div[class^='" + descendantPattern + "']";
  parents = document.querySelectorAll(parentPattern);
  hideElementsWithAllHiddenDescendants(parents);
  

  function hideElementsWithAllHiddenDescendants(parents){
      parents.forEach((element) => { 
          allHidden = true;
          children = element.querySelectorAll(childPattern);
          children.forEach((child) => {
              if (child.style.display != 'none'){
                  allHidden = false
              }
          });
          if (allHidden == true && children != null && children.length > 0){
              console.log('Hiding outer account ', element);
              toggleElement(element);
          }
      })
  }
}

function logError(errorMsg) {
  console.log(errorMsg);
}

function toggleInactiveAccounts(){
  try {
    console.log('Hiding inactive accounts');
    var elementsContainingString = toggleInactiveCards(document.body, searchString, regexPattern);
    toggleInactiveInstitutions(parentPattern, childPattern)
  } catch (error) {
    logError(`Error: Mint_Filter Extension - ${error.message}`);
  }
}

var searchString = 'inactive';
var regexPattern = /Accountsstyle__AccountItemSummaryContainer/;
var parentPattern = "Accountsstyle__AccountContainer";
var childPattern = "Accountsstyle__AccountItemSummaryContainer";
console.log('JRLog mintfilter.js initialized');

function toggleInactiveAccountsOnLoad(){
  console.log('JRLog: mint-filter.js loaded, methods should be visible');

  var existCondition = setInterval(function() {
    var parentElements = document.querySelectorAll("div[class^='" + parentPattern + "']");
    var childElements = document.querySelectorAll("div[class^='" + childPattern + "']");
    if (parentElements.length > 0 && childElements.length > 0) {
      console.log("JRLog Interval matched");
      clearInterval(existCondition);
      toggleInactiveAccounts();
    }
  }, 100);
}

chrome.storage.local.get('enable', function(data) {
  console.log('jrLog storage enabled: ', data.enable);
  var enable = data.enable !== undefined ? data.enable : true;

  if (enable) {
      console.log('jrLog executing main');
      toggleInactiveAccountsOnLoad();
  }
});

// TODO: Enable the below after setting up messaging
// if (typeof chrome !== 'undefined' && chrome.runtime) {
//     // Chrome, Edge, Opera
//   chrome.runtime.onMessage.addListener((message) => {
//     console.log('JRLog message received', message);
//     if (message === "toggleInactiveAccounts") {
//       toggleInactiveAccountsOnLoad();
//     }
//   });
// } else if (typeof browser !== 'undefined' && browser.runtime) {
//   // Firefox
//   browser.runtime.onMessage.addListener((message) => {
//     console.log('JRLog message received', message);
//     if (message === "toggleInactiveAccounts") {
//       toggleInactiveAccountsOnLoad();
//     }
//   });
// } else {
//   console.error("Browser does not support the runtime messaging API.");
// }






