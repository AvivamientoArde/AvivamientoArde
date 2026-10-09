function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('active');
}

// Carrusel principal independiente (#photoCarousel)
document.addEventListener("DOMContentLoaded", function() {
    const photoCarousel = document.getElementById('photoCarousel');
    if (photoCarousel) {
        const slides = photoCarousel.querySelectorAll('.carousel-slide');
        if (slides.length > 0) {
            let currentSlide = 0;
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 4500);
        }
    }
});

function scrollVideos(direction) {
    const grid = document.getElementById('videosGrid');
    if (!grid) return;
    const card = grid.querySelector('.video-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 15;
    grid.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}
function openBookModal() {
    openModal('bookModal');
}
function openContactModal() {
    openModal('contactModal');
}
function closeContactModal() {
    closeModal('contactModal');
}
function sendContactEmail() {
    window.location.href = "mailto:danielriquezes00@gmail.com?subject=Contacto%20Ministerial";
}
function openContactWhatsApp() {
    window.open("https://wa.me/584121074089", "_blank");
}
function goToAmazonBookOuter() {
    const langSelect = document.getElementById('outerBookLangSelect').value;
    let amazonUrl = langSelect === 'es' ? 
        "https://www.amazon.com/liberta-Venezuela-Spanish-Daniel-Riquezes-ebook/dp/B0FBSB2M5Q" : 
        "https://www.amazon.com/-/es/GOD-FREES-VENEZUELA-DANIEL-RIQUEZES/dp/B0GQY4R126";
    window.open(amazonUrl, '_blank');
}
/* ==========================================
   LÓGICA Y DATOS DE LA SECCIÓN DONACIONES
   ========================================== */
let currentDonationType = 'siembra';
let currentDonationMethod = 'pagomovil';
const donationData = {
    pagomovil: {
        title: "Pago Móvil",
        copyText: "Banco Venezuela (0102) - Teléfono: 04125082937 - C.I: 25.389.410",
        instruction: "<strong>Banco:</strong> Banco Venezuela (0102)<br><strong>Teléfono:</strong> 04125082937<br><strong>C.I.:</strong> 25.389.410",
        selectValue: "Pago Móvil",
        isDirectPayment: false
    },
    transferencia: {
        title: "Transferencia Bancaria",
        copyText: "Banco de Venezuela - Cuenta Corriente: 01020515880001188497 - C.I: 25.389.410 - Titular: Daniel Riquezes",
        instruction: "<strong>Banco:</strong> Banco de Venezuela<br><strong>Tipo de Cuenta:</strong> Cuenta Corriente<br><strong>Nro. de Cuenta:</strong> 01020515880001188497<br><strong>Titular:</strong> Daniel Riquezes<br><strong>C.I.:</strong> 25.389.410",
        selectValue: "Transferencia Bancaria",
        isDirectPayment: false
    },
    leadbank: {
        title: "Lead Bank",
        copyText: "Lead Bank - Nro. Cuenta: 218219114220 - Routing: 101019644 - Titular: Daniel Jesus Riquezes Millan",
        instruction: "<strong>Banco:</strong> Lead Bank<br><strong>Nro. de Cuenta:</strong> 218219114220<br><strong>Routing:</strong> 101019644<br><strong>Titular:</strong> Daniel Jesus Riquezes Millan",
        selectValue: "Lead Bank",
        isDirectPayment: false
    },
    western: {
        title: "Western Union",
        copyText: "Western Union - Beneficiario: Daniel Riquezes - C.I: 25.389.410 - País: Venezuela",
        instruction: "<strong>Beneficiario:</strong> Daniel Riquezes<br><strong>C.I.:</strong> 25.389.410<br><strong>País:</strong> Venezuela",
        selectValue: "Western Union",
        isDirectPayment: false
    },
    binance: {
        title: "Binance Pay",
        copyText: "Binance Pay - Correo: danieliquezes@gmail.com",
        instruction: "<strong>ID:</strong> 774141305<br><strong>Moneda recomendada:</strong> USDT",
        selectValue: "Binance Pay",
        isDirectPayment: false
    },
    zinli: {
        title: "Zinli",
        copyText: "Zinli - Correo: danieliquezes@gmail.com",
        instruction: "<strong>Correo Zinli:</strong> danieliquezes@gmail.com",
        selectValue: "Zinli",
        isDirectPayment: false
    },
    paypal: {
        title: "PayPal",
        copyText: "https://www.paypal.com/donate/?hosted_button_id=TU_ID_PAYPAL",
        instruction: "<strong>Correo PayPal:</strong> danielriquezes00@gmail.com<br><strong>Pago Directo:</strong> Haz clic abajo para abonar con tu cuenta de PayPal.",
        selectValue: "PayPal",
        isDirectPayment: true,
        redirectUrl: "https://www.paypal.com/donate"
    },
    tarjeta: {
        title: "Tarjeta Visa / Mastercard",
        copyText: "",
        instruction: "<strong>Cobro en Tiempo Real:</strong> Al hacer clic en el botón de abajo, serás redirigido a la pasarela bancaria protegida con encriptación SSL. Podrás ingresar los datos de tu tarjeta (Visa / Mastercard) con CVV oculto y verificar el cobro en tiempo real.",
        selectValue: "Tarjeta Visa / Mastercard",
        isDirectPayment: true,
        redirectUrl: "https://www.paypal.com/donate"
    }
};

function setDonationType(type, btnElement) {
    currentDonationType = type;
    
    document.querySelectorAll('.donation-type-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }

    updateDonationUI();
}

function selectDonationMethod(methodKey, btnElement) {
    currentDonationMethod = methodKey;

    document.querySelectorAll('.donation-method-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }

    updateDonationUI();
}

function updateDonationUI() {
    const data = donationData[currentDonationMethod] || donationData.pagomovil;
    const typeCapitalized = currentDonationType.charAt(0).toUpperCase() + currentDonationType.slice(1);

    const titleEl = document.getElementById('donationMethodTitle');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${data.title} — ${typeCapitalized}`;
    }

    const instrEl = document.getElementById('donationInstruction');
    if (instrEl) {
        instrEl.innerHTML = data.instruction;
    }

    const actionBtn = document.getElementById('donationActionBtn');
    if (actionBtn) {
        if (data.isDirectPayment) {
            actionBtn.innerHTML = `<i class="fa-solid fa-credit-card"></i> Procesar Pago con ${data.title} (${typeCapitalized})`;
        } else {
            actionBtn.innerHTML = `Copiar Datos de ${data.title} (${typeCapitalized})`;
        }
    }

    const reportLabel = document.getElementById('reportBtnTypeLabel');
    if (reportLabel) {
        reportLabel.innerText = typeCapitalized;
    }

    const modalTypeTitle = document.getElementById('modalFormTypeTitle');
    if (modalTypeTitle) {
        modalTypeTitle.innerText = typeCapitalized;
    }

    const emailSub = document.getElementById('emailSubjectInput');
    if (emailSub) {
        emailSub.value = `¡Nuevo Reporte de Donación: ${typeCapitalized}!`;
    }

    const inputAporte = document.getElementById('inputTipoAporte');
    if (inputAporte) {
        inputAporte.value = typeCapitalized;
    }

    const selectMetodo = document.getElementById('selectMetodoPago');
    if (selectMetodo && data.selectValue) {
        selectMetodo.value = data.selectValue;
    }
}

function proceedDonation() {
    const data = donationData[currentDonationMethod] || donationData.pagomovil;
    
    if (data.isDirectPayment && data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
    } else if (data && data.copyText) {
        navigator.clipboard.writeText(data.copyText).then(() => {
            alert(`¡Datos de ${data.title} copiados al portapapeles!`);
        }).catch(() => {
            alert(`Datos de ${data.title}:\n${data.copyText}`);
        });
    }
}

function openReportModal() {
    updateDonationUI();
    openModal('reportModal');
}

/* ==========================================
   DATOS DE MODALES MULTI-IDIOMA COMPLETOS
   ========================================== */
const ministryModalContent = window.ARDE_MODAL_CONTENT;


let modalSlideIndex = 0;
let modalSlideInterval = null;

function moveModalSlide(direction) {
    const slider = document.getElementById('modalSlider');
    if (!slider) return;
    const totalSlides = slider.children.length;
    if (!totalSlides) return;
    modalSlideIndex = (modalSlideIndex + direction + totalSlides) % totalSlides;
    slider.style.transform = `translateX(-${(modalSlideIndex * 100) / totalSlides}%)`;
}

function startModalAutoSlide() {
    clearInterval(modalSlideInterval);
    const slider = document.getElementById('modalSlider');
    if (slider && slider.children.length > 1) {
        modalSlideInterval = setInterval(() => {
            moveModalSlide(1);
        }, 4000);
    }
}

const publicAdminCardData = {
    ministerio: [],
    movimiento: [],
    fundacion: []
};

let publicBookData = [];

const publicAdminCardDataAvailable = {
    ministerio: false,
    movimiento: false,
    fundacion: false
};

const publicAdminCardOriginalHeaders = new Map();
let publicAdminCardDataLoaded = false;
let publicAdminCardDataPromise = null;

const publicAdminCardCollections = [
    { type: "ministerio", key: "arde_ministerios", gridId: "ministeriosGrid" },
    { type: "movimiento", key: "arde_movimientos", gridId: "movimientosGrid" },
    { type: "fundacion", key: "arde_fundaciones", gridId: "fundacionesGrid" }
];

function normalizePublicAdminCardKey(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function normalizePublicBookTitle(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/gi, "")
        .toLowerCase();
}

function isPublicImageSource(value) {
    return typeof value === "string" &&
        (value.startsWith("data:image/") ||
            /^https?:\/\//i.test(value) ||
            !/^[a-z][a-z\d+.-]*:/i.test(value));
}

function isAboutSectionPhoto(value) {
    if (typeof value !== "string") return false;

    let path = value.split(/[?#]/, 1)[0];
    try {
        path = decodeURIComponent(path);
    } catch (error) {
        // Keep the original path if it contains malformed percent-encoding.
    }

    const filename = path.split(/[\\/]/).pop().toLowerCase();
    return filename === "foto personal.jpg" || filename === "foto personal 2.jpeg";
}

function getAmazonBookCoverUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";

    let asin = "";
    const input = value.trim();
    if (/^[A-Z0-9]{10}$/i.test(input)) {
        asin = input;
    } else {
        try {
            const url = new URL(input);
            const amazonHost = /(^|\.)amazon\.[a-z.]+$/i.test(url.hostname);
            if (!amazonHost) return "";
            const match = url.pathname.match(/\/(?:dp|gp\/product|exec\/obidos\/ASIN)\/([A-Z0-9]{10})(?:[/?]|$)/i);
            asin = match?.[1] || url.searchParams.get("asin") || "";
        } catch (error) {
            return "";
        }
    }

    if (!/^[A-Z0-9]{10}$/i.test(asin)) return "";
    return `https://images-na.ssl-images-amazon.com/images/P/${asin.toUpperCase()}.01.LZZZZZZZ.jpg`;
}

function renderAdminImagesInModal(images, title) {
    const modalBody = document.getElementById("modalBody");
    if (!modalBody) return;

    const validImages = Array.isArray(images)
        ? images.filter(function (image) {
            return isPublicImageSource(image) && !isAboutSectionPhoto(image);
        })
        : [];
    if (!validImages.length) return;

    const removeEmptyImageFrames = function () {
        modalBody.querySelectorAll("div").forEach(function (frame) {
            const style = window.getComputedStyle(frame);
            if (
                style.overflow === "hidden" &&
                (frame.style.height || frame.style.maxHeight) &&
                !frame.querySelector("img, button") &&
                !frame.textContent.trim()
            ) {
                frame.remove();
            }
        });
    };
    removeEmptyImageFrames();

    const findImageFrame = function (element) {
        let frame = element?.parentElement;
        while (frame && frame !== modalBody) {
            const style = window.getComputedStyle(frame);
            if (style.overflow === "hidden" && frame.clientHeight > 0) return frame;
            frame = frame.parentElement;
        }
        return null;
    };

    const previousSlider = modalBody.querySelector("#modalSlider");
    const carousel =
        findImageFrame(previousSlider) ||
        findImageFrame(modalBody.querySelector("img")) ||
        document.createElement("div");
    carousel.style.position = "relative";
    carousel.style.width = "100%";
    carousel.style.maxWidth = "450px";
    carousel.style.height = "280px";
    carousel.style.margin = "24px auto 0";
    carousel.style.overflow = "hidden";
    carousel.style.border = "1px solid var(--border-gold)";
    carousel.style.borderRadius = "8px";
    carousel.style.background = "#000";
    carousel.dataset.adminCarousel = "true";
    carousel.replaceChildren();

    const slider = document.createElement("div");
    slider.id = "modalSlider";
    slider.style.cssText = "display:flex;height:100%;transition:transform 0.5s ease-in-out;";
    if (validImages.length > 1) {
        [-1, 1].forEach(function (direction) {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("aria-label", direction < 0 ? "Foto anterior" : "Foto siguiente");
            button.innerHTML = `<i class="fa-solid fa-chevron-${direction < 0 ? "left" : "right"}"></i>`;
            button.style.cssText = `position:absolute;z-index:1;top:50%;${direction < 0 ? "left:6px" : "right:6px"};transform:translateY(-50%);padding:8px 11px;border:0;border-radius:4px;background:rgba(0,0,0,.65);color:#fff;cursor:pointer;`;
            button.addEventListener("click", function () {
                moveModalSlide(direction);
            });
            carousel.appendChild(button);
        });
    }
    carousel.appendChild(slider);
    if (!carousel.isConnected) modalBody.appendChild(carousel);

    slider.replaceChildren();
    slider.style.width = `${validImages.length * 100}%`;
    slider.style.transform = "translateX(0)";
    validImages.forEach(function (src, index) {
        const image = document.createElement("img");
        image.src = src;
        image.alt = `${title} - foto ${index + 1}`;
        image.loading = "lazy";
        image.style.cssText = `flex:0 0 ${100 / validImages.length}%;width:${100 / validImages.length}%;height:100%;object-fit:contain;`;
        image.addEventListener("error", function () {
            image.remove();
            const remainingImages = slider.querySelectorAll("img").length;
            if (!remainingImages) {
                carousel.remove();
                return;
            }
            slider.style.width = `${remainingImages * 100}%`;
            slider.querySelectorAll("img").forEach(function (remainingImage) {
                remainingImage.style.flexBasis = `${100 / remainingImages}%`;
                remainingImage.style.width = `${100 / remainingImages}%`;
            });
            modalSlideIndex = Math.min(modalSlideIndex, remainingImages - 1);
            slider.style.transform = `translateX(-${(modalSlideIndex * 100) / remainingImages}%)`;
        });
        slider.appendChild(image);
    });

    modalBody.querySelectorAll("[data-admin-carousel]").forEach(function (otherCarousel) {
        if (otherCarousel !== carousel) otherCarousel.remove();
    });

    modalBody.querySelectorAll("img").forEach(function (image) {
        if (slider.contains(image)) return;
        const duplicateFrame = findImageFrame(image);
        if (duplicateFrame && duplicateFrame !== carousel) {
            duplicateFrame.remove();
        } else {
            image.remove();
        }
    });

    modalBody.querySelectorAll("#modalSlider").forEach(function (otherSlider) {
        if (otherSlider !== slider) otherSlider.parentElement.remove();
    });
    removeEmptyImageFrames();
    modalSlideIndex = 0;
}

function renderPublicBooks() {
    const grid = document.getElementById("publicBooksGrid");
    if (!grid) return;

    grid.querySelectorAll("[data-admin-book]").forEach(function (card) {
        card.remove();
    });
    publicBookData.forEach(function (book) {
        if (!book || typeof book !== "object") return;
        const title = String(book.title || "").trim();
        if (
            !title ||
            String(book.id || "").toLowerCase() === "dios_liberta_venezuela" ||
            normalizePublicBookTitle(title) === "dioslibertaavenezuela"
        ) return;

        const card = document.createElement("article");
        card.className = "ministry-card";
        card.dataset.adminBook = "true";
        card.style.cursor = "default";

        const heading = document.createElement("h3");
        heading.className = "cinzel-font";
        heading.textContent = title;
        heading.style.textAlign = "center";
        card.appendChild(heading);

        const images = Array.isArray(book.images)
            ? book.images.filter(isPublicImageSource)
            : [];
        const purchaseUrl = [book.purchase_url, book.amazon_url, book.url, book.whatsapp]
            .find(function (value) {
                return typeof value === "string" && /^https?:\/\//i.test(value);
            });
        const amazonCover = getAmazonBookCoverUrl(purchaseUrl);
        const coverSource = isPublicImageSource(book.cover) ? book.cover : amazonCover;
        const cover = coverSource ? [coverSource, ...images] : images;
        const uniqueCovers = [...new Set(cover)];
        if (uniqueCovers.length) {
            const gallery = document.createElement("div");
            gallery.className = "public-book-images";
            uniqueCovers.forEach(function (src, index) {
                const image = document.createElement("img");
                image.src = src;
                image.alt = `${title} - portada${index ? ` ${index + 1}` : ""}`;
                image.loading = "lazy";
                if (index === 0 && amazonCover && coverSource === amazonCover) {
                    image.dataset.amazonCoverFallback = "true";
                    image.addEventListener("error", function () {
                        if (image.dataset.amazonCoverFallback === "true") {
                            image.dataset.amazonCoverFallback = "alternate";
                            image.src = `https://m.media-amazon.com/images/P/${amazonCover.match(/\/P\/([A-Z0-9]{10})\./i)?.[1]}.01._SCLZZZZZZZ_.jpg`;
                        } else {
                            image.hidden = true;
                        }
                    });
                }
                gallery.appendChild(image);
            });
            card.appendChild(gallery);
        }

        if (book.summary) {
            const summary = document.createElement("p");
            summary.textContent = book.summary;
            card.appendChild(summary);
        }

        if (book.text) {
            const details = document.createElement("details");
            details.className = "public-book-details";
            const label = document.createElement("summary");
            label.textContent = "Leer más";
            const description = document.createElement("div");
            description.textContent = book.text;
            details.append(label, description);
            card.appendChild(details);
        }

        if (purchaseUrl) {
            const link = document.createElement("a");
            link.className = "btn-gold";
            link.href = purchaseUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Ver libro";
            link.style.display = "block";
            link.style.marginTop = "18px";
            link.style.textAlign = "center";
            card.appendChild(link);
        }

        grid.appendChild(card);
    });
}

function renderPublicAdminCards(collection) {
    const grid = document.getElementById(collection.gridId);
    const items = publicAdminCardData[collection.type];

    if (!grid || !publicAdminCardDataAvailable[collection.type]) return;

    let originalHeaders = publicAdminCardOriginalHeaders.get(collection.type);
    if (!originalHeaders) {
        originalHeaders = new Map();
        grid.querySelectorAll(".ministry-card").forEach(function (card) {
            const cardHeader = card.querySelector(".ministry-card-top");
            if (!cardHeader) return;

            const onclick = card.getAttribute("onclick") || "";
            const match = onclick.match(/openMinistryModal\(['"]([^'"]+)['"]\)/);
            const title = card.querySelector("h3")?.textContent;
            [match && match[1], title]
                .map(normalizePublicAdminCardKey)
                .filter(Boolean)
                .forEach(function (key) {
                    originalHeaders.set(key, cardHeader.innerHTML);
                });
        });
        publicAdminCardOriginalHeaders.set(collection.type, originalHeaders);
    }

    grid.replaceChildren();

    items.forEach(function (item) {
        if (!item || typeof item !== "object") return;

        const itemKey = String(item.id || item.key || item.slug || item.title || "").trim();
        if (!itemKey) return;

        const card = document.createElement("div");
        card.className = "ministry-card";
        card.addEventListener("click", function () {
            openMinistryModal(itemKey);
        });

        const content = document.createElement("div");
        const header = document.createElement("div");
        header.className = "ministry-card-top";

        const savedHeader =
            originalHeaders.get(normalizePublicAdminCardKey(itemKey)) ||
            originalHeaders.get(normalizePublicAdminCardKey(item.title));
        if (savedHeader) {
            header.innerHTML = savedHeader;
        } else {
            const icon = document.createElement("i");
            icon.className = "fa-solid fa-hand-holding-heart main-icon";
            header.appendChild(icon);
        }

        const title = document.createElement("h3");
        title.textContent = item.title || "";

        const summary = document.createElement("p");
        summary.textContent = item.summary || "";

        content.append(header, title, summary);

        const button = document.createElement("button");
        button.className = "card-explore-btn";
        button.type = "button";
        button.innerHTML = '<span data-i18n="read_history">Leer Historia</span> <i class="fa-solid fa-arrow-right"></i>';
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            openMinistryModal(itemKey);
        });

        card.append(content, button);
        grid.appendChild(card);
    });
}

async function loadPublicAdminCardData(forceRefresh) {
    if (publicAdminCardDataLoaded && !forceRefresh) return;
    if (publicAdminCardDataPromise) {
        const pendingLoad = publicAdminCardDataPromise;
        await pendingLoad;
        if (forceRefresh) return loadPublicAdminCardData(true);
        return;
    }

    publicAdminCardDataPromise = (async function () {
        try {
            if (!window.supabase || typeof window.supabase.createClient !== "function") {
                return;
            }

            const client = window.supabase.createClient(
                "https://wufbwtizjzpuccqopvre.supabase.co",
                "sb_publishable_nnf1EBZJeNbOtGVtM59_LQ_0y_ZR8fy"
            );
            const contentKeys = publicAdminCardCollections.map(function (collection) {
                return collection.key;
            });
            contentKeys.push("arde_libros");
            const { data, error } = await client
                .from("site_content")
                .select("content_key,content_value")
                .eq("section", "admin_data")
                .in("content_key", contentKeys);

            if (error) {
                console.error("ARDE: error cargando las tarjetas del Admin:", error);
                return;
            }

            publicAdminCardCollections.forEach(function (collection) {
                publicAdminCardData[collection.type] = [];
                publicAdminCardDataAvailable[collection.type] = false;
            });
            publicBookData = [];

            (data || []).forEach(function (row) {
                if (row.content_key === "arde_libros") {
                    try {
                        const parsedBooks = JSON.parse(row.content_value || "[]");
                        if (Array.isArray(parsedBooks)) {
                            publicBookData = parsedBooks;
                        } else {
                            console.error("ARDE: formato inválido en arde_libros");
                        }
                    } catch (error) {
                        console.error("ARDE: error leyendo arde_libros:", error);
                    }
                    return;
                }

                const collection = publicAdminCardCollections.find(function (entry) {
                    return entry.key === row.content_key;
                });
                if (!collection || !row.content_value) return;

                try {
                    const parsed = JSON.parse(row.content_value);
                    if (Array.isArray(parsed)) {
                        publicAdminCardData[collection.type] = parsed;
                        publicAdminCardDataAvailable[collection.type] = true;
                    } else {
                        console.error("ARDE: formato inválido en " + row.content_key);
                    }
                } catch (error) {
                    console.error("ARDE: error leyendo " + row.content_key + ":", error);
                }
            });

            publicAdminCardDataLoaded = true;
            publicAdminCardCollections.forEach(renderPublicAdminCards);
            renderPublicBooks();
        } catch (error) {
            console.error("ARDE: error sincronizando las tarjetas del Admin:", error);
        } finally {
            publicAdminCardDataPromise = null;
        }
    })();

    return publicAdminCardDataPromise;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPublicAdminCardData);
} else {
    loadPublicAdminCardData();
}

