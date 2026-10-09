/* ============================================================
   ARDE - TRADUCCIÓN AUTOMÁTICA DEL SITIO
   ============================================================
   
   Idiomas permitidos:
   ES | EN | RU | ZH | JA | PT | FR | IT | AR | HE

   FUNCIONAMIENTO:
   - Español = contenido original, SIN traducción.
   - Los demás idiomas = Google Translate automático.
   - El selector #globalLangSelect controla el idioma.
   - El idioma elegido se guarda.
   - Contenido nuevo de Supabase también se traduce.
   - No necesita biblioteca manual de traducciones.
   - No modifica textos directamente en Supabase.
   ============================================================ */

(function () {

    "use strict";

    /* ============================================================
       CONFIGURACIÓN
       ============================================================ */

    const ARDE_TRANSLATION = {

        defaultLanguage: "es",

        storageKey: "arde_language",

        googleElementId: "google_translate_element",

        googleScriptId: "arde_google_translate_script",

        supportedLanguages: [
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
        ]

    };


    /* ============================================================
       IDIOMAS ARDE → GOOGLE TRANSLATE
       ============================================================ */

    const GOOGLE_LANGUAGES = {

        es: "es",

        en: "en",

        ru: "ru",

        zh: "zh-CN",

        ja: "ja",

        pt: "pt",

        fr: "fr",

        it: "it",

        ar: "ar",

        he: "iw"

    };


    /* ============================================================
       OBTENER IDIOMA ACTUAL
       ============================================================ */

    function getCurrentLanguage() {

        try {

            const saved =
                localStorage.getItem(
                    ARDE_TRANSLATION.storageKey
                );

            if (
                saved &&
                ARDE_TRANSLATION.supportedLanguages.includes(
                    saved
                )
            ) {

                return saved;

            }

        } catch (error) {

            console.warn(
                "ARDE: No se pudo obtener el idioma guardado.",
                error
            );

        }

        return "es";

    }


    /* ============================================================
       GUARDAR IDIOMA
       ============================================================ */

    function saveLanguage(language) {

        try {

            localStorage.setItem(
                ARDE_TRANSLATION.storageKey,
                language
            );

        } catch (error) {

            console.warn(
                "ARDE: No se pudo guardar el idioma.",
                error
            );

        }

    }


    /* ============================================================
       COOKIE DE GOOGLE TRANSLATE
       ============================================================ */

    function setGoogleTranslateCookie(language) {

        const googleLanguage =
            GOOGLE_LANGUAGES[language];

        if (
            !googleLanguage ||
            language === "es"
        ) {

            return;

        }

        const value =
            "/es/" + googleLanguage;

        document.cookie =
            "googtrans=" +
            value +
            "; path=/";

        document.cookie =
            "googtrans=" +
            value +
            "; path=/; domain=" +
            window.location.hostname;

    }


    /* ============================================================
       BORRAR TRADUCCIÓN DE GOOGLE
       ============================================================ */

    function clearGoogleTranslateCookie() {

        const expires =
            "Thu, 01 Jan 1970 00:00:00 GMT";

        document.cookie =
            "googtrans=; expires=" +
            expires +
            "; path=/";

        document.cookie =
            "googtrans=; expires=" +
            expires +
            "; path=/; domain=" +
            window.location.hostname;

    }


    /* ============================================================
       CONTENEDOR OCULTO DE GOOGLE
       ============================================================ */

    function createGoogleContainer() {

        let container =
            document.getElementById(
                ARDE_TRANSLATION.googleElementId
            );

        if (container) {

            return container;

        }

        container =
            document.createElement("div");

        container.id =
            ARDE_TRANSLATION.googleElementId;

        container.className =
            "notranslate";

        container.setAttribute(
            "translate",
            "no"
        );

        /*
         * Lo ocultamos.
         * El usuario utilizará TU selector.
         */

        container.style.position =
            "fixed";

        container.style.left =
            "-10000px";

        container.style.top =
            "-10000px";

        container.style.width =
            "1px";

        container.style.height =
            "1px";

        container.style.overflow =
            "hidden";

        container.style.opacity =
            "0";

        container.style.pointerEvents =
            "none";

        document.body.appendChild(
            container
        );

        return container;

    }


    /* ============================================================
       GOOGLE TRANSLATE CALLBACK
       ============================================================ */

    window.ardeGoogleTranslateInit =
        function () {

            try {

                new google.translate.TranslateElement(

                    {

                        pageLanguage: "es",

                        /*
                         * SOLO estos idiomas.
                         */

                        includedLanguages:
                            "en,ru,zh-CN,ja,pt,fr,it,ar,iw",

                        autoDisplay: false,

                        multilanguagePage: true

                    },

                    ARDE_TRANSLATION.googleElementId

                );

                window.ardeGoogleTranslateReady =
                    true;

                console.log(
                    "ARDE: Traductor automático listo."
                );

                updateLanguageSelector();

                /*
                 * Esperamos a que Google cree
                 * .goog-te-combo
                 */

                waitForGoogleSelect();

            } catch (error) {

                console.error(
                    "ARDE: Error cargando Google Translate:",
                    error
                );

            }

        };


    /* ============================================================
       CARGAR GOOGLE TRANSLATE
       ============================================================ */

    function loadGoogleTranslate() {

        if (
            document.getElementById(
                ARDE_TRANSLATION.googleScriptId
            )
        ) {

            return;

        }

        createGoogleContainer();

        const script =
            document.createElement("script");

        script.id =
            ARDE_TRANSLATION.googleScriptId;

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=ardeGoogleTranslateInit";

        script.async = true;

        script.defer = true;

        document.head.appendChild(
            script
        );

    }


    /* ============================================================
       SELECTOR DEL SITIO
       ============================================================ */

    function updateLanguageSelector() {

        const selector =
            document.getElementById(
                "globalLangSelect"
            );

        if (!selector) {

            return;

        }

        const language =
            getCurrentLanguage();

        selector.value =
            language;

        /*
         * El selector NO debe ser traducido.
         */

        selector.setAttribute(
            "translate",
            "no"
        );

        selector.classList.add(
            "notranslate"
        );

        selector
            .querySelectorAll("option")
            .forEach(function (option) {

                option.setAttribute(
                    "translate",
                    "no"
                );

                option.classList.add(
                    "notranslate"
                );

            });

    }


    /* ============================================================
       CAMBIO DE IDIOMA
       ============================================================ */

    window.changeLanguage =
        function (language) {

            /*
             * Seguridad:
             * solo aceptamos los idiomas del selector.
             */

            if (
                !ARDE_TRANSLATION.supportedLanguages.includes(
                    language
                )
            ) {

                console.warn(
                    "ARDE: Idioma no permitido:",
                    language
                );

                return;

            }

            console.log(
                "ARDE: Usuario seleccionó:",
                language
            );

            saveLanguage(language);

            /*
             * ESPAÑOL
             * 
             * Volvemos al HTML original.
             */

            if (
                language === "es"
            ) {

                clearGoogleTranslateCookie();

                document.documentElement.lang =
                    "es";

                /*
                 * Recargamos para garantizar que
                 * desaparezca cualquier traducción
                 * anterior del DOM.
                 */

                window.location.reload();

                return;

            }


            /*
             * OTRO IDIOMA
             */

            setGoogleTranslateCookie(
                language
            );

            document.documentElement.lang =
                language;

            /*
             * Si Google ya está disponible,
             * cambiamos directamente.
             */

            const googleSelect =
                document.querySelector(
                    ".goog-te-combo"
                );

            if (googleSelect) {

                const target =
                    GOOGLE_LANGUAGES[
                        language
                    ];

                googleSelect.value =
                    target;

                googleSelect.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

                setTimeout(
                    function () {

                        ardeTranslateDynamicContent();

                    },
                    1000
                );

                return;

            }

            /*
             * Google todavía no está listo.
             * Recargamos y la cookie hará que
             * Google traduzca automáticamente.
             */

            window.location.reload();

        };


    /* ============================================================
       ESPERAR A GOOGLE
       ============================================================ */

    function waitForGoogleSelect() {

        let attempts = 0;

        const maxAttempts = 50;

        const interval =
            setInterval(
                function () {

                    attempts++;

                    const select =
                        document.querySelector(
                            ".goog-te-combo"
                        );

                    if (select) {

                        clearInterval(
                            interval
                        );

                        console.log(
                            "ARDE: Selector interno de Google encontrado."
                        );

                        applyCurrentLanguage();

                        return;

                    }

                    if (
                        attempts >= maxAttempts
                    ) {

                        clearInterval(
                            interval
                        );

                        console.warn(
                            "ARDE: Google Translate tardó demasiado en cargar."
                        );

                    }

                },
                200
            );

    }


    /* ============================================================
       APLICAR IDIOMA ACTUAL
       ============================================================ */

    function applyCurrentLanguage() {

        const language =
            getCurrentLanguage();

        if (
            language === "es"
        ) {

            return;

        }

        const googleSelect =
            document.querySelector(
                ".goog-te-combo"
            );

        if (!googleSelect) {

            return;

        }

        const target =
            GOOGLE_LANGUAGES[
                language
            ];

        if (
            googleSelect.value !==
            target
        ) {

            googleSelect.value =
                target;

            googleSelect.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

        }

        document.documentElement.lang =
            language;

    }


    /* ============================================================
       CONTENIDO DINÁMICO
       ============================================================

       Esta parte es especialmente importante para ARDE.

       Tu admin puede cargar después:

       - eventos
       - recursos
       - videos
       - cruzadas
       - libros
       - donaciones
       - textos
       - modales
       - contenido de Supabase

       Cuando aparezca contenido nuevo,
       intentaremos volver a aplicar el idioma.
       ============================================================ */

    let dynamicTranslationTimer =
        null;

    function scheduleDynamicTranslation() {

        const language =
            getCurrentLanguage();

        /*
         * Español no necesita traducción.
         */

        if (
            language === "es"
        ) {

            return;

        }

        clearTimeout(
            dynamicTranslationTimer
        );

        dynamicTranslationTimer =
            setTimeout(
                function () {

                    ardeTranslateDynamicContent();

                },
                1200
            );

    }


    /* ============================================================
       TRADUCIR CONTENIDO DINÁMICO
       ============================================================ */

    function ardeTranslateDynamicContent() {

        const language =
            getCurrentLanguage();

        if (
            language === "es"
        ) {

            return;

        }

        const googleSelect =
            document.querySelector(
                ".goog-te-combo"
            );

        if (!googleSelect) {

            return;

        }

        const target =
            GOOGLE_LANGUAGES[
                language
            ];

        /*
         * Volvemos a seleccionar el mismo idioma.
         *
         * Google Translate detectará los textos
         * que hayan aparecido en el DOM.
         */

        googleSelect.value =
            target;

        googleSelect.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

    }


    /* ============================================================
       OBSERVADOR DE SUPABASE / DOM
       ============================================================ */

    function startMutationObserver() {

        if (
            window.ardeMutationObserverStarted
        ) {

            return;

        }

        window.ardeMutationObserverStarted =
            true;

        let ignoredMutation = false;

        const observer =
            new MutationObserver(
                function (mutations) {

                    const language =
                        getCurrentLanguage();

                    if (
                        language === "es"
                    ) {

                        return;

                    }

                    /*
                     * Ignorar modificaciones provocadas
                     * por el propio Google Translate.
                     */

                    let relevant =
                        false;

                    mutations.forEach(
                        function (mutation) {

                            if (
                                mutation.type ===
                                "childList"
                            ) {

                                for (
                                    const node
                                    of mutation.addedNodes
                                ) {

                                    if (
                                        node.nodeType !==
                                        Node.ELEMENT_NODE
                                    ) {

                                        continue;

                                    }

                                    /*
                                     * No procesar elementos
                                     * internos de Google.
                                     */

                                    if (
                                        node.classList &&
                                        (
                                            node.classList.contains(
                                                "skiptranslate"
                                            ) ||
                                            node.classList.contains(
                                                "goog-te-banner-frame"
                                            )
                                        )
                                    ) {

                                        continue;

                                    }

                                    if (
                                        node.closest &&
                                        node.closest(
                                            ".goog-te-menu-frame"
                                        )
                                    ) {

                                        continue;

                                    }

                                    relevant =
                                        true;

                                    break;

                                }

                            }

                            if (
                                mutation.type ===
                                "characterData"
                            ) {

                                relevant =
                                    true;

                            }

                        }
                    );

                    if (
                        relevant &&
                        !ignoredMutation
                    ) {

                        scheduleDynamicTranslation();

                    }

                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );

        window.ardeMutationObserver =
            observer;

    }


    /* ============================================================
       PROTEGER ELEMENTOS QUE NO DEBEN CAMBIAR
       ============================================================ */

    function protectSiteControls() {

        /*
         * Selector de idiomas.
         */

        const selector =
            document.getElementById(
                "globalLangSelect"
            );

        if (selector) {

            selector.setAttribute(
                "translate",
                "no"
            );

            selector.classList.add(
                "notranslate"
            );

            selector
                .querySelectorAll(
                    "option"
                )
                .forEach(
                    function (option) {

                        option.setAttribute(
                            "translate",
                            "no"
                        );

                        option.classList.add(
                            "notranslate"
                        );

                    }
                );

        }


        /*
         * Emails.
         */

        document
            .querySelectorAll(
                'a[href^="mailto:"], [data-email]'
            )
            .forEach(
                function (element) {

                    element.setAttribute(
                        "translate",
                        "no"
                    );

                    element.classList.add(
                        "notranslate"
                    );

                }
            );


        /*
         * Teléfonos.
         */

        document
            .querySelectorAll(
                'a[href^="tel:"], [data-phone]'
            )
            .forEach(
                function (element) {

                    element.setAttribute(
                        "translate",
                        "no"
                    );

                    element.classList.add(
                        "notranslate"
                    );

                }
            );


        /*
         * URLs externas.
         */

        document
            .querySelectorAll(
                "a[href]"
            )
            .forEach(
                function (element) {

                    const href =
                        element.getAttribute(
                            "href"
                        );

                    if (
                        href &&
                        (
                            href.startsWith(
                                "http://"
                            ) ||
                            href.startsWith(
                                "https://"
                            ) ||
                            href.startsWith(
                                "mailto:"
                            ) ||
                            href.startsWith(
                                "tel:"
                            )
                        )
                    ) {

                        /*
                         * No modificamos href.
                         */

                    }

                }
            );

    }


    /* ============================================================
       OCULTAR ELEMENTOS DE GOOGLE
       ============================================================ */

    function hideGoogleInterface() {

        if (
            document.getElementById(
                "arde-google-style"
            )
        ) {

            return;

        }

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "arde-google-style";

        style.textContent = `

            .goog-te-banner-frame {
                display: none !important;
            }

            iframe.goog-te-banner-frame {
                display: none !important;
            }

            .goog-te-balloon-frame {
                display: none !important;
            }

            .goog-tooltip {
                display: none !important;
            }

            .goog-tooltip:hover {
                display: none !important;
            }

            .goog-text-highlight {
                background: transparent !important;
                box-shadow: none !important;
            }

            body {
                top: 0 !important;
            }

            body > .skiptranslate {
                display: none !important;
            }

            #google_translate_element {
                position: fixed !important;
                left: -10000px !important;
                top: -10000px !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }

        `;

        document.head.appendChild(
            style
        );

    }


    /* ============================================================
       INICIALIZACIÓN
       ============================================================ */

    function initialize() {

        /*
         * Proteger controles.
         */

        protectSiteControls();

        /*
         * Ocultar interfaz de Google.
         */

        hideGoogleInterface();

        /*
         * Actualizar selector.
         */

        updateLanguageSelector();

        /*
         * Cargar traductor.
         */

        createGoogleContainer();

        loadGoogleTranslate();

        /*
         * Observar contenido nuevo.
         */

        startMutationObserver();

        /*
         * Aplicar el idioma cuando el traductor haya tenido tiempo de iniciar.
         */

        setTimeout(
            function () {

                applyCurrentLanguage();
            },
            1800
        );

        /*
         * Segundo intento.
         */

        setTimeout(
            function () {

                applyCurrentLanguage();

            },
            3500
        );

    }


    /* ============================================================
       ARRANCAR
       ============================================================ */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


    /* ============================================================
       API PÚBLICA
       ============================================================ */

    window.ARDETranslation = {

        getLanguage:
            getCurrentLanguage,

        setLanguage:
            window.changeLanguage,

        retranslate:
            ardeTranslateDynamicContent

    };


})();