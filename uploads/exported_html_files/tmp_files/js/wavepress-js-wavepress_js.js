jQuery(function ($) {
  
    // The target
    const site_navigation = document.querySelector("#site-navigation"); //.myElement
    
    if(site_navigation) {
      const logo = $(".logo-link img")[1];
      
      // The observer obtions
      const options = {
        root: null, // Observe relative the viewport
        threshold: [1] // Intersection of 100%
      }
      
      // Init the observer
      const observer = new IntersectionObserver( 
        ([e]) => logo.classList.toggle("is-pinned", e.intersectionRatio < 1),options
      );
      
      // Observe
      observer.observe(site_navigation);
    }

  //News ticker
  $(".my-news-ticker-3").AcmeTicker({
    type: "typewriter" /*horizontal/horizontal/Marquee/type*/,
    direction: "right" /*up/down/left/right*/,
    speed: 50 /*true/false/number*/ /*For vertical/horizontal 600*/ /*For marquee 0.05*/ /*For typewriter 50*/,
    controls: {
      prev: $(
        ".acme-news-ticker-prev",
      ) /*Can be used for horizontal/horizontal/typewriter*/ /*not work for marquee*/,
      toggle: $(
        ".acme-news-ticker-pause",
      ) /*Can be used for horizontal/horizontal/typewriter*/ /*not work for marquee*/,
      next: $(
        ".acme-news-ticker-next",
      ) /*Can be used for horizontal/horizontal/marquee/typewriter*/,
    },
  });

  // Parse URL Queries Method
  $.getQuery = function (query) {
    query = query.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var expr = "[\\?&]" + query + "=([^&#]*)";
    var regex = new RegExp(expr);
    var results = regex.exec(window.location.href);
    if (results !== null) {
      return results[1];
    } else {
      return false;
    }
  };

  $(".image-switch").on("click", function () {
    window.location = "?theme=image";
  });

  // Set theme based on URI
  if ($.getQuery("theme") === "pill") {
    $(function () {
      $.scrollUp({
        animation: "fade",
        activeOverlay: "#00FFFF",
      });
    });
    $(".pill-switch").addClass("active");
    $("#scrollUpTheme").attr("href", "css/themes/pill.css?1.1");
  } else if ($.getQuery("theme") === "link") {
    $(function () {
      $.scrollUp({
        animation: "fade",
        activeOverlay: "#00FFFF",
      });
    });
    $("#scrollUpTheme").attr("href", "css/themes/link.css?1.1");
    $(".link-switch").addClass("active");
  } else if ($.getQuery("theme") === "image") {
    $(function () {
      $.scrollUp({
        animation: "fade",
        activeOverlay: "#00FFFF",
        scrollImg: {
          active: true,
          type: "background",
          src: "img/top.png",
        },
      });
    });
    $("#scrollUpTheme").attr("href", "css/themes/image.css?1.1");
    $(".image-switch").addClass("active");
  } else {
    $(function () {
      $.scrollUp({
        animation: "slide",
        activeOverlay: "#00FFFF",
      });
    });
    $("#scrollUpTheme").attr("href", "css/themes/tab.css?1.1");
    $(".tab-switch").addClass("active");
  }

  wavepress_page_loading_end($);

  
  let menu_toggle_button = $(".menu-toggle-button");
  //$("nav #mega-menu-header-menu").prepend(menu_toggle_button);

  // Open/close toggle menu
  $( menu_toggle_button ).on( "click" ,function() {
      $('body').toggleClass('menu-open');
      $('.toggle-menu').toggleClass('menu-open');
      $('.toggle-button').toggleClass('menu-open');
  });
  
  
});