function findPublicAdminCard(key) {
    const normalizedKey = String(key).trim().toLowerCase();

    for (const collection of publicAdminCardCollections) {
        const item = publicAdminCardData[collection.type].find(function (candidate) {
            if (!candidate) return false;
            return [candidate.id, candidate.key, candidate.slug, candidate.title]
                .some(function (value) {
                    return String(value || "").trim().toLowerCase() === normalizedKey;
                });
        });

        if (item) return item;
    }

    return null;
}

async function openMinistryModal(key) {

    const lang = document.getElementById('globalLangSelect')?.value || 'es';

    const langGroup =
        ministryModalContent[lang] ||
        ministryModalContent['es'];

    /*
     * ---------------------------------------------------------
     * 1. CONTENIDO ORIGINAL DEL INDEX
     * ---------------------------------------------------------
     * Si Supabase falla, el modal seguirá funcionando
     * exactamente como antes.
     */

    await loadPublicAdminCardData(true);

    const originalData = langGroup[key];

    const adminItem = findPublicAdminCard(key);
    if (!originalData && !adminItem) return;


    /*
     * ---------------------------------------------------------
     * 2. COPIAMOS EL CONTENIDO ORIGINAL
     * ---------------------------------------------------------
     */

    let data = {
        title: adminItem ? (adminItem.title || "") : ((originalData && originalData.title) || ""),
        text: adminItem && adminItem.text && !(/\.{3,}|…/.test(adminItem.text))
            ? adminItem.text
            : ((originalData && originalData.text) || (adminItem && adminItem.text) || ""),
        whatsapp: adminItem ? (adminItem.whatsapp || "") : ((originalData && originalData.whatsapp) || ""),
        images: adminItem && Array.isArray(adminItem.images)
            ? adminItem.images.filter(isPublicImageSource)
            : []
    };

    /*
     * ---------------------------------------------------------
     * 4. MOSTRAR EL MODAL
     * ---------------------------------------------------------
     */

    document.getElementById('modalTitle').innerText =
        data.title;


    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = data.text;
    modalBody.querySelectorAll("img").forEach(function (image) {
        if (isAboutSectionPhoto(image.getAttribute("src") || "")) {
            let frame = image.parentElement;
            while (frame && frame !== modalBody) {
                const style = window.getComputedStyle(frame);
                if (style.overflow === "hidden" && frame.clientHeight > 0) break;
                frame = frame.parentElement;
            }
            if (frame && frame !== modalBody) {
                frame.remove();
            } else {
                image.remove();
            }
        }
    });

    renderAdminImagesInModal(data.images, data.title);


    const waContainer =
        document.getElementById('modalWhatsappContainer');


    if (data.whatsapp) {

        waContainer.innerHTML = `
            <a
                href="${data.whatsapp}"
                target="_blank"
                class="whatsapp-link-btn"
            >
                <i class="fa-brands fa-whatsapp"></i>
                ${langGroup.wa_btn}
            </a>
        `;

    } else {

        waContainer.innerHTML = '';

    }


    openModal('ministryModal');


    /*
     * ---------------------------------------------------------
     * 5. CARRUSEL DEL MODAL
     * ---------------------------------------------------------
     * Esto queda EXACTAMENTE como lo tenías.
     */

    if (data.images.length > 1 || (
        key === 'dorcas' ||
        key === 'altaralias' ||
        key === 'calles' ||
        key === 'escuadron'
    )) {

        modalSlideIndex = 0;
        startModalAutoSlide();

    } else {

        clearInterval(modalSlideInterval);

    }

}
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
    if (modalId === 'ministryModal') {
        clearInterval(modalSlideInterval);
    }
}

