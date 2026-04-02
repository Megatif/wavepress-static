document.addEventListener("DOMContentLoaded", function() {
  const videoItems = document.querySelectorAll(".video-item");
  const mainVideoIframe = document.getElementById("main-video-iframe");
  const mainVideoTitle = document.getElementById("main-video-title");

  videoItems.forEach(item => {
      item.addEventListener("click", function() {
          const videoId = this.getAttribute("data-video-id");
          mainVideoIframe.src = `https://www.youtube.com/embed/${videoId}`;

          const videoTitle = this.getAttribute("data-video-title");
          mainVideoTitle.innerHTML = videoTitle;
      });
  });
});
