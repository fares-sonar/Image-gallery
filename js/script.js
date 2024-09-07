const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");
const arrowsBtn = document.querySelectorAll(".wrapper i");
const firstCardWidth = document.querySelector(".card").offsetWidth;

const carouselChildren = [...carousel.children];

let isDragging = false,
  startX,
  startScrollLeft,
  timeoutId;

// Get how many cards can fit in the carousel width
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

//  inserts the last few cards just inside the start of the carousel container for infinite scrolling
carouselChildren
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });
//  inserts the last few cards just inside the end of the carousel container for infinite scrolling
carouselChildren.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial X position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if the isDragging is false won't work

  // Calculate the difference from the start position
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const autoPlay = () => {
  if (window.innerWidth < 800) return; // Return if window is smaller than 800
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

const infiniteScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    // if the carousel is in the beginning, scroll to the end
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  } else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    // if the carousel is in the end, scroll to the beginning
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // clear existing time & start autoPlay if mouse is not hovering over the carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
carousel.addEventListener("mouseleave", autoPlay);
