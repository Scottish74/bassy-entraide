import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

 const { type, email, prenom, nom } = req.body;
  console.log("send-email appelé:", { type, email, prenom, nom });
  try {
    if (type === 'welcome') {
      await resend.emails.send({
        from: 'Bassy Entraide <noreply@send.bassy-entraide.fr>',
        to: [email],
        subject: '🏡 Bienvenue dans Bassy Entraide !',
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;background:#f7faf8;border-radius:18px;overflow:hidden;border:1px solid #ddeee5;">
            <div style="background:linear-gradient(135deg,#1e4d35,#2d7a52);padding:32px 28px;text-align:center;">
              <div style="font-size:48px;margin-bottom:8px;">🏡</div>
              <div style="font-family:Georgia,serif;font-size:24px;color:#fff;font-weight:700;">Bassy Entraide</div>
              <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px;">Bassy · Haute-Savoie 74 · Réseau de confiance</div>
            </div>
            <div style="padding:32px 28px;">
              <p style="font-size:16px;color:#1a2e22;font-weight:700;">Bonjour ${prenom} 👋</p>
              <p style="font-size:14px;color:#3d5a46;line-height:1.7;">Votre demande d'inscription à <strong>Bassy Entraide</strong> a bien été reçue.</p>
              <div style="background:#d4ede1;border-radius:12px;padding:16px 18px;margin:20px 0;border-left:4px solid #2d7a52;">
                <p style="font-size:13px;color:#1e4d35;margin:0;line-height:1.6;">Votre compte est en attente de validation par l'administrateur. Vous recevrez un email dès que votre accès sera activé.</p>
              </div>
            </div>
            <div style="background:#1e4d35;padding:16px 28px;text-align:center;">
              <p style="font-size:11px;color:rgba(255,255,255,.6);margin:0;">Bassy Entraide · Village de Bassy, Haute-Savoie 74</p>
            </div>
          </div>
        `
      });

      await resend.emails.send({
        from: 'Bassy Entraide <noreply@send.bassy-entraide.fr>',
        to: 'franckscotton@gmail.com',
        subject: `Nouvelle inscription - ${prenom} ${nom}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;background:#f7faf8;border-radius:18px;overflow:hidden;border:1px solid #ddeee5;">
            <div style="background:linear-gradient(135deg,#1a3a5c,#2b6cb0);padding:32px 28px;text-align:center;">
              <div style="font-size:48px;margin-bottom:8px;">🔔</div>
              <div style="font-family:Georgia,serif;font-size:24px;color:#fff;font-weight:700;">Nouvelle inscription</div>
            </div>
            <div style="padding:32px 28px;">
              <p style="font-size:14px;color:#1a2e22;">Nom : <strong>${prenom} ${nom}</strong></p>
              <p style="font-size:14px;color:#1a2e22;">Email : <strong>${email}</strong></p>
              <a href="https://www.bassy-entraide.fr" style="display:block;text-align:center;background:linear-gradient(135deg,#2d7a52,#1e4d35);color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;margin-top:20px;">Valider le compte</a>
            </div>
            <div style="background:#1a3a5c;padding:16px 28px;text-align:center;">
              <p style="font-size:11px;color:rgba(255,255,255,.6);margin:0;">Bassy Entraide · Administration</p>
            </div>
          </div>
        `
      });
    }

    res.status(200).json({ ok: true, sent: true });
  } catch (err) {
  console.error("RESEND ERROR:", JSON.stringify(err));
  res.status(500).json({ error: err.message });
}
}