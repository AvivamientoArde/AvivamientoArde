(function () {
    "use strict";

    const SUPABASE_URL =
        "https://gyjeyoostzxvkbgdyyuk.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_XIQX2Uyi-SSY4jXipnIBAg_AcV-GQp5";

    const RPC_URL =
        SUPABASE_URL + "/rest/v1/rpc/register_site_visit";

    async function iniciarContador() {

        const contador =
            document.getElementById("visitorCount");

        if (!contador) {
            console.error("❌ No existe #visitorCount");
            return;
        }

        console.log("⏳ Registrando visita...");

        try {

            const respuesta = await fetch(RPC_URL, {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                body: "{}"
            });

            const texto = await respuesta.text();

            console.log(
                "📡 Supabase:",
                respuesta.status,
                texto
            );

            if (!respuesta.ok) {
                console.error(
                    "❌ Error del contador:",
                    texto
                );
                return;
            }

            const total = Number(
                JSON.parse(texto)
            );

            if (Number.isNaN(total)) {
                console.error(
                    "❌ Supabase no devolvió un número:",
                    texto
                );
                return;
            }

            contador.textContent =
                total.toLocaleString("es-ES");

            console.log(
                "✅ VISITAS TOTALES:",
                total
            );

        } catch (error) {

            console.error(
                "❌ Error del contador:",
                error
            );
        }
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarContador,
            { once: true }
        );

    } else {

        iniciarContador();

    }

})();