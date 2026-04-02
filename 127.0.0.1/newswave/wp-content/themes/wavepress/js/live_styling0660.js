jQuery(function ($) {
  //Update wavepress frontend live style editing
  function update_styles(options) {

    let menu_font_color = options.menu_theme === "#fff" ? "#000000" : "#bdbcbc";
    let menu_toggle_button_color = options.menu_theme === "#fff" ? "#000" : "#fff";
    
    const styles = {
      ":root": {
        "--color": options.buttons_color,
        "--preloader-url": "url(images/loader-128x/" + options.preloader_img + ".gif)"
      },
      ".dashicons-admin-home": {
        color: options.buttons_text_color + " !important;",
        background: options.buttons_color + " !important;",
      },
      "#searchsubmit": {
        background: options.buttons_color,
        color: options.buttons_text_color,
      },
      body: {
        "font-family": options['font-family'],
      },
      ".footer-fluid": {
        "border-top": "4px solid " + options.buttons_color,
      },
      ".menu-toggle-button": {
        "color": menu_toggle_button_color,
      },
      "h2.category-title:after": {
        content: '""',
        display: "block",
        width: "50%",
        height: "2px",
        background: "var(--color)",
        left: "0",
        top: "29px",
        position: "absolute",
      },
      ".page-title": {
          background: "var(--color)",
          color: options.buttons_text_color,
      },
      "#site-navigation": {
        background: options.menu_theme,
      },
      "#mega-menu-wrap-header-menu #mega-menu-header-menu > li.mega-menu-item > a.mega-menu-link":
        {
          color: menu_font_color,
        },
      ".load_more": {
          background: options.buttons_color,
          color: options.buttons_text_color, 
      },
      "section .category .label, .post-content .label": {
        "background": options.labels_color + " !important",
        "color": options.buttons_text_color + " !important",
      },
      "section .category .label a, .post-content .label a": {
        "color": options.buttons_text_color + " !important",
      }
    };

    $.each(styles, function (key, value) {
      //$(".dashicons-admin-home").removeAttr("style");
      $(key).css(value);
    });
    
    //$(".dashicons-admin-home").css("background", options.buttons_color);
    
    $("section .category .label, .post-content .label").attr("style", "background: " + options.labels_color + " !important;");
    $("section .category .label a, .post-content .label a").attr("style", "background: " + options.labels_color + " !important;");

    $(".dashicons-admin-home").attr("style", "background: " + options.buttons_color + " !important;");
    $("h2.category-title").css("--color", options.buttons_color);

    $.post({
      url: my_ajax_object.ajax_url + "/wp-admin/admin-ajax.php", 
      data: {
      action: "wavepress_save_styles",
      css: wavepress_jsonToCss(styles),
    },
    success: function(response) {
      wavepress_page_loading_end($);
    },
    error: function(xhr, textStatus, errorThrown) {
      // Handle error
      console.error('AJAX Error: ' + textStatus, errorThrown);
    }

    });
  }
  
  // Modify all options
  function modifyAll() {
    $.post(
      my_ajax_object.ajax_url + "/wp-admin/admin-ajax.php",
      { action: "get_wavepress_theme_options" },
      function (data, status) {
        options = JSON.parse(data);

        update_styles(options);
      },
    );
  }

  $(".almanar_params .paramBlock a").on("click", function () {
    var color = $(this).attr("data-value");
    var option = $(this).attr("data-option");
    wavepress_page_loading_start($);
    //Update color picker color.
    $('[data-option="' + option + '"]').val(color);

    $.post(
      my_ajax_object.ajax_url + "/wp-admin/admin-ajax.php",
      { action: "update_wavepress_theme_option", option: option, value: color },
      function (data, status) {
        modifyAll();
      },
    );
  });
  
  // Change font on live styling
  $("#font").on('change', function () {

    var option = $(this).attr("data-option");
    var value = $(this).val();
    wavepress_page_loading_start($);

    $.post(
      my_ajax_object.ajax_url + "/wp-admin/admin-ajax.php",
      { action: "update_wavepress_font", option: option, value: value },
      function (data, status) {
        modifyAll();
      },
    );
  });
  
  // Change preloader on live styling
  $("#preloader_img").change(function () {
    var selectedPreloader = $(this).val();
    wavepress_page_loading_start($);
    var option = $(this).attr("data-option");
    $.post({
      url: my_ajax_object.ajax_url + "/wp-admin/admin-ajax.php",
      data: {
        action: "update_wavepress_theme_option",
        option: option,
        value: selectedPreloader,
      },
      success: function(response) {
        modifyAll();
      },
      error: function(xhr, textStatus, errorThrown) {
        // Handle error
        console.error('AJAX Error: ' + textStatus, errorThrown);
      }
    });
  });

  //Hide social media buttons in the top header on small screens.
  $(".header-top-right #wrapperLinks").addClass(" d-none d-md-flex");

  const toggleButton = document.querySelector(".toggle-button");
  const paramsArea = document.querySelector(".almanar_params");
  
  if(toggleButton) {
    toggleButton.addEventListener("click", () => {
      paramsArea.classList.toggle("show-params");
    });
  }
  
  // Toggle overlay
  $("#toggleActive").on("click", function () {
    $("#scrollUp-active").toggle();

    var text =
      $(this).text() == "Hide activeOverlay"
        ? "Show activeOverlay"
        : "Hide activeOverlay";
    $(this).text(text).toggleClass("active");
  });
});