/* ============================================================
   🌍 SISTEMA DE TRADUCCIÓN GLOBAL - ARDE
   Español / English / Русский / 中文 / 日本語
   ============================================================ */

(function () {
    "use strict";

    if (!window.ARDETranslations) {
        window.translatePage = function () {
            if (
                window.ARDETranslation &&
                typeof window.ARDETranslation.retranslate === "function"
            ) {
                window.ARDETranslation.retranslate();
            }
        };

        window.getCurrentLanguage = function () {
            if (
                window.ARDETranslation &&
                typeof window.ARDETranslation.getLanguage === "function"
            ) {
                return window.ARDETranslation.getLanguage();
            }

            return document.getElementById("globalLangSelect")?.value || "es";
        };

        return;
    }

    /* ============================================================
       CONFIGURACIÓN
       ============================================================ */

    const LANGUAGE_STORAGE_KEY = "arde_selected_language";

    const SUPPORTED_LANGUAGES = [
    "es",
    "en",
    "ru",
    "zh",
    "ja",
    "pt",
    "fr",
    "it",
    "ar",
    "he"
];

    let currentLanguage = "es";

    /*
     * Aquí se guardan PERMANENTEMENTE los textos originales
     * en español.
     *
     * Esto evita el error:
     *
     * Español → Inglés → Español
     *
     * donde antes terminaba usando el texto inglés como base.
     */
    const originalSpanishTexts = new WeakMap();
    const originalSpanishAttributes = new WeakMap();


    
    /* ============================================================
       GUARDAR TEXTO ORIGINAL EN ESPAÑOL
       ============================================================ */

    function saveOriginalSpanish(element) {

        if (!element) return;

        if (!originalSpanishTexts.has(element)) {
            originalSpanishTexts.set(element, element.innerHTML);
        }

        if (!originalSpanishAttributes.has(element)) {

            originalSpanishAttributes.set(element, {
                placeholder: element.getAttribute("placeholder"),
                title: element.getAttribute("title"),
                alt: element.getAttribute("alt"),
                ariaLabel: element.getAttribute("aria-label")
            });
        }
    }


    /* ============================================================
       PREPARAR TODOS LOS ELEMENTOS
       ============================================================ */

    function prepareOriginalTexts() {

        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            saveOriginalSpanish(element);
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
            saveOriginalSpanish(element);
        });

        document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
            saveOriginalSpanish(element);
        });

        document.querySelectorAll("[data-i18n-alt]").forEach(function (element) {
            saveOriginalSpanish(element);
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
            saveOriginalSpanish(element);
        });
    }


