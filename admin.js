
/* ============================================================
   ARDE - TRADUCTOR DEL PANEL ADMINISTRATIVO
   ============================================================
   
   CORRECCIONES:
   - Traduce contenteditable visualmente
   - Traduce "Quiénes Somos"
   - Traduce todos los textos del Admin
   - Español vuelve INMEDIATAMENTE al original
   - No es necesario pasar por Inglés
   - Los cambios rápidos de idioma no se pierden
   - NO modifica valores de inputs
   - NO modifica Supabase
   - NO modifica saveAllChanges()
   - NO modifica logoutAdmin()
   - NO modifica URLs
   - NO modifica nombres de archivos
   ============================================================ */

(function () {

    "use strict";

    const ARDE_ADMIN_LANGUAGES = [
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

    let requestedLanguage = "es";

    let translationCache = {};

    let originalTexts = new WeakMap();

    let originalAttributes = new WeakMap();

    let translationRunning = false;

    let translationRequestId = 0;

    const EXCLUDED_TAGS = [
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "CODE",
        "PRE",
        "INPUT",
        "TEXTAREA",
        "SELECT",
        "OPTION"
    ];

    /* ============================================================
       EXCLUSIONES
       ============================================================ */

    function isExcludedElement(element) {

        if (!element) {
            return true;
        }

        return EXCLUDED_TAGS.includes(
            element.tagName
        );
    }

    /* ============================================================
       VALIDAR TEXTO
       ============================================================ */

    function isValidTextNode(node) {

        if (
            !node ||
            !node.nodeValue
        ) {
            return false;
        }

        const text =
            node.nodeValue.trim();

        if (
            !text ||
            text.length < 2
        ) {
            return false;
        }

        const parent =
            node.parentElement;

        if (!parent) {
            return false;
        }

        if (
            isExcludedElement(parent)
        ) {
            return false;
        }

        /*
         * IMPORTANTE:
         * NO excluimos contenteditable.
         * Así se traducen:
         *
         * - Quiénes Somos
         * - Nuestra Historia
         * - Biografía
         * - Ministerios
         * - Eventos
         * etc.
         */

        if (
            /^https?:\/\//i.test(text)
        ) {
            return false;
        }

        /*
         * Evitar traducir rutas,
         * IDs y cadenas técnicas.
         */

        if (
            /^[A-Za-z0-9_\-./:@]+$/.test(text) &&
            text.length > 15
        ) {
            return false;
        }

        return true;
    }

    /* ============================================================
       GUARDAR ORIGINAL
       ============================================================ */

    function saveOriginalText(node) {

        if (
            !originalTexts.has(node)
        ) {
            originalTexts.set(
                node,
                node.nodeValue
            );
        }
    }

    function getOriginalText(node) {

        if (
            originalTexts.has(node)
        ) {
            return originalTexts.get(node);
        }

        saveOriginalText(node);

        return originalTexts.get(node);
    }

    /* ============================================================
       RECOPILAR TEXTOS
       ============================================================ */

    function collectInterfaceTextNodes() {

        const nodes = [];

        const walker =
            document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT
            );

        let node;

        while (
            (node = walker.nextNode())
        ) {

            if (
                isValidTextNode(node)
            ) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    /* ============================================================
       ATRIBUTOS
       ============================================================ */

    function collectAttributeElements() {

        const elements = [];

        document
            .querySelectorAll(
                "[title], [aria-label]"
            )
            .forEach(
                function (element) {

                    if (
                        isExcludedElement(
                            element
                        )
                    ) {
                        return;
                    }

                    elements.push(element);
                }
            );

        return elements;
    }

    /* ============================================================
       API GOOGLE TRANSLATE
       ============================================================ */

    async function translateSingleText(
        text,
        language
    ) {

        if (
            !text ||
            language === "es"
        ) {
            return text;
        }

        const cleanText =
            text.trim();

        const cacheKey =
            language +
            "::" +
            cleanText;

        /*
         * Usar hasOwnProperty evita problemas
         * con traducciones vacías.
         */

        if (
            Object.prototype.hasOwnProperty.call(
                translationCache,
                cacheKey
            )
        ) {

            return translationCache[
                cacheKey
            ];
        }

        try {

            const url =
                "https://translate.googleapis.com/translate_a/single" +
                "?client=gtx" +
                "&sl=es" +
                "&tl=" +
                encodeURIComponent(language) +
                "&dt=t" +
                "&q=" +
                encodeURIComponent(cleanText);

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );
            }

            const data =
                await response.json();

            let translated =
                cleanText;

            if (
                data &&
                data[0] &&
                Array.isArray(data[0])
            ) {

                translated =
                    data[0]
                        .map(
                            function (item) {

                                return (
                                    item[0] ||
                                    ""
                                );
                            }
                        )
                        .join("");
            }

            translationCache[
                cacheKey
            ] = translated;

            return translated;

        } catch (error) {

            console.warn(
                "ARDE Admin Translator:",
                "Error traduciendo:",
                cleanText,
                error
            );

            return cleanText;
        }
    }

    /* ============================================================
       TRADUCIR NODOS
       ============================================================ */

    async function translateNodes(
        nodes,
        language,
        requestId
    ) {

        /*
         * ESPAÑOL:
         *
         * NO esperamos ninguna API.
         * Restauramos inmediatamente el español original.
         *
         * Esta es la solución principal del problema.
         */

        if (
            language === "es"
        ) {

            nodes.forEach(
                function (node) {

                    if (
                        originalTexts.has(node)
                    ) {

                        node.nodeValue =
                            originalTexts.get(
                                node
                            );
                    }
                }
            );

            return;
        }

        /*
         * Guardamos todos los originales
         * antes de comenzar la traducción.
         */

        nodes.forEach(
            function (node) {

                saveOriginalText(node);
            }
        );

        const uniqueTexts = [
            ...new Set(
                nodes.map(
                    function (node) {

                        return getOriginalText(
                            node
                        ).trim();
                    }
                )
            )
        ];

        /*
         * Traducciones paralelas.
         */

        const translatedResults =
            await Promise.all(
                uniqueTexts.map(
                    function (text) {

                        return translateSingleText(
                            text,
                            language
                        );
                    }
                )
            );

        /*
         * Si mientras esperábamos Google
         * el usuario escogió otro idioma,
         * ABANDONAMOS esta traducción.
         */

        if (
            requestId !==
            translationRequestId
        ) {
            return;
        }

        const dictionary = {};

        uniqueTexts.forEach(
            function (
                text,
                index
            ) {

                dictionary[text] =
                    translatedResults[
                        index
                    ];
            }
        );

        nodes.forEach(
            function (node) {

                /*
                 * Comprobar nuevamente que
                 * sigue siendo la petición actual.
                 */

                if (
                    requestId !==
                    translationRequestId
                ) {
                    return;
                }

                const original =
                    getOriginalText(node);

                const clean =
                    original.trim();

                if (
                    dictionary[clean]
                ) {

                    const leading =
                        original.match(
                            /^\s*/
                        )?.[0] || "";

                    const trailing =
                        original.match(
                            /\s*$/
                        )?.[0] || "";

                    node.nodeValue =
                        leading +
                        dictionary[clean] +
                        trailing;
                }
            }
        );
    }

    /* ============================================================
       TRADUCIR TITLE / ARIA
       ============================================================ */

    async function translateAttributes(
        elements,
        language,
        requestId
    ) {

        /*
         * Guardamos originales primero.
         */

        elements.forEach(
            function (element) {

                if (
                    !originalAttributes.has(
                        element
                    )
                ) {

                    originalAttributes.set(
                        element,
                        {
                            title:
                                element.getAttribute(
                                    "title"
                                ),

                            aria:
                                element.getAttribute(
                                    "aria-label"
                                )
                        }
                    );
                }
            }
        );

        /*
         * Español:
         * restaurar inmediatamente.
         */

        if (
            language === "es"
        ) {

            elements.forEach(
                function (element) {

                    const original =
                        originalAttributes.get(
                            element
                        );

                    if (!original) {
                        return;
                    }

                    if (
                        original.title !== null
                    ) {

                        element.setAttribute(
                            "title",
                            original.title
                        );
                    }

                    if (
                        original.aria !== null
                    ) {

                        element.setAttribute(
                            "aria-label",
                            original.aria
                        );
                    }
                }
            );

            return;
        }

        /*
         * Traducción paralela.
         */

        const jobs = [];

        elements.forEach(
            function (element) {

                const original =
                    originalAttributes.get(
                        element
                    );

                if (!original) {
                    return;
                }

                if (
                    original.title
                ) {

                    jobs.push(
                        translateSingleText(
                            original.title,
                            language
                        ).then(
                            function (translated) {

                                if (
                                    requestId ===
                                    translationRequestId
                                ) {

                                    element.setAttribute(
                                        "title",
                                        translated
                                    );
                                }
                            }
                        )
                    );
                }

                if (
                    original.aria
                ) {

                    jobs.push(
                        translateSingleText(
                            original.aria,
                            language
                        ).then(
                            function (translated) {

                                if (
                                    requestId ===
                                    translationRequestId
                                ) {

                                    element.setAttribute(
                                        "aria-label",
                                        translated
                                    );
                                }
                            }
                        )
                    );
                }
            }
        );

        await Promise.all(jobs);
    }

    /* ============================================================
       PLACEHOLDERS
       ============================================================ */

    async function translatePlaceholders(
        language,
        requestId
    ) {

        const inputs =
            document.querySelectorAll(
                "input[placeholder], textarea[placeholder]"
            );

        const elements = [];

        inputs.forEach(
            function (element) {

                if (
                    isExcludedElement(
                        element
                    )
                ) {
                    return;
                }

                elements.push(element);
            }
        );

        /*
         * Guardar originales.
         */

        elements.forEach(
            function (element) {

                if (
                    !originalAttributes.has(
                        element
                    )
                ) {

                    originalAttributes.set(
                        element,
                        {
                            placeholder:
                                element.getAttribute(
                                    "placeholder"
                                )
                        }
                    );
                }
            }
        );

        /*
         * Español:
         * restaurar inmediatamente.
         */

        if (
            language === "es"
        ) {

            elements.forEach(
                function (element) {

                    const data =
                        originalAttributes.get(
                            element
                        );

                    if (
                        data &&
                        data.placeholder
                    ) {

                        element.setAttribute(
                            "placeholder",
                            data.placeholder
                        );
                    }
                }
            );

            return;
        }

        /*
         * Otros idiomas.
         */

        await Promise.all(
            elements.map(
                async function (element) {

                    const data =
                        originalAttributes.get(
                            element
                        );

                    if (
                        !data ||
                        !data.placeholder
                    ) {
                        return;
                    }

                    const translated =
                        await translateSingleText(
                            data.placeholder,
                            language
                        );

                    if (
                        requestId ===
                        translationRequestId
                    ) {

                        element.setAttribute(
                            "placeholder",
                            translated
                        );
                    }
                }
            )
        );
    }

    /* ============================================================
       FUNCIÓN PRINCIPAL
       ============================================================ */

    async function translateAdmin(
        language
    ) {

        if (
            !ARDE_ADMIN_LANGUAGES.includes(
                language
            )
        ) {

            language = "es";
        }

        /*
         * Registrar inmediatamente la petición.
         *
         * Cada cambio de idioma obtiene un número diferente.
         */
        const requestId =
            ++translationRequestId;

        requestedLanguage =
            language;

        /*
         * IMPORTANTE:
         * El idioma cambia inmediatamente.
         */
        currentLanguage =
            language;

        document.documentElement.lang =
            language;

        /*
         * Si es Español:
         *
         * restauramos TODO inmediatamente,
         * sin esperar traducciones pendientes.
         */

        if (
            language === "es"
        ) {

            const textNodes =
                collectInterfaceTextNodes();

            textNodes.forEach(
                function (node) {

                    if (
                        originalTexts.has(node)
                    ) {

                        node.nodeValue =
                            originalTexts.get(
                                node
                            );
                    }
                }
            );

            const attributes =
                collectAttributeElements();

            attributes.forEach(
                function (element) {

                    const original =
                        originalAttributes.get(
                            element
                        );

                    if (!original) {
                        return;
                    }

                    if (
                        original.title !== null
                    ) {

                        element.setAttribute(
                            "title",
                            original.title
                        );
                    }

                    if (
                        original.aria !== null
                    ) {

                        element.setAttribute(
                            "aria-label",
                            original.aria
                        );
                    }
                }
            );

            const placeholders =
                document.querySelectorAll(
                    "input[placeholder], textarea[placeholder]"
                );

            placeholders.forEach(
                function (element) {

                    const original =
                        originalAttributes.get(
                            element
                        );

                    if (
                        original &&
                        original.placeholder
                    ) {

                        element.setAttribute(
                            "placeholder",
                            original.placeholder
                        );
                    }
                }
            );

            return;
        }

        /*
         * Evitamos dos procesos simultáneos
         * trabajando sobre el DOM.
         */

        if (
            translationRunning
        ) {

            /*
             * El proceso actual terminará,
             * pero este requestId ya quedó registrado.
             * Cuando termine se ejecutará nuevamente.
             */
            return;
        }

        translationRunning =
            true;

        try {

            const textNodes =
                collectInterfaceTextNodes();

            const attributeElements =
                collectAttributeElements();

            await translateNodes(
                textNodes,
                language,
                requestId
            );

            /*
             * Si cambió el idioma durante
             * la traducción, no seguimos.
             */

            if (
                requestId !==
                translationRequestId
            ) {
                return;
            }

            await translateAttributes(
                attributeElements,
                language,
                requestId
            );

            if (
                requestId !==
                translationRequestId
            ) {
                return;
            }

            await translatePlaceholders(
                language,
                requestId
            );

        } catch (error) {

            console.error(
                "ARDE Admin Translator:",
                error
            );

        } finally {

            translationRunning =
                false;

            /*
             * Si el usuario cambió el idioma
             * mientras se estaba traduciendo,
             * ejecutamos la última selección.
             */

            if (
                requestedLanguage !==
                language
            ) {

                const nextLanguage =
                    requestedLanguage;

                /*
                 * Ejecutamos el idioma que
                 * realmente pidió el usuario.
                 */

                setTimeout(
                    function () {

                        translateAdmin(
                            nextLanguage
                        );

                    },
                    0
                );
            }
        }
    }

    /* ============================================================
       SELECTOR DE IDIOMA
       ============================================================ */

    function setupLanguageSelector() {

        const selector =
            document.getElementById(
                "globalLangSelect"
            );

        if (!selector) {

            console.warn(
                "ARDE Admin: no se encontró #globalLangSelect"
            );

            return;
        }

        /*
         * IMPORTANTE:
         * No necesita onchange en HTML.
         */

        selector.addEventListener(
            "change",
            function () {

                const language =
                    selector.value ||
                    "es";

                translateAdmin(
                    language
                );
            }
        );

        currentLanguage =
            selector.value ||
            "es";

        requestedLanguage =
            currentLanguage;
    }

    /* ============================================================
       CONTENIDO DINÁMICO
       ============================================================ */

    function setupDynamicContentObserver() {

        let observerTimer =
            null;

        const observer =
            new MutationObserver(
                function (mutations) {

                    /*
                     * Solo nos interesa contenido
                     * realmente agregado al DOM.
                     */

                    let relevant =
                        false;

                    mutations.forEach(
                        function (mutation) {

                            if (
                                mutation.addedNodes &&
                                mutation.addedNodes.length
                            ) {

                                relevant =
                                    true;
                            }
                        }
                    );

                    if (
                        !relevant
                    ) {
                        return;
                    }

                    if (
                        currentLanguage ===
                        "es"
                    ) {
                        return;
                    }

                    clearTimeout(
                        observerTimer
                    );

                    observerTimer =
                        setTimeout(
                            function () {

                                /*
                                 * Si todavía sigue
                                 * seleccionado el mismo
                                 * idioma, traducimos
                                 * contenido nuevo.
                                 */

                                translateAdmin(
                                    currentLanguage
                                );

                            },
                            400
                        );
                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }

    /* ============================================================
       INICIALIZAR
       ============================================================ */

    async function loadSavedTexts() {

        const { data, error } = await supabaseClient
            .from("site_content")
            .select("content_key, content_value")
            .eq("section", "live_index");

        if (error) {
            throw new Error("No se pudieron cargar los textos guardados: " + error.message);
        }

        if (!Array.isArray(data)) {
            throw new Error("La respuesta de textos guardados no tiene un formato válido.");
        }

        data.forEach(function (row) {
            if (!row || !row.content_key) return;

            const element = document.getElementById(row.content_key);
            if (!element || !element.isContentEditable) return;

            element.innerHTML = row.content_value || "";
        });
    }

    window.loadSavedTexts = loadSavedTexts;

    window.getAdminOriginalEditableHtml = function (element) {
        if (!element) return "";

        const clone = element.cloneNode(true);
        const originalWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const cloneWalker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);

        while (originalWalker.nextNode() && cloneWalker.nextNode()) {
            if (originalTexts.has(originalWalker.currentNode)) {
                cloneWalker.currentNode.nodeValue = originalTexts.get(originalWalker.currentNode);
            }
        }

        return clone.innerHTML;
    };

    function initializeAdminTranslator() {

        setupLanguageSelector();

        setupDynamicContentObserver();

        console.log(
            "ARDE Admin Translator: activado correctamente."
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAdminTranslator
        );

    } else {

        initializeAdminTranslator();
    }

})();
