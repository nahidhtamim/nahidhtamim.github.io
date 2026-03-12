var divs = ["Section1", "Section2", "Section3", "Section4", "Section5"];
var navMap = { "Section1": "about", "Section2": "resume", "Section3": "work", "Section4": "contact", "Section5": "education" };
var navOrder = ["Section1", "Section2", "Section5", "Section3", "Section4"];
var visibleId = "Section1";
var flipTimeout = null;

function updateCorners(id) {
    var idx = navOrder.indexOf(id);
    var nextCorner = document.getElementById('page-corner-next');
    var prevCorner = document.getElementById('page-corner-prev');
    if (!nextCorner || !prevCorner) return;

    if (idx < navOrder.length - 1) {
        nextCorner.style.display = '';
        nextCorner.onclick = function() { show(navOrder[idx + 1]); };
    } else {
        nextCorner.style.display = 'none';
    }

    if (idx > 0) {
        prevCorner.style.display = '';
        prevCorner.onclick = function() { show(navOrder[idx - 1]); };
    } else {
        prevCorner.style.display = 'none';
    }
}

function show(id) {
    var previousId = visibleId;
    visibleId = id;

    // Cancel any in-progress flip
    if (flipTimeout) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
        divs.forEach(function(did) {
            var d = document.getElementById(did);
            if (d) { d.classList.remove('page-flip-out'); d.classList.remove('page-flip-in'); }
        });
    }

    // Update active nav immediately
    document.querySelectorAll('.sidenav-link').forEach(function(el) {
        el.classList.remove('active-nav');
    });
    var activeNavId = navMap[id];
    if (activeNavId) {
        var activeEl = document.getElementById(activeNavId);
        if (activeEl) activeEl.classList.add('active-nav');
    }

    // Update corner buttons
    updateCorners(id);

    if (previousId && previousId !== id) {
        // Phase 1: flip out the old section
        var outSection = document.getElementById(previousId);
        if (outSection) {
            outSection.classList.remove('page-flip-out');
            void outSection.offsetWidth;
            outSection.classList.add('page-flip-out');
        }

        // Phase 2: after flip-out, hide old / show new and flip in
        flipTimeout = setTimeout(function() {
            flipTimeout = null;
            hide();
            if (outSection) outSection.classList.remove('page-flip-out');

            var inSection = document.getElementById(id);
            if (inSection) {
                inSection.classList.remove('page-flip-in');
                void inSection.offsetWidth;
                inSection.classList.add('page-flip-in');
            }

            if (id === 'Section3') {
                setTimeout(function() { $(".projects").isotope('layout'); }, 50);
            }
        }, 200);

    } else {
        // First load or same tab clicked
        hide();
        var inSection = document.getElementById(id);
        if (inSection) {
            inSection.classList.remove('page-flip-in');
            void inSection.offsetWidth;
            inSection.classList.add('page-flip-in');
        }
        if (id === 'Section3') {
            setTimeout(function() { $(".projects").isotope('layout'); }, 50);
        }
    }
}

function hide() {
    var div, i, id;
    for (i = 0; i < divs.length; i++) {
        id = divs[i];
        div = document.getElementById(id);
        if (visibleId === id) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}

(function() {
    "use strict";

    var $projects = $(".projects");

    $projects.isotope({
        itemSelector: ".item",
        layoutMode: "fitRows",
        percentPosition: true
    });

    $(".pf-filters li").on("click", function(e) {
        e.preventDefault();

        var filter = $(this).attr("data-bs-filter");

        $(".pf-filters li").removeClass("active");
        $(this).addClass("active");

        $projects.isotope({
            filter: filter
        });
    });

})(jQuery);

(function() {
    var words = ['Web Developer', 'Full-Stack Engineer', 'Web Designer'];
    var el = document.getElementById('profession');
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 90;
    var deleteSpeed = 50;
    var pauseAfterType = 1800;
    var pauseAfterDelete = 400;

    function type() {
        var current = words[wordIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        var delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === current.length) {
            delay = pauseAfterType;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = pauseAfterDelete;
        }

        setTimeout(type, delay);
    }

    type();
})();

// Reviews slider
(function() {
    var track = document.querySelector('.reviews-track');
    var dotsContainer = document.querySelector('.reviews-dots');
    var prevBtn = document.querySelector('.reviews-arrow-prev');
    var nextBtn = document.querySelector('.reviews-arrow-next');
    if (!track) return;

    var cards = track.querySelectorAll('.review-card');
    var total = cards.length;
    var perPage = 2;
    var pages = Math.ceil(total / perPage);
    var current = 0;
    var autoTimer = null;

    // Build dots
    for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
        (function(idx) { dot.addEventListener('click', function() { goTo(idx); }); })(i);
        dotsContainer.appendChild(dot);
    }

    function goTo(page) {
        current = page;
        // Each card is 50% of outer width minus gap; shift by page * (2 cards + gap)
        var cardWidth = track.parentElement.offsetWidth;
        var offset = current * (cardWidth + 12);
        track.style.transform = 'translateX(-' + offset + 'px)';

        // Update dots
        var dots = dotsContainer.querySelectorAll('.reviews-dot');
        dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });

        // Update arrows
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === pages - 1;

        resetAuto();
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(function() {
            goTo(current < pages - 1 ? current + 1 : 0);
        }, 4000);
    }

    prevBtn.addEventListener('click', function() { if (current > 0) goTo(current - 1); });
    nextBtn.addEventListener('click', function() { if (current < pages - 1) goTo(current + 1); });

    goTo(0);
})();

// Corner page-turn navigation
(function() {
    var detailsEl = document.querySelector('.details');
    if (!detailsEl) return;

    var nextCorner = document.createElement('div');
    nextCorner.id = 'page-corner-next';
    nextCorner.className = 'page-corner page-corner-next';
    nextCorner.title = 'Next';
    detailsEl.appendChild(nextCorner);

    var prevCorner = document.createElement('div');
    prevCorner.id = 'page-corner-prev';
    prevCorner.className = 'page-corner page-corner-prev';
    prevCorner.title = 'Previous';
    detailsEl.appendChild(prevCorner);

    updateCorners(visibleId);
})();

// Light / Dark mode toggle
(function() {
    var btn = document.getElementById('theme-toggle');
    var icon = document.getElementById('theme-icon');
    if (!btn) return;

    function applyTheme(mode) {
        if (mode === 'light') {
            document.body.classList.add('light-mode');
            icon.className = 'bi bi-moon-fill';
            btn.querySelector('span').textContent = 'Dark';
        } else {
            document.body.classList.remove('light-mode');
            icon.className = 'bi bi-sun-fill';
            btn.querySelector('span').textContent = 'Light';
        }
    }

    // Restore saved preference
    applyTheme(localStorage.getItem('theme') || 'dark');

    btn.addEventListener('click', function() {
        var next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });
})();