/* ============================================================
   TRADUCIR TEXTO
   ============================================================ */

function translateElement(element, language) {

    if (!element) return;

    if (element.dataset.liveContent === "true") {
        return;
    }

    saveOriginalSpanish(element);

    const key = element.getAttribute("data-i18n");

    if (!key) return;

    const dictionary = translations[language];

    /*
     * PRIMERO intentamos usar la traducción real del idioma.
     * Esto también funciona con elementos creados dinámicamente
     * por Supabase.
     */
    if (
        dictionary &&
        Object.prototype.hasOwnProperty.call(dictionary, key)
    ) {
        element.innerHTML = dictionary[key];
        return;
    }

    /*
     * Si no existe la clave en el idioma solicitado,
     * para español usamos la traducción española si existe.
     */
    if (
        language === "es" &&
        translations.es &&
        Object.prototype.hasOwnProperty.call(
            translations.es,
            key
        )
    ) {
        element.innerHTML = translations.es[key];
        return;
    }

    /*
     * Último respaldo:
     * usamos el contenido español original guardado.
     */
    const original = originalSpanishTexts.get(element);

    if (language === "es" && original !== undefined) {
        element.innerHTML = original;
    }

        const languageDictionary = translations[language];

        if (!languageDictionary) return;

        if (
            Object.prototype.hasOwnProperty.call(
                languageDictionary,
                key
            )
        ) {

            element.innerHTML = languageDictionary[key];
        }
    }


    /* ============================================================
       PLACEHOLDERS
       ============================================================ */

    function translatePlaceholders(language) {

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {

            saveOriginalSpanish(element);

            const key = element.getAttribute("data-i18n-placeholder");

            if (!key) return;

            if (language === "es") {

                const originals = originalSpanishAttributes.get(element);

                if (originals) {
                    if (originals.placeholder !== null) {
                        element.setAttribute(
                            "placeholder",
                            originals.placeholder
                        );
                    }
                }

                return;
            }

            const dictionary = translations[language];

            if (
                dictionary &&
                Object.prototype.hasOwnProperty.call(dictionary, key)
            ) {

                element.setAttribute(
                    "placeholder",
                    dictionary[key]
                );
            }
        });
    }


    /* ============================================================
       TITLES
       ============================================================ */

    function translateTitles(language) {

        document.querySelectorAll("[data-i18n-title]").forEach(function (element) {

            saveOriginalSpanish(element);

            const key = element.getAttribute("data-i18n-title");

            if (!key) return;

            if (language === "es") {

                const originals = originalSpanishAttributes.get(element);

                if (originals) {

                    if (originals.title !== null) {

                        element.setAttribute(
                            "title",
                            originals.title
                        );

                    }
                }

                return;
            }

            const dictionary = translations[language];

            if (
                dictionary &&
                Object.prototype.hasOwnProperty.call(dictionary, key)
            ) {

                element.setAttribute(
                    "title",
                    dictionary[key]
                );
            }
        });
    }


    /* ============================================================
       ALT DE IMÁGENES
       ============================================================ */

    function translateAlts(language) {

        document.querySelectorAll("[data-i18n-alt]").forEach(function (element) {

            saveOriginalSpanish(element);

            const key = element.getAttribute("data-i18n-alt");

            if (!key) return;

            if (language === "es") {

                const originals = originalSpanishAttributes.get(element);

                if (originals && originals.alt !== null) {

                    element.setAttribute(
                        "alt",
                        originals.alt
                    );
                }

                return;
            }

            const dictionary = translations[language];

            if (
                dictionary &&
                Object.prototype.hasOwnProperty.call(dictionary, key)
            ) {

                element.setAttribute(
                    "alt",
                    dictionary[key]
                );
            }
        });
    }


    /* ============================================================
       ARIA LABEL
       ============================================================ */

    function translateAriaLabels(language) {

        document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {

            saveOriginalSpanish(element);

            const key = element.getAttribute("data-i18n-aria-label");

            if (!key) return;

            if (language === "es") {

                const originals = originalSpanishAttributes.get(element);

                if (originals && originals.ariaLabel !== null) {

                    element.setAttribute(
                        "aria-label",
                        originals.ariaLabel
                    );
                }

                return;
            }

            const dictionary = translations[language];

            if (
                dictionary &&
                Object.prototype.hasOwnProperty.call(dictionary, key)
            ) {

                element.setAttribute(
                    "aria-label",
                    dictionary[key]
                );
            }
        });
    }


    /* ============================================================
       TRADUCIR OPCIONES DE SELECT
       ============================================================ */

    function translateSelectOptions(language) {

        const dictionary = translations[language];

        document.querySelectorAll("select option[data-i18n]").forEach(function (option) {

            saveOriginalSpanish(option);

            const key = option.getAttribute("data-i18n");

            if (!key) return;

            if (language === "es") {

                const original = originalSpanishTexts.get(option);

                if (original !== undefined) {
                    option.innerHTML = original;
                }

                return;
            }

            if (
                dictionary &&
                Object.prototype.hasOwnProperty.call(dictionary, key)
            ) {

                option.innerHTML = dictionary[key];
            }
        });
    }


    /* ============================================================
       TRADUCCIÓN GLOBAL
       ============================================================ */

    function translatePage(language) {

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            language = "es";
        }

        currentLanguage = language;

        /*
         * PRIMERO guardamos absolutamente todos los textos
         * originales antes de modificar alguno.
         */
        prepareOriginalTexts();

        /*
         * Traducir contenido.
         */
        document.querySelectorAll("[data-i18n]").forEach(function (element) {

            translateElement(
                element,
                language
            );

        });

        /*
         * Atributos.
         */
        translatePlaceholders(language);
        translateTitles(language);
        translateAlts(language);
        translateAriaLabels(language);
        translateSelectOptions(language);


        /* ========================================================
           HTML LANG
           ======================================================== */

        document.documentElement.setAttribute(
            "lang",
            language
        );


        /* ========================================================
           SELECTOR GLOBAL
           ======================================================== */

        const selector = document.getElementById(
            "globalLangSelect"
        );

        if (selector) {

            if (selector.value !== language) {
                selector.value = language;
            }
        }


        /* ========================================================
           GUARDAR IDIOMA
           ======================================================== */

        try {

            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                language
            );

        } catch (error) {

            console.warn(
                "No se pudo guardar el idioma:",
                error
            );
        }


        /*
         * Evento personalizado.
         *
         * Esto permite que otros scripts de tu página puedan
         * saber que el idioma cambió sin tener que modificar
         * este sistema.
         */
        document.dispatchEvent(
            new CustomEvent(
                "ardeLanguageChanged",
                {
                    detail: {
                        language: language
                    }
                }
            )
        );
    }


    /* ============================================================
       FUNCIÓN PÚBLICA
       ============================================================ */

    window.changeLanguage = function (language) {

        translatePage(language);

    };
