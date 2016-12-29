$("document").ready(function() {
  // the search term needs to be added at the end with %20 in the place of spaces
  var api_base = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=',
  link_base = 'https://en.wikipedia.org/wiki/';
  // making a function for setting the title and text of a search result
  function postResult(div, title, text) {
    // div is the id of he div to have the info put into
    // title is the wikipedia article title
    // text is the first sentence or something. the preview to show under the title.
    $("#"+div).html("<h2>" + title + "</h2> <p>" + text + "</p>");
  }

  function fixSpaces(text, replace) {
    // turn spaces into %20 for the url
    var fixed = text, ind;
    while (fixed.indexOf(" ") !== -1) {
      ind = fixed.indexOf(" ");
      fixed = fixed.slice(0,ind) + replace + fixed.slice(ind+1, fixed.length);
    }
    return fixed;
  }

  // open search box or start search
  $("#mag-glass").on("click", function() {
    //check if the search box is open
    if ($("#search").css("visibility") === "hidden") {
      // if it's hidden, make it visible
      $("#search").css("visibility","visible");
      $("#ex").css("visibility","visible");
      $("#search").focus();
      $("#search").animate({
        width: '200px',
        'padding-left': "5px"
      },500, function(){
        $("#ex").animate({
          width: "20px"
        },300)
      });
    } else {
      // if it's visible, submit it
      $("form").submit();
    }
  });

  //close search box
  $("#ex").on("click", function() {
    $("#ex").animate({
      width: 0
    },200, function() {
      $("#ex").css("visibility","hidden");
      $("#search").animate({
        width: 0,
        'padding-left':0
        }, 500, function() {
        $("#search").css("visibility", "hidden");
        })
      })
  })

  // activate search
  $("form").on("submit", function(){
    var searchTerm = $("#search").val(),
    apiUrl, linkUrl;

    // move the search thing to the top of the page
    $("#random-wiki").css("margin-top", "2%");

    // rehide all results in case there are less than 10 hits
    $(".result").css("visibility", "hidden");

    // perform the search
    if (searchTerm.length > 0) {
      searchTerm = fixSpaces(searchTerm, "%20");
      apiUrl = api_base + searchTerm + "&format=json&callback=?";
      $.getJSON(apiUrl, function(json){
        // hits is the min between 10 and the actual number of hits, since I only want 10 results max but there might be less than that
        var hits = Math.min(10, json["query"]["searchinfo"]["totalhits"]),
        resId, linkId, title, snippet, link;

        //console.log("hits: " + hits);
        if (hits < 1) {
          $("#res_01").html("NO RESULTS FOUND");
          $("#res_01").css("visibility", "visible");
        } else {
          for (var i = 1; i < hits+1; i++) {
            if (i < 10) {
              resId = "res_0" + i.toString();
              linkId = "link_0" + i.toString();
            } else {
              resId = "res_" + i.toString();
              linkId = "link_" + i.toString();
            }
          //  console.log("id:",id);
          //  console.log("title:",res[1]);
          //  console.log("title:",res[2]);
          //  console.log("---------------");
            title = json["query"]["search"][i-1]["title"];
            snippet = json["query"]["search"][i-1]["snippet"];
            link = link_base + fixSpaces(title, "_");
            postResult(resId, title, snippet);
            $("#"+linkId).attr("href", link);
            $("#"+resId).css("visibility","visible");

            //console.log("id:",resId);
            //console.log("title:", title);
            //console.log("snippet:", snippet);
            //console.log("---------------");
          }
        }
      //$(".result").css("visibility","visible");
      })
    }

    return false; // this stops the page from reloading
  })
})
