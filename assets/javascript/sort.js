function sortListByDate(dateAttribute) {
  const postTitleList = document.getElementById("post-titles");
  const postTitleItems = Array.from(postTitleList.getElementsByTagName("li"));
  postTitleItems.sort((a, b) => {
    const dateA = new Date(a.dataset[dateAttribute]);
    const dateB = new Date(b.dataset[dateAttribute]);

    return dateB - dateA;
  });
  postTitleList.innerHTML = "";
  postTitleItems.forEach((item) => {
    postTitleList.appendChild(item);
  });
}

document
  .getElementById("sort-by-created")
  .addEventListener("click", function (e) {
    e.preventDefault();
    sortListByDate("created");
    this.classList.add("active");
    const byUpdated = document.getElementById("sort-by-updated");
    byUpdated.classList.remove("active");
  });

document
  .getElementById("sort-by-updated")
  .addEventListener("click", function (e) {
    e.preventDefault();
    sortListByDate("updated");
    this.classList.add("active");
    const byCreated = document.getElementById("sort-by-created");
    byCreated.classList.remove("active");
  });
