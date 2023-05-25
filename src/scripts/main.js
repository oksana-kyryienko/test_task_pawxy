const cxId = "2528e8a9b4e174016";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results-container");
const navigationContainer = document.getElementById("navigation-container");

let currentPage = 1;
const resultsPerPage = 10;
let totalResults = 0;
let currentResults = [];

searchButton.addEventListener("click", performSearch);

function performSearch() {
  const query = searchInput.value.trim();

  if (query !== "") {
    const startIndex = (currentPage - 1) * resultsPerPage + 1;
    const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyDkz7DsYvSDwXv5Ti8NPd6n9HCvQDT4eEY&cx=${cxId}&q=${encodeURIComponent(
      query
    )}&start=${startIndex}&num=${resultsPerPage}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        totalResults = parseInt(data.searchInformation.totalResults);
        currentResults = filterAndSortVideos(data.items);
        displayResults(currentResults);
        updateNavigation();
      })
      .catch((error) => console.log(error));
  }
}

function filterAndSortVideos(items) {
  const videoItems = items.filter(
    (item) =>
      item.pagemap &&
      item.pagemap.videoobject &&
      item.pagemap.videoobject.length > 0 &&
      item.link.includes("youtube.com")
  );

  const sortedVideoItems = videoItems.sort((a, b) => {
    const viewCountA = parseInt(
      a.pagemap.videoobject[0].interactioncount || "0"
    );
    const viewCountB = parseInt(
      b.pagemap.videoobject[0].interactioncount || "0"
    );
    return viewCountB - viewCountA;
  });

  return sortedVideoItems;
}

function displayResults(videoItems) {
  resultsContainer.innerHTML = "";

  if (videoItems.length === 0) {
    resultsContainer.innerHTML = "<p>No video results found.</p>";
  } else {
    videoItems.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");

      const videoId = item.pagemap.videoobject[0].embedurl.split("?v=")[1];

      const thumbnailUrl = item.pagemap.videoobject[0].thumbnailurl;
      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = thumbnailUrl;
      thumbnailImage.classList.add("thumbnail-image");
      resultItem.appendChild(thumbnailImage);

      const infoContainer = document.createElement("div");
      infoContainer.classList.add("video-info");

      const title = document.createElement("a");
      title.href = item.link;
      title.textContent = item.title;
      infoContainer.appendChild(title);

      const titleText = title.textContent;
      const separatorIndex = titleText.indexOf("-");
      const performerName = titleText.substring(0, separatorIndex).trim();

      const performer = document.createElement("span");
      performer.textContent = performerName;
      infoContainer.appendChild(performer);

      const views = document.createElement("p");
      views.textContent = formatViewCount(
        item.pagemap.videoobject[0].interactioncount
      );
      infoContainer.appendChild(views);

      resultItem.appendChild(infoContainer);
      resultsContainer.appendChild(resultItem);

      // Add event listener to show the preview overlay when the thumbnail image is clicked
      thumbnailImage.addEventListener("click", () => {
        openVideoPreview(item.link);
      });
    });
  }
}

function updateNavigation() {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  if (totalPages <= 1) {
    navigationContainer.innerHTML = "";
    return;
  }

  navigationContainer.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Prev";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage -= 1;
    performSearch();
  });
  navigationContainer.appendChild(prevButton);

  const pageText = document.createElement("span");
  pageText.textContent = `Page ${currentPage} of ${totalPages}`;
  navigationContainer.appendChild(pageText);

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentPage += 1;
    performSearch();
  });
  navigationContainer.appendChild(nextButton);
}

function openVideoPreview(link) {
  const modal = document.getElementById("modal");

  if (modal) {
    closeModal();
  }

  const overlay = document.createElement("div");
  overlay.id = "modal";
  overlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const videoIframe = document.createElement("iframe");
  videoIframe.src = link;
  videoIframe.setAttribute("allowfullscreen", "");
  videoIframe.classList.add("video-iframe");
  modalContent.appendChild(videoIframe);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const visitButton = document.createElement("button");
  visitButton.textContent = "Visit";
  visitButton.classList.add("visit-button");
  visitButton.addEventListener("click", () => {
    window.open(link, "_blank");
    closeModal();
  });
  buttonContainer.appendChild(visitButton);

  modalContent.appendChild(buttonContainer);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", closeModal);
  buttonContainer.appendChild(closeButton);
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.remove();
  }
}

function formatViewCount(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed()}m views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed()}k views`;
  } else {
    return `${count} views`;
  }
}

function searchGoogle() {
  let searchInput = document.getElementById('search-input').value;
  let searchText = document.getElementById('search-text');
  let searchQuery = "Find in Google " + searchInput + "...";
  searchText.textContent = searchQuery;
  searchText.onclick = function() {
      let encodedQuery = encodeURIComponent(searchInput);
      let googleSearchURL = "https://www.google.com/search?q=" + encodedQuery;
      window.location.href = googleSearchURL;
  };
}