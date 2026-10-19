// ==========================================
// ARDE AVIVAMIENTO
// FORMULARIO DE CONTACTO
// Archivo independiente: contacto.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("ardeContactForm");

    if (!form) {
        console.warn(
            "ARDE Contacto: no se encontró #ardeContactForm"
        );
        return;
    }


    // ------------------------------------------
    // SUPABASE
    // ------------------------------------------

    if (!window.supabase) {
        console.error(
            "ARDE Contacto: Supabase JS no está cargado."
        );
        return;
    }

    const ardeContactSupabase =
        window.supabase.createClient(
            "https://wufbwtizjzpuccqopvre.supabase.co",
            "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nnf1EBZJeNbOtGVtM59_LQ_0y_ZR8fy"
        );


    // ------------------------------------------
    // ELEMENTOS
    // ------------------------------------------

    const submitButton =
        document.getElementById("ardeContactSubmit");

    const status =
        document.getElementById("contactFormStatus");

    const nombreInput =
        document.getElementById("nombre");

    const apellidoInput =
        document.getElementById("apellido");

    const telefonoInput =
        document.getElementById("telefono");

    const emailInput =
        document.getElementById("email");

    const mensajeInput =
        document.getElementById("mensaje");

    // Campo invisible anti-spam
    const websiteInput =
        document.getElementById("website");


    // ------------------------------------------
    // ENVÍO DEL FORMULARIO
    // ------------------------------------------

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        // --------------------------------------
        // OBTENER DATOS
        // --------------------------------------

        const nombre =
            nombreInput?.value.trim() || "";

        const apellido =
            apellidoInput?.value.trim() || "";

        const telefono =
            telefonoInput?.value.trim() || "";

        const email =
            emailInput?.value.trim().toLowerCase() || "";

        const mensaje =
            mensajeInput?.value.trim() || "";


        // --------------------------------------
        // LIMPIAR MENSAJE ANTERIOR
        // --------------------------------------

        mostrarEstado("", "");


        // --------------------------------------
        // ANTI-SPAM
        // --------------------------------------

        if (
            websiteInput &&
            websiteInput.value.trim() !== ""
        ) {

            console.warn(
                "ARDE Contacto: envío bloqueado por honeypot."
            );

            mostrarEstado(
                "No fue posible procesar el formulario.",
                "error"
            );

            return;
        }


        // --------------------------------------
        // VALIDACIÓN NOMBRE
        // --------------------------------------

        if (
            nombre.length < 2 ||
            nombre.length > 80
        ) {

            mostrarEstado(
                "Por favor, introduce un nombre válido.",
                "error"
            );

            nombreInput?.focus();

            return;
        }


        // --------------------------------------
        // VALIDACIÓN APELLIDO
        // --------------------------------------

        if (
            apellido.length < 2 ||
            apellido.length > 80
        ) {

            mostrarEstado(
                "Por favor, introduce un apellido válido.",
                "error"
            );

            apellidoInput?.focus();

            return;
        }


        // --------------------------------------
        // VALIDACIÓN TELÉFONO
        // --------------------------------------

        if (
            telefono.length < 7 ||
            telefono.length > 30
        ) {

            mostrarEstado(
                "Por favor, introduce un teléfono válido.",
                "error"
            );

            telefonoInput?.focus();

            return;
        }


        // --------------------------------------
        // VALIDACIÓN EMAIL
        // --------------------------------------

        const emailRegex =
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!emailRegex.test(email)) {

            mostrarEstado(
                "Por favor, introduce un correo electrónico válido.",
                "error"
            );

            emailInput?.focus();

            return;
        }


        // --------------------------------------
        // VALIDACIÓN MENSAJE
        // --------------------------------------

        if (mensaje.length > 1000) {

            mostrarEstado(
                "El mensaje es demasiado largo.",
                "error"
            );

            mensajeInput?.focus();

            return;
        }


        // --------------------------------------
        // BLOQUEAR BOTÓN
        // --------------------------------------

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML = `
                <span>Enviando...</span>
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;
        }


        // --------------------------------------
        // ENVIAR A EDGE FUNCTION
        // --------------------------------------

        try {

            console.log(
                "ARDE Contacto: enviando solicitud a Edge Function..."
            );


            const {
                data,
                error
            } =
                await ardeContactSupabase.functions.invoke(
                    "contacto-verificacion",
                    {
                        body: {
                            accion: "crear_contacto",

                            nombre: nombre,

                            apellido: apellido,

                            telefono: telefono,

                            email: email,

                            mensaje: mensaje
                        }
                    }
                );


            // ----------------------------------
            // ERROR EDGE FUNCTION
            // ----------------------------------

            if (error) {

                console.error(
                    "ARDE Contacto - Error Edge Function:",
                    error
                );

                let mensajeError =
                    "No pudimos procesar tu formulario. Inténtalo nuevamente.";


                // ----------------------------------
                // INTENTAR LEER RESPUESTA DEL SERVIDOR
                // ----------------------------------

                try {

                    if (error.context) {

                        const response =
                            error.context;

                        const errorData =
                            await response.json();

                        console.log(
                            "ARDE Contacto - Respuesta del servidor:",
                            errorData
                        );


                        if (
                            errorData &&
                            errorData.message
                        ) {

                            mensajeError =
                                errorData.message;
                        }
                    }

                } catch (parseError) {

                    console.warn(
                        "ARDE Contacto: no se pudo leer el mensaje específico del servidor.",
                        parseError
                    );
                }


                // ----------------------------------
                // MOSTRAR ERROR ESPECÍFICO
                // ----------------------------------

                mostrarEstado(
                    mensajeError,
                    "error"
                );

                return;
            }


            // ----------------------------------
            // ERROR DEVUELTO POR LA FUNCIÓN
            // ----------------------------------

            if (
                !data ||
                data.ok !== true
            ) {

                console.error(
                    "ARDE Contacto - Respuesta inválida:",
                    data
                );


                const mensajeError =
                    data?.message ||
                    data?.error ||
                    "No pudimos procesar tu solicitud.";


                mostrarEstado(
                    mensajeError,
                    "error"
                );

                return;
            }


            // ----------------------------------
            // ÉXITO
            // ----------------------------------

            console.log(
                "ARDE Contacto: contacto creado correctamente."
            );


            mostrarEstado(
                "¡Listo! Tu mensaje nos ha llegado. Dios te bendiga.",
                "success"
            );


            // ----------------------------------
            // LIMPIAR FORMULARIO
            // ----------------------------------

            form.reset();


        } catch (error) {

            console.error(
                "ARDE Contacto - Error inesperado:",
                error
            );


            mostrarEstado(
                "Ocurrió un problema inesperado. Inténtalo nuevamente.",
                "error"
            );


        } finally {

            // ----------------------------------
            // RESTAURAR BOTÓN
            // ----------------------------------

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    <span>Enviar mensaje</span>
                    <i class="fa-solid fa-paper-plane"></i>
                `;
            }
        }
    });


    // ------------------------------------------
    // MOSTRAR ESTADO
    // ------------------------------------------

    function mostrarEstado(mensaje, tipo) {

        if (!status) {
            return;
        }


        status.textContent = mensaje;


        status.className =
            "arde-contact-message";


        if (tipo) {
            status.classList.add(tipo);
        }
    }

});