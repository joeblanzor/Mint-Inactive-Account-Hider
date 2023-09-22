function findElementsContainingStringWithAncestor(element, searchString, regexPattern) {
    var elementsContainingString = [];

    function findAncestorWithMatchingClass(node, pattern) {
        let ancestor = node.parentElement;
        while (ancestor) {
          if (ancestor.classList) {
            var classNames = Array.from(ancestor.classList);
            if (classNames.some(className => pattern.test(className))) {
              console.log('Hiding card/sub-account ');
              ancestor.style.display = 'none'; // Hide the ancestor with matching class
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

  function findDivContainingPatternWithHiddenDescendants(ancestorPattern, descendantPattern){
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
                element.style.display = 'none';
            }
        })
    }
  }

  function logError(errorMsg) {
    console.log(errorMsg);
    // Get existing errors from storage (if any)
    // TODO: Uncomment with an options page or background script in manifest w/ remote server to log errors.
    // chrome.storage.local.get({ errors: [] }, function(data) {
    //   var errors = data.errors;
      
    //   // Add the new error message
    //   errors.push(errorMsg);
      
    //   // Store the updated list of errors
    //   chrome.storage.local.set({ errors: errors }, function() {
    //     console.log(`Error logged: ${errorMsg}`);
    //   });
    // });
  }
  
  // Example usage
  var searchString = 'inactive'; // Replace with your specific string
  var regexPattern = /Accountsstyle__AccountItemSummaryContainer/; // Replace with your regex pattern
  
  try {
    var elementsContainingString = findElementsContainingStringWithAncestor(document.body, searchString, regexPattern);
    findDivContainingPatternWithHiddenDescendants("Accountsstyle__AccountContainer", "Accountsstyle__AccountItemSummaryContainer")
  
    elementsContainingString.forEach((item) => {
      console.log(`Hidden account/card :`, item.ancestor);
      console.log('---');
    });
  } catch (error) {
    logError(`Error: Mint_Filter Extension - ${error.message}`);
  }

  