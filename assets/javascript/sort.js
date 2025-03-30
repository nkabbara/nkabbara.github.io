// Specs for sorting:
// 1. When page loads, articles are sorted by last created.
// 2. Sorting is only in reverse chronological order.
// 3. Mark is over the sorted attribute only.
// 4. Emjory showing reverse order is next to attribute we're dorting by.
// 5. Sorting happens on page by JS, no reloads.

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
    // Remove arrow from sort-by-updated
    this.textContent = "⬇️ " + this.textContent;
  });

document
  .getElementById("sort-by-updated")
  .addEventListener("click", function (e) {
    e.preventDefault();
    sortListByDate("updated");
    // Remove arrow from sort-by-created
    this.textContent = "⬇️ " + this.textContent;
  });
