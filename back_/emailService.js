import { BrevoClient } from "https://esm.sh/@getbrevo/brevo@5.0.4";

const apiKey = Deno.env.get("BREVO_API_KEY");
console.log("DEBUG: Valor de API KEY detectado:", apiKey ? "Cargado" : "VACÍO");

if (!apiKey) {
    throw new Error("ERROR CRÍTICO: La variable BREVO_API_KEY no existe en el entorno.");
}

const brevo = new BrevoClient({
  apiKey: apiKey,
});

export const sendPasswordEmail = async (toEmail, tokenRecuperar) => {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: "Recuperación de contraseña",
    sender: {
      name: Deno.env.get("BREVO_FROM_NAME"),
      email: Deno.env.get("BREVO_FROM_EMAIL")
    },
    to: [{ email: toEmail }],
    htmlContent: `<html><body><p>Hola, tu token es: <strong>${tokenRecuperar}</strong></p></body></html>`
  });

  return result;
};