window.translatePage = translatePage;
window.translateElement = translateElement;
window.prepareOriginalTexts = prepareOriginalTexts;

    /* ============================================================
       OBTENER IDIOMA ACTUAL
       ============================================================ */

    window.getCurrentLanguage = function () {

        return currentLanguage;

    };


    /* ============================================================
       OBTENER TRADUCCIÓN
       ============================================================ */

    window.getTranslation = function (key, language) {

        language = language || currentLanguage;

        if (
            translations[language] &&
            Object.prototype.hasOwnProperty.call(
                translations[language],
                key
            )
        ) {

            return translations[language][key];

        }
        /*
         * Si no existe traducción, intentamos devolver
         * el texto español original.
         */
        if (
            translations.es &&
            Object.prototype.hasOwnProperty.call(
                translations.es,
                key
            )
        ) {
            return translations.es[key];
        }
        return key;
    };
/* ============================================================
   OBSERVADOR PARA ELEMENTOS NUEVOS
   ============================================================ */

let translationObserverRunning = false;
let translationUpdateTimer = null;

const translationObserver = new MutationObserver(function (mutations) {

    if (translationObserverRunning) return;

    let hasNewTranslationElements = false;

    mutations.forEach(function (mutation) {

        if (mutation.type !== "childList") return;

        mutation.addedNodes.forEach(function (node) {

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return;
            }

            /*
             * Solo nos interesa detectar elementos que realmente
             * tengan atributos de traducción.
             */
            if (
                (node.matches && (
                    node.matches("[data-i18n]") ||
                    node.matches("[data-i18n-placeholder]") ||
                    node.matches("[data-i18n-title]") ||
                    node.matches("[data-i18n-alt]") ||
                    node.matches("[data-i18n-aria-label]")
                )) ||
                (node.querySelector && (
                    node.querySelector("[data-i18n]") ||
                    node.querySelector("[data-i18n-placeholder]") ||
                    node.querySelector("[data-i18n-title]") ||
                    node.querySelector("[data-i18n-alt]") ||
                    node.querySelector("[data-i18n-aria-label]")
                ))
            ) {
                hasNewTranslationElements = true;
            }

        });

    });

    if (!hasNewTranslationElements) return;

    /*
     * Evita ejecutar translatePage() múltiples veces
     * por cambios consecutivos.
     */
    clearTimeout(translationUpdateTimer);

    translationUpdateTimer = setTimeout(function () {

        if (translationObserverRunning) return;

        translationObserverRunning = true;

        try {

            /*
             * Desconectamos temporalmente el observador.
             *
             * Esto es MUY importante porque translatePage()
             * modifica el DOM.
             */
            translationObserver.disconnect();

            prepareOriginalTexts();

            translatePage(currentLanguage);

        } catch (error) {

            console.error(
                "Error actualizando traducciones:",
                error
            );

        } finally {

            translationObserverRunning = false;

            /*
             * Volvemos a observar el DOM después
             * de terminar la traducción.
             */
            startTranslationObserver();

        }

    }, 100);

});


