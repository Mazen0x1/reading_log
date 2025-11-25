let books = JSON.parse(localStorage.getItem("books") || "[]");

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("addForm")) initAddPage();
    if (document.getElementById("bookTable")) initIndexPage();
});

function initAddPage() {
    document.getElementById("addForm").onsubmit = e => {
        e.preventDefault();
        let file = document.getElementById("image").files[0];
        let reader = new FileReader();
        reader.onload = () => {
            books.push({
                title: title.value,
                author: author.value,
                year: year.value,
                pages: pages.value,
                status: Status.value,
                rating: rating.value,
                notes: notes.value,
                image: file ? reader.result : ""
            });
            saveBooks();
            window.location.href = "index.html";
        };
        if (file) reader.readAsDataURL(file); else reader.onload();
    };
}

function initIndexPage() {
    renderBooks();
    document.getElementById("search").onkeyup = renderBooks;
    document.getElementById("filterStatus").onchange = renderBooks;
}

function renderBooks() {
    let table = document.getElementById("bookTable");
    let search = document.getElementById("search").value.toLowerCase();
    let filter = document.getElementById("filterStatus").value;

    table.innerHTML = "";

    books
        .filter(b => (b.title.toLowerCase().includes(search) || b.author.toLowerCase().includes(search)) &&
            (filter === "" || b.status === filter))
        .forEach((b, i) => {
            let row = table.insertRow();
            row.innerHTML = `
        <td><img src="${b.image}" class="img-fluid rounded" style="width:60px;height:80px;object-fit:cover"></td>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.year}</td>
        <td>${b.pages}</td>
        <td>${b.status}</td>
        <td>${b.rating || "-"}</td>
        <td>${b.notes || "-"}</td>
        <td>
          <button onclick="deleteBook(${i})" class="btn btn-danger btn-sm">حذف</button>
        </td>
      `;
        });

    renderStats();
}

function deleteBook(i) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        books.splice(i, 1);
        saveBooks();
        renderBooks();
    }
}

function renderStats() {
    let total = books.length;
    let completed = books.filter(b => b.status === "مكتمل").length;
    let reading = books.filter(b => b.status === "قيد القراءة").length;
    let want = books.filter(b => b.status === "أريد قراءته").length;
    let totalPages = books.reduce((sum, b) => sum + Number(b.pages || 0), 0);

    document.getElementById("stats").innerText =
        `إجمالي الكتب: ${total} | مكتمل: ${completed} | قيد القراءة: ${reading} | أريد قراءته: ${want} | إجمالي الصفحات: ${totalPages}`;
}
