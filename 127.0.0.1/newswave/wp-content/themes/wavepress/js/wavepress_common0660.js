/**
 * Common Wavepress js functions
 */

/**
 * Trun JSON to CSS
 * 
 * @param Json - json to transform to css string
 * @return String - css string
 */
function wavepress_jsonToCss(json) {
  let css = "";
  for (let selector in json) {
    css += selector + " {\n";
    for (let property in json[selector]) {
      css += "  " + property + ": " + json[selector][property] + ";\n";
    }
    css += "}\n";
  }

  return css;
}

/**
 * Remove specia characters from json string
 * 
 * @param Object - obj json object to sanitize
 * @param String - char The special character to remove
 */
function wavepress_removeCharFromJsonObj(obj, char) {
  let newObj = {};

  for (let key in obj) {
    let value = obj[key];

    if (typeof value === "string") {
      // If the value is a string, remove the character
      value = value.replace(char, "");
    } else if (typeof value === "object") {
      // If the value is an object, recursively remove the character from it
      value = removeCharFromJsonObj(value, char);
    }

    // Add the updated key-value pair to the new object
    newObj[key] = value;
  }

  return newObj;
}

/**
 * Page loader start
 * 
 * @param Object - $ for Jquery
 * @return void
 * 
 */
function wavepress_page_loading_start($) {
	$("#status").fadeIn();
	$("#preloader").delay(350).fadeIn("slow");
	$("body").delay(350).css({ overflow: "hidden" });
}

/**
 * End page loader
 * 
 * @param Object - $ for Jquery
 * @return Void
 * 
 */
function wavepress_page_loading_end($) {
	$("#status").fadeOut();
	$("#preloader").delay(350).fadeOut("slow");
	$("body").delay(350).css({ overflow: "visible" });
}


function wavepress_observe(element ,callback) {
  // The target
  // let loadmore_button = $(".load_more")[0];
  
  //// To stop observing later:
//observer.unobserve(target);


  
  // Check if the element is set
  if(element) {
      // The observer obtions
      const options = {
        root: null, // Observe relative the viewport
        threshold: [1] // Intersection of 100%
      }
      
      // Init the observer
      const observer = new IntersectionObserver( 
        ([e]) => {

          if(e.intersectionRatio > 0) {
            
            callback();
            
          }
          
        },options
      );
        
      // Observe load more button
      observer.observe(element);
  }

  


  // Unobserve this element if a new one is created
  let UnobserveElement = (element) => new Promise(function(resolve ,reject) {

    // Simulate a delay using setTimeout
    // setTimeout(function() {
    //   // Simulate a successful result
    //   resolve('Element Unobserved succefully.');
    // }, 2000); // Simulate a 2-second delay

    // check if the same element is created
    // if( document.getElementsByClassName(element.className).length > 1) {
    //   resolve('Previous element Unobserved succefully.');
    // }

    // Create a new MutationObserver
// const observer = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//     // Check if nodes were added
//     if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
//       mutation.addedNodes.forEach(function(node) {
//         // Check if the added node has the class 'load_more'
//         if (node instanceof Element && node.classList.contains('load_more')) {
//           //console.log('A new element with class "load_more" was added:', node);

//           resolve('Previous element Unobserved succefully.');
//           // Do something with the new element
//         }
//       });
//     }
//   });
// });

// // Start observing the entire document body for changes
// observer.observe(document.body, {
//   childList: true, // Watch for changes in the children of the body
//   subtree: true // Watch for changes in the entire subtree of the body
// });

  });

  UnobserveElement(element).then(function(message){

    console.log(element);
    console.log(message);
  }).catch(function(error){
    // Handle errors 
    console.log(error);
  });

}

/**
 * 
 * Open tab in Wordress admin Newswave params section.
 * 
 * @param {Object} evt The current element targeted
 * @param {String} tabName The targeted tab name
 * 
 * @returns {void} 
 */
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
  tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";


  if(evt.currentTarget) {
    evt.currentTarget.className += " active";
  } 
  else {
      evt.className += " active";
  }
}

/**
 * 
 * Get total page to use for pagination & infinite scroll
 * 
 * @param {Int} total_posts Total posts calculated for the current query 
 * @param {Int} posts_per_page Posts to load per page in pagination or infinite scroll
 *  
 * @returns {Int} Total pages calculated
 */
function get_total_pages(total_posts ,posts_per_page) {
  return "abc";//Math.ceil ( total_posts / posts_per_page )
}
