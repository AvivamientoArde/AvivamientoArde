from pathlib import Path
import re

html_path = Path("/mnt/data/ARDE_admin.html")
js_path = Path("/mnt/data/js_admin.js")

js = js_path.read_text(encoding="utf-8")

# Replace the previous plain-text admin credentials with SHA-256 hashes.
# These hashes are compared in the browser using Web Crypto API.
old = '''const ARDE_ADMIN_PASSWORD = "ARDE2026";'''
new = '''const ARDE_ADMIN_USER_HASH = "4f5d7e0d9a0f9d0c8b1f1a0b0b0e7a6b3c5c0f1a7b2c0c5d8d9e1f0a4c3b2d1";
const ARDE_ADMIN_PASSWORD_HASH = "7f4f0b7f2a0c8f7d7f3e4f8b1a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3";'''
# We will calculate the actual hashes below rather than use placeholders.
import hashlib
user_hash = hashlib.sha256("Daniel Riquezes".encode("utf-8")).hexdigest()
password_hash = hashlib.sha256("Yahwehjire300#".encode("utf-8")).hexdigest()
new = f'''const ARDE_ADMIN_USER_HASH = "{user_hash}";
const ARDE_ADMIN_PASSWORD_HASH = "{password_hash}";'''

if old in js:
    js = js.replace(old, new, 1)
else:
    # If the prior comment/code differs, replace the credentials section by regex.
    js = re.sub(
        r'const ARDE_ADMIN_PASSWORD\s*=\s*"[^"]*";',
        new,
        js,
        count=1
    )

# Update the explanatory comment.
js = js.replace(
'''   IMPORTANTE:
   Esta contraseña está en el código del navegador.
   Sirve como bloqueo básico para una web estática, NO como seguridad real.
   Cambia "ARDE2026" por la contraseña que quieras.
''',
'''   SEGURIDAD:
   El usuario y la contraseña no se almacenan como texto plano.
   Se comparan mediante SHA-256 usando Web Crypto API.
   IMPORTANTE: al ser una página estática, esto NO sustituye una
   autenticación real con servidor/base de datos.
'''
)

# Replace loginResourceAdmin with async hash-based verification.
pattern = re.compile(
    r'function loginResourceAdmin\(\) \{.*?\n\}\n\nfunction logoutResourceAdmin',
    re.S
)

replacement = r'''async function ardeSha256(value) {
    const data = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function loginResourceAdmin() {
    const userInput = document.getElementById("resourceAdminUser");
    const input = document.getElementById("resourceAdminPassword");
    const msg = document.getElementById("resourceAdminLoginMsg");

    if (!userInput || !input) return;

    const enteredUserHash = await ardeSha256(userInput.value.trim());
    const enteredPasswordHash = await ardeSha256(input.value);

    if (
        enteredUserHash === ARDE_ADMIN_USER_HASH &&
        enteredPasswordHash === ARDE_ADMIN_PASSWORD_HASH
    ) {
        sessionStorage.setItem(ARDE_ADMIN_SESSION_KEY, "1");

        const login = document.getElementById("adminLoginBox");
        const panel = document.getElementById("resourceAdminPanel");

        if (login) login.style.display = "none";
        if (panel) panel.style.display = "block";

        if (msg) msg.textContent = "";
        renderResourceAdminList();
    } else {
        if (msg) msg.textContent = "Usuario o contraseña incorrectos.";
        input.value = "";
        input.focus();
    }
}

function logoutResourceAdmin'''
if pattern.search(js):
    js = pattern.sub(replacement, js, count=1)

# Update openAdminPanel to clear username/password.
js = js.replace(
'''        const pass = document.getElementById("resourceAdminPassword");
        if (pass) {
            pass.value = "";
            setTimeout(() => pass.focus(), 100);
        }''',
'''        const user = document.getElementById("resourceAdminUser");
        const pass = document.getElementById("resourceAdminPassword");
        if (user) user.value = "";
        if (pass) {
            pass.value = "";
            setTimeout(() => user ? user.focus() : pass.focus(), 100);
        }'''
)

js_path.write_text(js, encoding="utf-8")

# Update the login form in the HTML to include username.
html = html_path.read_text(encoding="utf-8")

old_input = '''<input id="resourceAdminPassword" type="password" placeholder="Contraseña"
                    onkeydown="if(event.key==='Enter') loginResourceAdmin()"
                    style="width:100%;padding:12px;background:#111;border:1px solid var(--border-gold);color:#fff;border-radius:6px;margin-bottom:12px;">'''

new_input = '''<input id="resourceAdminUser" type="text" autocomplete="username" placeholder="Usuario"
                    onkeydown="if(event.key==='Enter') loginResourceAdmin()"
                    style="width:100%;padding:12px;background:#111;border:1px solid var(--border-gold);color:#fff;border-radius:6px;margin-bottom:10px;">

                <input id="resourceAdminPassword" type="password" autocomplete="current-password" placeholder="Contraseña"
                    onkeydown="if(event.key==='Enter') loginResourceAdmin()"
                    style="width:100%;padding:12px;background:#111;border:1px solid var(--border-gold);color:#fff;border-radius:6px;margin-bottom:12px;">'''

if old_input in html:
    html = html.replace(old_input, new_input, 1)

# Update the visible explanatory note in HTML.
html = html.replace(
'''Los cambios quedan guardados en este navegador. Para que los cambios sean iguales para todos los visitantes necesitas una base de datos/backend.''',
'''Los cambios quedan guardados en este navegador. La contraseña no se guarda como texto plano; se verifica mediante SHA-256. Para que los cambios sean iguales para todos los visitantes necesitas una base de datos/backend.''',
1
)

html_path.write_text(html, encoding="utf-8")

print("Credenciales del administrador actualizadas y protegidas mediante SHA-256/Web Crypto.")
print("Usuario configurado: Daniel Riquezes")
print("Contraseña configurada sin almacenarla en texto plano.")
print(f"HTML actualizado: {html_path}")
print(f"JS actualizado: {js_path}")
