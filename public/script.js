let currentIndex = 0;
const pageSize = 10;
let allIds = [];

async function loadStories() {
  if (currentIndex >= allIds.length) return;

  const nextIds = _.slice(allIds, currentIndex, currentIndex + pageSize);
  currentIndex += pageSize;

  try {
    const stories = await Promise.all(
      nextIds.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (res) => res.json()
        )
      )
    );

    const ul = document.getElementById("news-list");
    stories.forEach((story) => {
      if (!story) return;

      const li = document.createElement("li");

      const titleSpan = document.createElement("span");
      titleSpan.textContent = story.title;
      titleSpan.classList.add("news");
      li.appendChild(titleSpan);
      const timeDiv = document.createElement("div");
      timeDiv.classList.add("article-time");
      // Converto il timestamp in data leggibile
      const date = new Date(story.time * 1000); // timestamp in secondi -> ms
      // Formatta la data, ad esempio in formato ISO o locale
      timeDiv.textContent = date.toLocaleString();
      titleSpan.appendChild(timeDiv);

      const wrapper = document.createElement("div");
      wrapper.classList.add("visit-article-wrapper");

      const btn = document.createElement("button");
      btn.textContent = "Visit Article";
      btn.classList.add("btn-visit-article");
      li.appendChild(wrapper);
      wrapper.appendChild(btn);
      btn.onclick = () => {
        const url =
          story.url || `https://news.ycombinator.com/item?id=${story.id}`;
        window.open(url, "_blank");
      };

      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Errore:", err);
  }
}

// All’avvio carico la lista degli ID
fetch("/news")
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then((ids) => {
    allIds = ids;
    return loadStories();
  })
  .then(() => {
    // Mostro tutto il contenuto SOLO dopo il caricamento dei primi articoli
    document.getElementById("content-wrapper").style.display = "block";
  })
  .catch((err) => console.error("Errore:", err));

document.getElementById("load-more").addEventListener("click", () => {
  loadStories();
});
