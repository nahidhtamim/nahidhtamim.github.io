var divs = ["Section1", "Section2", "Section3", "Section4", "Section5"];
var navMap = { "Section1": "about", "Section2": "resume", "Section3": "work", "Section4": "contact", "Section5": "education" };
var navOrder = ["Section1", "Section2", "Section5", "Section3", "Section4"];
var pageNumbers = { "Section1": 2, "Section2": 3, "Section5": 4, "Section3": 5, "Section4": 6 };
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

    // On mobile, scroll to the content area after switching
    if (window.innerWidth <= 768) {
        setTimeout(function() {
            var section = document.getElementById(id);
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Determine flip direction
    var prevIdx = navOrder.indexOf(previousId);
    var newIdx = navOrder.indexOf(id);
    var goingForward = newIdx > prevIdx;

    // Cancel any in-progress flip
    if (flipTimeout) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
        divs.forEach(function(did) {
            var d = document.getElementById(did);
            if (d) {
                d.classList.remove('page-flip-out-fwd', 'page-flip-in-fwd',
                                   'page-flip-out-back', 'page-flip-in-back');
            }
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

    // Update page number
    var pageNumEl = document.getElementById('page-num');
    if (pageNumEl && pageNumbers[id]) {
        pageNumEl.textContent = pageNumbers[id];
    }

    if (previousId && previousId !== id) {
        var outClass = goingForward ? 'page-flip-out-fwd' : 'page-flip-out-back';
        var inClass = goingForward ? 'page-flip-in-fwd' : 'page-flip-in-back';

        // Phase 1: flip out the old section
        var outSection = document.getElementById(previousId);
        if (outSection) {
            outSection.classList.remove(outClass);
            void outSection.offsetWidth;
            outSection.classList.add(outClass);
        }

        // Phase 2: after flip-out, hide old / show new and flip in
        flipTimeout = setTimeout(function() {
            flipTimeout = null;
            hide();
            if (outSection) outSection.classList.remove(outClass);

            var inSection = document.getElementById(id);
            if (inSection) {
                inSection.classList.remove(inClass);
                void inSection.offsetWidth;
                inSection.classList.add(inClass);
            }

            if (id === 'Section3') {
                setTimeout(function() { $(".projects").isotope('layout'); }, 50);
            }
        }, 350);

    } else {
        // First load or same tab clicked
        hide();
        var inSection = document.getElementById(id);
        if (inSection) {
            inSection.classList.remove('page-flip-in-fwd');
            void inSection.offsetWidth;
            inSection.classList.add('page-flip-in-fwd');
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
    var current = 0;
    var autoTimer = null;

    function getPerPage() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    var perPage = getPerPage();
    var pages = Math.ceil(total / perPage);

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < pages; i++) {
            var dot = document.createElement('button');
            dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
            (function(idx) { dot.addEventListener('click', function() { goTo(idx); }); })(i);
            dotsContainer.appendChild(dot);
        }
    }

    buildDots();

    function goTo(page) {
        current = page;
        var cardWidth = track.parentElement.offsetWidth;
        var offset = current * (cardWidth + 12);
        track.style.transform = 'translateX(-' + offset + 'px)';

        var dots = dotsContainer.querySelectorAll('.reviews-dot');
        dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });

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

    // Recalculate on resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            var newPerPage = getPerPage();
            if (newPerPage !== perPage) {
                perPage = newPerPage;
                pages = Math.ceil(total / perPage);
                current = 0;
                buildDots();
            }
            goTo(current);
        }, 200);
    });

    prevBtn.addEventListener('click', function() { if (current > 0) goTo(current - 1); });
    nextBtn.addEventListener('click', function() { if (current < pages - 1) goTo(current + 1); });

    track.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
    track.addEventListener('mouseleave', function() { resetAuto(); });

    goTo(0);
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
        } else {
            document.body.classList.remove('light-mode');
            icon.className = 'bi bi-sun-fill';
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

// Portfolio card click — open modal
(function() {
    var modal = document.getElementById('pf-modal');
    var closeBtn = document.getElementById('pf-modal-close');
    if (!modal) return;

    document.querySelectorAll('.pf-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.pf-btn')) return;

            var title = card.getAttribute('data-pf-title') || '';
            var cat = card.getAttribute('data-pf-cat') || '';
            var desc = card.getAttribute('data-pf-desc') || '';
            var tags = card.getAttribute('data-pf-tags') || '';
            var img = card.getAttribute('data-pf-img') || '';
            var link = card.getAttribute('data-pf-link') || '';

            document.getElementById('pf-modal-img').src = img;
            document.getElementById('pf-modal-img').alt = title;
            document.getElementById('pf-modal-cat').textContent = cat;
            document.getElementById('pf-modal-title').textContent = title;
            document.getElementById('pf-modal-desc').textContent = desc;

            var tagsEl = document.getElementById('pf-modal-tags');
            tagsEl.innerHTML = '';
            tags.split(',').forEach(function(t) {
                if (t.trim()) {
                    var span = document.createElement('span');
                    span.textContent = t.trim();
                    tagsEl.appendChild(span);
                }
            });

            var actionsEl = document.getElementById('pf-modal-actions');
            actionsEl.innerHTML = '';
            if (link) {
                var a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.className = 'pf-modal-btn-primary';
                a.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> Visit Live Site';
                actionsEl.appendChild(a);
            }

            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });
})();

