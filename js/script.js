const pageOrder = ["Section1", "Section2", "Section5", "Section3", "Section4"];
let activePageId = "Section1";
let flipTimer = null;

const bookPages = document.querySelector(".book-pages");
const pageSheets = Array.from(document.querySelectorAll(".page-sheet"));
const railLinks = Array.from(document.querySelectorAll(".rail-link"));
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const targetButtons = Array.from(document.querySelectorAll("[data-target]"));

function getPageIndex(id) {
    return pageOrder.indexOf(id);
}

function updateRail(id) {
    railLinks.forEach((link) => {
        link.classList.toggle("active-nav", link.dataset.target === id);
    });
}

function updatePagination(id) {
    const index = getPageIndex(id);
    prevButton.disabled = index <= 0;
    nextButton.disabled = index >= pageOrder.length - 1;
}

function showPage(id, withAnimation = true) {
    if (!pageOrder.includes(id) || id === activePageId && withAnimation) {
        updateRail(activePageId);
        updatePagination(activePageId);
        return;
    }

    const previousId = activePageId;
    const previousIndex = getPageIndex(previousId);
    const nextIndex = getPageIndex(id);
    const direction = nextIndex > previousIndex ? "forward" : "backward";

    if (flipTimer) {
        clearTimeout(flipTimer);
        flipTimer = null;
        bookPages.classList.remove("is-flipping", "flip-forward", "flip-backward");
    }

    const activate = () => {
        pageSheets.forEach((sheet) => {
            sheet.classList.toggle("active-page", sheet.id === id);
        });
        activePageId = id;
        updateRail(id);
        updatePagination(id);
    };

    if (!withAnimation || window.innerWidth <= 920) {
        activate();
        return;
    }

    bookPages.classList.add("is-flipping", direction === "forward" ? "flip-forward" : "flip-backward");

    flipTimer = window.setTimeout(() => {
        activate();
    }, 320);

    window.setTimeout(() => {
        bookPages.classList.remove("is-flipping", "flip-forward", "flip-backward");
        flipTimer = null;
    }, 860);
}

targetButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
        const { target } = element.dataset;
        if (!target) {
            return;
        }

        if (element.tagName === "A") {
            event.preventDefault();
        }

        showPage(target);
    });
});

prevButton.addEventListener("click", () => {
    const currentIndex = getPageIndex(activePageId);
    if (currentIndex > 0) {
        showPage(pageOrder[currentIndex - 1]);
    }
});

nextButton.addEventListener("click", () => {
    const currentIndex = getPageIndex(activePageId);
    if (currentIndex < pageOrder.length - 1) {
        showPage(pageOrder[currentIndex + 1]);
    }
});

const professionWords = [
    "backend systems",
    "Laravel products",
    "scalable web apps",
    "client-ready platforms"
];

const professionNode = document.getElementById("profession");

if (professionNode) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeProfession = () => {
        const currentWord = professionWords[wordIndex];

        if (deleting) {
            charIndex -= 1;
        } else {
            charIndex += 1;
        }

        professionNode.textContent = currentWord.slice(0, charIndex);

        let delay = deleting ? 55 : 90;

        if (!deleting && charIndex === currentWord.length) {
            deleting = true;
            delay = 1400;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % professionWords.length;
            delay = 280;
        }

        window.setTimeout(typeProfession, delay);
    };

    typeProfession();
}

const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
            const visible = filter === "all" || card.dataset.category === filter;
            card.hidden = !visible;
        });
    });
});

window.addEventListener("resize", () => {
    updatePagination(activePageId);
});

showPage(activePageId, false);
