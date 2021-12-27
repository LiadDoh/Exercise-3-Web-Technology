  function controller() {
      // Get json data from localhost:3000/sites and display it in the list on get request
      $(document).ready(function() {
          $("#getSites").click(function() {
              $("h2").text("List of All Sites")
              $.getJSON("http://localhost:3000/sites", function(data) {
                  $("ul").empty();
                  $.each(data, function(key, value) {
                      // Add each site to the list
                      $("ul").append("<li> Site Name:" + value.name + "<br>Site ID:" +
                          value._id + "<br><br></li>");
                  });
              });
          });

          // Get site by Name
          $("#getSite").on('submit', function(e) {
              e.preventDefault();
              var siteName = $("#siteName").val();
              console.log(siteName);
              $.getJSON("http://localhost:3000/sites/" + siteName, function(data) {
                  $("ul").empty();
                  console.log(data);
                  if (typeof data !== 'undefined' && siteName !== "") {
                      $("h2").text(siteName + " Details")
                      $("ul").append("<li> Site Name:" + JSON.stringify(data
                              .name) +
                          "<br><br>Site ID:" + JSON.stringify(data._id) +
                          "<br><br>Site Description:" +
                          JSON.stringify(data.description) + "<br><br>Site Image:" +
                          JSON
                          .stringify(data.imageURL) +
                          "<br><br>Site Background Image:" + JSON
                          .stringify(data.backgroundImageURL) + "</li>");
                  } else {
                      $("h2").text("No Site Name Was Given!")
                  }
              });
          });

          // Delete site by ID
          $("#deleteSite").on('submit', function(e) {
              e.preventDefault();
              var siteID = $("#siteID").val();
              if (siteID !== "") {
                  $.ajax({
                      url: "http://localhost:3000/sites/" + siteID,
                      type: "DELETE",
                      success: function(result) {
                          $("h2").text("Site Deleted!")
                      }
                  });
              }

          });


          $("#deleteSites").click(function(e) {
              e.preventDefault();
              $("h2").empty();
              $("ul").empty();
              // Delete all sites from the list
              $.ajax({
                  url: "http://localhost:3000/sites",
                  type: "DELETE",
                  success: function(e) {
                      e.preventDefault();
                      $("ul").empty();
                      $("ul").append("<li>All sites have been deleted</li>");
                  }
              });
          });


          // Post site to localhost:3000/sites
          $("#postSite").on('submit', function(e) {
              e.preventDefault();
              $("h2").empty();
              $("ul").empty();
              var siteName = $("#siteCreateName").val();
              var siteDescription = $("#siteCreateDesc").val();
              var siteImage = $("#siteCreateImage").val();
              var siteBackgroundImage = $("#siteCreateBackGroundImage").val();
              if (siteName !== "" && siteDescription !== "" && siteImage !== "") {
                  if (siteBackgroundImage === "") {
                      siteBackgroundImage =
                          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80";
                  }
                  $.ajax({
                      url: "http://localhost:3000/sites",
                      data: JSON.stringify({
                          "name": siteName,
                          "description": siteDescription,
                          "imageURL": siteImage,
                          "backgroundImage": siteBackgroundImage
                      }),
                      type: "POST",
                      contentType: "application/json",
                      dataType: "json",
                      error: function(error) {
                          console.log(error);
                          $("h2").text("Failed to create site!")
                      },

                      success: function(result) {
                          $("h2").text("Site Created!")
                      },
                  });
              } else {
                  $("h2").text("Please fill in all fields!")
              }
          });

          // Patch site by Name
          $("#patchSite").on('submit', function(e) {
              e.preventDefault();
              $("h2").empty();
              $("ul").empty();
              var siteId = $("#patchedSiteID").val();
              var siteName = $("#sitePatchName").val();
              var siteDescription = $("#sitePatchDesc").val();
              var siteImage = $("#sitePatchDesc").val();
              var siteBackgroundImage = $("#sitePatchBackGroundImage").val();
              if (siteName !== "" && siteDescription !== "" && siteImage !== "") {
                  if (siteBackgroundImage === "") {
                      siteBackgroundImage =
                          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80";
                  }
                  console.log(siteId);
                  $.ajax({
                      url: "http://localhost:3000/sites/" + siteId,
                      data: JSON.stringify({
                          "name": siteName,
                          "description": siteDescription,
                          "imageURL": siteImage,
                          "backgroundImage": siteBackgroundImage
                      }),
                      type: "PATCH",
                      contentType: "application/json",
                      dataType: "json",
                      error: function(error) {
                          console.log(error);
                      },

                      success: function(result) {
                          $("h2").text("Site Updated!")
                      }
                  });
              } else {
                  $("h2").text("Please fill in all fields!")
              }
          });


          $(".getAllSites").click(function() {
              $(".forms").height(100);
              $("#getSites").show();
              $("#getSite").hide();
              $("#deleteSite").hide();
              $("#deleteSites").hide();
              $("#postSite").hide();
              $("#patchSite").hide();
          });

          $(".getSite").click(function() {
              $(".forms").height(100);
              $("#getSites").hide();
              $("#getSite").show();
              $("#deleteSite").hide();
              $("#deleteSites").hide();
              $("#postSite").hide();
              $("#patchSite").hide();
          });

          $(".deleteSite").click(function() {
              $(".forms").height(100);
              $("#getSites").hide();
              $("#getSite").hide();
              $("#deleteSite").show();
              $("#deleteSites").hide();
              $("#postSite").hide();
              $("#patchSite").hide();
          });

          $(".deleteSites").click(function() {
              $(".forms").height(100);
              $("#getSites").hide();
              $("#getSite").hide();
              $("#deleteSite").hide();
              $("#deleteSites").show();
              $("#postSite").hide();
              $("#patchSite").hide();
          });

          $(".postSite").click(function() {
              $(".forms").height(200);
              $("#getSites").hide();
              $("#getSite").hide();
              $("#deleteSite").hide();
              $("#deleteSites").hide();
              $("#postSite").show();
              $("#patchSite").hide();
          });

          $(".patchSite").click(function() {
              $(".forms").height(200);
              $("#getSites").hide();
              $("#getSite").hide();
              $("#deleteSite").hide();
              $("#deleteSites").hide();
              $("#postSite").hide();
              $("#patchSite").show();
          });
      });


  }

  window.onload = controller()