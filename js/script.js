
const BOOKS = [
    {
        id: 1,
        title: "Алхимич",
        author: "Пауло Коэльо",
        category: "Уран зохиол",
        price: 28000,
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"
    },
    {
        id: 2,
        title: "Атомын дадал",
        author: "Жеймс Клир",
        category: "Сэтгэл зүй",
        price: 35000,
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600"
    },
    {
        id: 3,
        title: "Сэтгэж баяж",
        author: "Наполеон Хилл",
        category: "Бизнес",
        price: 32000,
        tag: "EDITOR'S PICK",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"
    },
    {
        id: 4,
        title: "Ирээдүйн код",
        author: "Технологийн цуврал",
        category: "Технологи",
        price: 42000,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"
    },
    {
        id: 5,
        title: "Жижиг ханхүү",
        author: "Антуан де Сент-Экзюпери",
        category: "Уран зохиол",
        price: 24000,
        tag: "CLASSIC",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600"
    },
    {
        id: 6,
        title: "Оюун санааны хүч",
        author: "Өөрийгөө хөгжүүлэх",
        category: "Сэтгэл зүй",
        price: 30000,
        tag: "TRENDING",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600"
    },
    {
        id: 7,
        title: "Эхлэлийн стратеги",
        author: "Бизнесийн номын сан",
        category: "Бизнес",
        price: 38000,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600"
    },
    {
        id: 8,
        title: "Дижитал ертөнц",
        author: "Мэдээллийн технологи",
        category: "Технологи",
        price: 45000,
        tag: "FEATURED",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600"
    }
];

// Үнийг форматлах
const money = number =>
    new Intl.NumberFormat("mn-MN").format(number) + "₮";

// Сагс авах
function getCart() {
    try {
        return JSON.parse(localStorage.getItem("booklyCart") || "[]");
    } catch {
        return [];
    }
}

// Сагс хадгалах
function saveCart(cart) {
    localStorage.setItem("booklyCart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Сагсны тоо
function updateCartCount() {
    const count = getCart().reduce(
        (sum, item) => sum + item.qty, 0
    );

    document.querySelectorAll("#cart-count").forEach(element => {
        element.textContent = count;
    });
}

// Номын карт
function card(book) {
    return `
        <article class="book-card">

            <div class="book-cover">

                <img
                    src="${book.image}"
                    alt="${book.title} номын хавтас"
                    loading="lazy">

                <span class="book-tag">${book.tag}</span>

            </div>

            <div class="book-info">

                <small>${book.category.toUpperCase()}</small>

                <h3>${book.title}</h3>

                <p>${book.author}</p>

                <div class="book-bottom">

                    <span class="book-price">
                        ${money(book.price)}
                    </span>

                    <button
                        class="add-btn"
                        data-add="${book.id}">
                        + Сагсанд
                    </button>

                </div>

            </div>

        </article>
    `;
}

// Ном гаргах
function renderBooks(targetId, limit) {

    const target = document.getElementById(targetId);

    if (!target) return;

    target.innerHTML = BOOKS
        .slice(0, limit || BOOKS.length)
        .map(card)
        .join("");
}

// Номын дэлгүүр
function initCatalog() {

    const params = new URLSearchParams(location.search);

    let category = params.get("category") || "Бүгд";

    const search = document.getElementById("book-search");

    function draw() {

        const q = search.value.toLowerCase();

        const list = BOOKS.filter(book => {

            const categoryMatch =
                category === "Бүгд" ||
                book.category === category;

            const searchMatch =
                book.title.toLowerCase().includes(q) ||
                book.author.toLowerCase().includes(q);

            return categoryMatch && searchMatch;
        });

        document.getElementById("all-books").innerHTML =
            list.length
                ? list.map(card).join("")
                : '<p class="empty-state">Тохирох ном олдсонгүй.</p>';

        document.getElementById("result-count").textContent =
            `${list.length} ном олдлоо`;
    }

    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "selected",
            button.dataset.filter === category
        );

        button.addEventListener("click", () => {

            category = button.dataset.filter;

            document.querySelectorAll(".filter-btn").forEach(btn => {
                btn.classList.toggle("selected", btn === button);
            });

            draw();
        });
    });

    search.addEventListener("input", draw);

    draw();

    renderCart();
}

// Сагс харуулах
function renderCart() {

    const target = document.getElementById("cart-items");

    if (!target) return;

    const cart = getCart();

    if (!cart.length) {

        target.innerHTML =
            '<p class="muted">Таны сагс одоогоор хоосон байна.</p>';

        document.getElementById("cart-total").textContent = money(0);

        return;
    }

    target.innerHTML = cart.map(item => {

        const book = BOOKS.find(b => b.id === item.id);

        return `
            <div class="cart-row">

                <span>
                    <b>${book.title}</b>
                    <span class="muted">× ${item.qty}</span>
                </span>

                <span>
                    ${money(book.price * item.qty)}

                    <button data-remove="${book.id}">
                        Хасах
                    </button>
                </span>

            </div>
        `;

    }).join("");

    const total = cart.reduce((sum, item) => {

        const book = BOOKS.find(b => b.id === item.id);

        return sum + book.price * item.qty;

    }, 0);

    document.getElementById("cart-total").textContent =
        money(total);
}

// Сагсанд нэмэх, хасах
document.addEventListener("click", event => {

    const add = event.target.closest("[data-add]");

    if (add) {

        const id = Number(add.dataset.add);

        const cart = getCart();

        const item = cart.find(x => x.id === id);

        if (item) {
            item.qty++;
        } else {
            cart.push({ id, qty: 1 });
        }

        saveCart(cart);

        add.textContent = "Нэмэгдлээ ✓";

        setTimeout(() => {
            add.textContent = "+ Сагсанд";
        }, 1100);
    }

    const remove = event.target.closest("[data-remove]");

    if (remove) {

        const id = Number(remove.dataset.remove);

        saveCart(getCart().filter(x => x.id !== id));
    }
});

// Гар утасны цэс
document.querySelectorAll(".menu-toggle").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelector(".main-nav")
            ?.classList.toggle("open");

    });

});

// Захиалга
document.getElementById("checkout-btn")
    ?.addEventListener("click", () => {

        const cart = getCart();

        if (!cart.length) {
            alert("Эхлээд сагсандаа ном нэмнэ үү.");
            return;
        }

        alert(
            "Захиалгын демо амжилттай! Бодит төлбөр хийгдэхгүй."
        );

        localStorage.removeItem("booklyCart");

        updateCartCount();
        renderCart();
    });

// Холбоо барих форм
document.getElementById("contact-form")
    ?.addEventListener("submit", event => {

        event.preventDefault();

        document.getElementById("contact-status").textContent =
            "Баярлалаа! Таны мессежийг демо байдлаар хүлээн авлаа.";

        event.target.reset();
    });

// Имэйл бүртгэл
document.getElementById("newsletter-form")
    ?.addEventListener("submit", event => {

        event.preventDefault();

        alert("Баярлалаа! Та BOOKLY захидалд бүртгүүллээ.");

        event.target.reset();
    });

// Эхлэх үед
updateCartCount();
