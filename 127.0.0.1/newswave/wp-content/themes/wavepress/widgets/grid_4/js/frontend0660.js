jQuery(function ($) {

  function load_posts(elementId, settings, page, categories) {
    const module = "grid_4";

    $.ajax({
      type: "POST",
      url: my_ajax_object.ajax_url + "/wp-admin/admin-ajax.php",
      dataType: "json", // add data type
      data: {
        action: "wavepress_get_ajax_posts",
        postsperpage: settings.postsperpage,
        categories: categories,
        display_author: settings.display_author,
        settings: settings,
        page: page,
        module: module,
      },
      beforeSend: function () {
        $("#" + elementId + " #overlay").fadeIn(300);
        $("#" + elementId).animate({ opacity: 0.5 }, 500);
      },
      success: function ( data ) {
        
        parser = new DOMParser();
        doc = parser.parseFromString( data.html ,"text/html" );
        const secondary_articles = Object.values(
          doc.getElementsByClassName("c1"),
        );
        let pagination = doc.getElementsByClassName("pagination-list")[0];

        $("#" + elementId + " .section-content").html("");
        $("#" + elementId + " .posts-pagination").html(
          pagination == null ? "" : pagination,
        );

        secondary_articles.forEach(function (elem) {
          $("#" + elementId + " div.section-content").append(elem);
        });

        $(
          "#" +
            elementId +
            " .secondary-article-title a,#" +
            elementId +
            " .big-article-title a",
        ).each(function () {
          var len = $(this).text().length;
          if (len > 45) {
            $(this).text($(this).text().substr(0, 45) + "...  ");
          }
        });

        $("#" + elementId + " #overlay").fadeOut(300);
        $("#" + elementId).animate({ opacity: 1 }, 500);
      },
    });
  }
  
  // Taget all grid 4 modules instances
  $(".grid-4").each(function () {

    const element = $(this);
    const elementId = $(this).attr("id");
    const settings = element.data("settings");
    let page = 1;
    
    
    
    // Highlight All categories button
    $("#" + elementId + " ul.sub_categories_list li:first-child a").addClass("highlighted");

    // Load posts by categries
    $("#" + elementId + " ul.sub_categories_list li a").on(
      "click",
      function () {
        let categories;

        // get categorie from category LINK
        categories = $(this).attr("data-catslug");

        // set data-catslug to widget section
        element.attr("data-catslug", categories);

        // if data-catslug is set to "ALL" then set categories from settings to reset
        if( categories == 'all' ) {
          categories = settings.categories;
        }

        page = 1;
        
        $("#" + elementId + " ul.sub_categories_list li a").removeClass("highlighted");
        $(this).addClass("highlighted");


        load_posts(elementId, settings, page, categories);
      },
    );
    
    // Load posts by page
    $("#" + elementId ).on("click", "ul.pagination-list li a", function () {
      page = $(this).attr("data-page");
      let categories;
      
        // if data-catslug is set to "ALL" or there is no data-catslug then set categories from settings to reset
        if(categories == 'all' || !element.attr("data-catslug")) {
          categories = settings.categories;
        }
        else {
          categories = element.attr("data-catslug");
        }
        console.log( {elementId, settings, page, categories} )

        load_posts(elementId, settings, page, categories);
    });
  });
});