/* ============================================================
   INICIAR OBSERVADOR
   ============================================================ */

function startTranslationObserver() {

    if (!document.body) return;

    /*
     * Evitamos registrar el mismo observer varias veces.
     */
    translationObserver.disconnect();

    translationObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );
}
    /* ============================================================
       INICIALIZACIÓN
       ============================================================ */
    function initializeTranslation() {

        /*
         * MUY IMPORTANTE:
         *
         * Guardamos los textos españoles ANTES de cambiar
         * cualquier idioma.
         */
        prepareOriginalTexts();
        let savedLanguage = "es";
        try {

            savedLanguage =
                localStorage.getItem(
                    LANGUAGE_STORAGE_KEY
                ) || "es";

        } catch (error) {

            savedLanguage = "es";

        }
        if (
            !SUPPORTED_LANGUAGES.includes(
                savedLanguage
            )
        ) {

            savedLanguage = "es";
        }
        /*
         * Aplicar idioma guardado.
         */
        translatePage(savedLanguage);
        /*
         * Activar observador.
         */
        startTranslationObserver();
    }
    /* ============================================================
       ARRANQUE SEGURO
       ============================================================ */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeTranslation
        );
    } else {
        initializeTranslation();
    }
    /* ============================================================
       RECUPERACIÓN CUANDO SUPABASE / ADMIN CAMBIA CONTENIDO
       ============================================================ */
    document.addEventListener(
        "ardeContentUpdated",
        function () {
            /*
             * Si el contenido fue actualizado por el panel
             * administrativo, primero se toma ese contenido
             * como el nuevo español original.
             */
            if (currentLanguage === "es") {

                prepareOriginalTexts();
            }
            translatePage(currentLanguage);
        }
    );
    /* ============================================================
       EXPORTAR TRADUCCIONES
       ============================================================ */
})();/* ============================================================
   DIAGNÓSTICO REAL DE CLAVES DE TRADUCCIÓN
   ============================================================ */

