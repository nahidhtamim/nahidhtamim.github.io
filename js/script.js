var divs = ["Section1", "Section2", "Section3", "Section4"];
var visibleId = null;

function show(id) {
    if (visibleId !== id) {
        visibleId = id;
    }
    hide();
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
        layoutMode: "fitRows"
    });

    $("ul.filters > li").on("click", function(e) {
        e.preventDefault();

        var filter = $(this).attr("data-bs-filter");

        $("ul.filters > li").removeClass("active");
        $(this).addClass("active");

        $projects.isotope({
            filter: filter
        });
    });

    $(".project")
        .mouseenter(function() {
            $(this)
                .find(".project-overlay")
                .css({
                    top: "-100%"
                });
            $(this)
                .find(".project-hover")
                .css({
                    top: "0"
                });
        })
        .mouseleave(function() {
            $(this)
                .find(".project-overlay")
                .css({
                    top: "0"
                });
            $(this)
                .find(".project-hover")
                .css({
                    top: "100%"
                });
        });
})(jQuery);

(function() {
    var words = [
            'Web Developer',
            'Web Designer',
            'Freelancer',
        ],
        i = 0;
    setInterval(function() {
        $('#profession').fadeOut(function() {
            $(this).html(words[i = (i + 1) % words.length]).fadeIn();
        });
    }, 2000);

})();