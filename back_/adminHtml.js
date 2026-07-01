// adminHtml.js
export const adminHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Administración</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #ffffff; color: #223b82; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .container { width: 100%; max-width: 400px; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(34, 59, 130, 0.15); border: 1px solid rgba(34, 59, 130, 0.1); }
        h2 { font-size: 24px; margin-bottom: 24px; font-weight: 500; text-align: center; color: #223b82; }
        .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 15px 0 8px 0; color: #223b82; border-bottom: 1px solid rgba(34, 59, 130, 0.2); padding-bottom: 4px; }
        .form-group { margin-bottom: 14px; }
        label { display: block; font-size: 13px; margin-bottom: 4px; font-weight: 500; }
        input[type="text"], input[type="email"], input[type="password"] { width: 100%; padding: 12px; border: 1px solid rgba(34, 59, 130, 0.3); border-radius: 8px; font-size: 14px; color: #223b82; outline: none; transition: border 0.2s; }
        input:focus { border-color: #223b82; }
        .checkbox-group { display: flex; align-items: center; gap: 8px; margin: 15px 0; font-size: 14px; }
        .checkbox-group input { width: 16px; height: 16px; accent-color: #223b82; }
        button { width: 100%; background-color: #223b82; color: #ffffff; border: none; padding: 14px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
        button:hover { background-color: #1a2d63; }
        #mensaje { margin-top: 15px; padding: 12px; border-radius: 8px; font-size: 14px; text-align: center; display: none; }
        .success { background-color: #e6f4ea; color: #137333; }
        .error { background-color: #fce8e6; color: #c5221f; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Creación de nuevos usuarios</h2>
         
        <form id="adminForm">
          <div class="section-title">Credenciales Admin</div>
          <div class="form-group">
            <label>Usuario Administrador</label>
            <input type="text" id="adminNombre" required placeholder="Ej: pedro">
          </div>
          <div class="form-group">
            <label>Contraseña Administrador</label>
            <input type="password" id="adminContrasena" required placeholder="••••••••">
          </div>

          <div class="section-title">Nuevo Usuario</div>
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" id="nuevoNombre" required placeholder="Ej: Juan Pérez">
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" id="nuevoCorreo" required placeholder="juan@correo.com">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" id="nuevaContrasena" required placeholder="••••••••">
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="nuevoTienePermisos">
            <label for="nuevoTienePermisos">Asignar permisos de Administrador</label>
          </div>

          <button type="submit">Crear Usuario</button>
        </form>

        <div id="mensaje"></div>
      </div>

      <script>
        document.getElementById('adminForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const msgDiv = document.getElementById('mensaje');
          msgDiv.style.display = 'none';

          const data = {
            adminNombre: document.getElementById('adminNombre').value,
            adminContrasena: document.getElementById('adminContrasena').value,
            nuevoNombre: document.getElementById('nuevoNombre').value,
            nuevoCorreo: document.getElementById('nuevoCorreo').value,
            nuevaContrasena: document.getElementById('nuevaContrasena').value,
            nuevoTienePermisos: document.getElementById('nuevoTienePermisos').checked ? 1 : 0
          };

          try {
            const response = await fetch('/crear-usuario', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
              msgDiv.className = 'success';
              msgDiv.textContent = result.mensaje || 'Usuario creado correctamente';
              document.getElementById('nuevoNombre').value = '';
              document.getElementById('nuevoCorreo').value = '';
              document.getElementById('nuevaContrasena').value = '';
              document.getElementById('nuevoTienePermisos').checked = false;
            } else {
              msgDiv.className = 'error';
              msgDiv.textContent = result.error || 'Error al crear usuario';
            }
          } catch (err) {
            msgDiv.className = 'error';
            msgDiv.textContent = 'Error de conexión con el servidor';
          }
          msgDiv.style.display = 'block';
        });
      </script>
    </body>
    </html>
    `;
