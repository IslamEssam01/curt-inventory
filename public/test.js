document.body.addEventListener("htmx:targetError", function (evt) {
    const event = evt;
    console.error("HTMX target error:", event.detail);
});
