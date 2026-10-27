$(document).ready(function () {
    const apiUrl = "https://openlibrary.org/subjects/programming.json?limit=10";
    const $loadButton = $("#loadBooks");
    const $bookList = $("#bookList");
    const $statusMessage = $("#statusMessage");

    // Load the books only after the user requests them.
    $("#loadBooks").click(function () {
        $loadButton.prop("disabled", true);
        $bookList.empty();
        $statusMessage
            .removeClass("is-error")
            .text("Loading books...");

        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function (response) {
                const works = response && Array.isArray(response.works)
                    ? response.works
                    : [];

                $bookList.empty();

                if (works.length === 0) {
                    $statusMessage
                        .removeClass("is-error")
                        .text("No books were found. Please try again later.");
                    return;
                }

                $statusMessage.empty();

                // Build each card with text nodes so API content is never treated as HTML.
                $.each(works, function (index, book) {
                    const title = book && typeof book.title === "string" && book.title.trim()
                        ? book.title
                        : "Untitled";
                    const authors = book && Array.isArray(book.authors)
                        ? book.authors
                            .map(function (author) {
                                return author && typeof author.name === "string"
                                    ? author.name.trim()
                                    : "";
                            })
                            .filter(Boolean)
                        : [];
                    const authorNames = authors.length > 0
                        ? authors.join(", ")
                        : "Unknown Author";

                    const $card = $("<article>").addClass("book-card");
                    const $title = $("<h3>").text(title);
                    const $author = $("<p>")
                        .addClass("book-author")
                        .append($("<strong>").text("Author: "))
                        .append(document.createTextNode(authorNames));

                    $card.append($title, $author);
                    $bookList.append($card);
                });
            },
            error: function () {
                $bookList.empty();
                $statusMessage
                    .addClass("is-error")
                    .text("We couldn't load the books. Check your internet connection and try again.");
            },
            complete: function () {
                $loadButton.prop("disabled", false);
            }
        });
    });
});