function diagnosticarTraducciones() {

    const idiomas = [
        "es",
        "en",
        "ru",
        "zh",
        "ja",
        "pt",
        "fr",
        "it",
        "ar",
        "he"
    ];

    const elementos = [
        ...document.querySelectorAll("[data-i18n]")
    ];

    const clavesHTML = [
        ...new Set(
            elementos
                .map(el => el.getAttribute("data-i18n"))
                .filter(Boolean)
        )
    ];

    console.group("🌎 DIAGNÓSTICO ARDE - TRADUCCIONES");

    console.log(
        "Claves encontradas en HTML:",
        clavesHTML.length
    );

    idiomas.forEach(function (idioma) {

        const diccionario =
            window.ARDETranslations &&
            window.ARDETranslations[idioma];

        if (!diccionario) {

            console.error(
                "❌ NO EXISTE DICCIONARIO:",
                idioma
            );

            return;
        }

        const faltantes = clavesHTML.filter(function (key) {

            return !Object.prototype.hasOwnProperty.call(
                diccionario,
                key
            );

        });

        if (faltantes.length === 0) {

            console.log(
                "✅ " + idioma.toUpperCase() +
                " → TODAS LAS CLAVES EXISTEN"
            );

        } else {

            console.error(
                "❌ " + idioma.toUpperCase() +
                " → FALTAN " +
                faltantes.length +
                " CLAVES"
            );

            console.table(faltantes);
        }

    });

    console.groupEnd();
}

window.diagnosticarTraducciones = diagnosticarTraducciones;