// Scroll reveal
(function() {
    var selectors =
        '.details h3.gradient,' +
        '.about-stats,' +
        '.service-card,' +
        '.about-stat-featured,' +
        '.about-stat-card,' +
        '.contact-item,' +
        '.contact-social-btn,' +
        '.contact-form,' +
        '.timeline-item,' +
        '.numbered-card,' +
        '.pf-card,' +
        '.cf-group,' +
        '.skill-card,' +
        '.edu-card,' +
        '.reviews-section,' +
        '.turn-page-prompt';

    var containers = document.querySelectorAll('.aboutDiv, .resumeDiv, .workDiv, .contactDiv, .educationDiv');
    var observers = new Map();

    var isMobile = window.innerWidth <= 768;

    // Create an IntersectionObserver per scroll container
    // On mobile, content is not overflow-scroll, so use viewport (root: null)
    containers.forEach(function(container) {
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: isMobile ? null : container, threshold: 0.15 });
        observers.set(container, obs);
    });

    function initSection(section) {
        if (!section) return;
        var container = section.closest('.aboutDiv, .resumeDiv, .workDiv, .contactDiv, .educationDiv') || section;
        var obs = observers.get(container);
        if (!obs) return;

        container.querySelectorAll(selectors).forEach(function(el) {
            if (!el.classList.contains('scroll-reveal')) {
                el.classList.add('scroll-reveal');
            }
            el.classList.remove('revealed');
            obs.observe(el);
        });
    }

    // Hook into section switching
    var origShow = window.show;
    window.show = function(id) {
        origShow(id);
        setTimeout(function() {
            var section = document.getElementById(id);
            initSection(section);
        }, 60);
    };

    // Init the visible section on load
    containers.forEach(function(c) { initSection(c); });
})();

// Random orb movement
(function() {
    var orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function moveOrb(orb) {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var size = orb.offsetWidth || 250;

        var x = rand(-size * 0.4, vw - size * 0.6);
        var y = rand(-size * 0.4, vh - size * 0.6);
        var scale = rand(0.8, 1.3);

        orb.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
    }

    // Initial random placement (instant, no transition)
    orbs.forEach(function(orb) {
        orb.style.transition = 'none';
        moveOrb(orb);
    });

    // Enable transitions after initial placement
    setTimeout(function() {
        orbs.forEach(function(orb) {
            orb.style.transition = '';
        });
    }, 50);

    // Move each orb on its own random timer
    orbs.forEach(function(orb) {
        function loop() {
            var delay = rand(12000, 22000);
            setTimeout(function() {
                moveOrb(orb);
                loop();
            }, delay);
        }
        loop();
    });
})();
