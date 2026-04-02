import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, email, prenom, nom } = req.body;

  try {
    if (type === 'welcome') {

      await resend.emails.send({
        from: 'Bassy Entraide <noreply@bassy-entraide.fr>',
        to: [email],
        subject: '🏡 Bienvenue dans Bassy Entraide !',
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f4f1;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(30,77,53,.13);border:1px solid #c8ddd0;">
    
    <div style="background:linear-gradient(135deg,#1e4d35 0%,#2d7a52 60%,#4aab78 100%);padding:40px 32px;text-align:center;position:relative;">
      <div style="font-size:56px;margin-bottom:10px;">🏡</div>
      <div style="font-family:Georgia,serif;font-size:28px;color:#fff;font-weight:700;letter-spacing:-.5px;">Bassy Entraide</div>
      <div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:6px;letter-spacing:.04em;">BASSY · HAUTE-SAVOIE 74 · RÉSEAU DE CONFIANCE</div>
    </div>

    <div style="background:#fff;padding:36px 32px;">
      <p style="font-size:20px;color:#1a2e22;font-weight:700;margin:0 0 8px;">Bonjour ${prenom} 👋</p>
      <p style="font-size:14px;color:#3d5a46;line-height:1.8;margin:0 0 20px;">Votre demande d'inscription à <strong>Bassy Entraide</strong> a bien été reçue. Bienvenue dans notre réseau de voisinage !</p>
      
      <div style="background:linear-gradient(135deg,#d4ede1,#eaf6f0);border-radius:14px;padding:20px 22px;margin:0 0 20px;border-left:5px solid #2d7a52;">
        <div style="font-size:13px;font-weight:800;color:#1e4d35;margin-bottom:6px;">⏳ Validation en cours</div>
        <p style="font-size:13px;color:#2d5a3d;margin:0;line-height:1.7;">Votre compte est en attente de validation par l'administrateur. Vous recevrez un email dès que votre accès sera activé — généralement dans l'heure !</p>
      </div>

      <div style="background:#f7faf8;border-radius:12px;padding:16px 18px;margin:0 0 24px;border:1px solid #ddeee5;">
        <div style="font-size:12px;font-weight:800;color:#1e4d35;margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em;">📋 La charte Bassy Entraide</div>
        <div style="font-size:12px;color:#3d5a46;line-height:1.9;">
          ✅ Entraide sincère entre voisins<br/>
          ✅ Prix des courses = montant exact du ticket de caisse<br/>
          ✅ Trajets = participation aux frais réels uniquement<br/>
          ✅ Bienveillance et respect de chacun<br/>
          ✅ Aucune activité commerciale déguisée
        </div>
      </div>

      <a href="https://www.bassy-entraide.fr" style="display:block;text-align:center;background:linear-gradient(135deg,#2d7a52,#1e4d35);color:#fff;padding:15px;border-radius:13px;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:.02em;">Accéder à Bassy Entraide →</a>
    </div>

    <div style="background:linear-gradient(135deg,#1e4d35,#163d29);padding:20px 32px;text-align:center;">
      <p style="font-size:11px;color:rgba(255,255,255,.55);margin:0;line-height:1.8;">Bassy Entraide · Village de Bassy, Haute-Savoie 74<br/>secretariat@bassy.fr · bassy-entraide.fr</p>
    </div>

  </div>
</body>
</html>`
      });

      await resend.emails.send({
        from: 'Bassy Entraide <noreply@bassy-entraide.fr>',
        to: ['franckscotton@gmail.com'],
        subject: `🔔 Nouvelle inscription — ${prenom} ${nom}`,
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f4f1;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(26,58,92,.13);border:1px solid #c8ddd0;">

    <div style="background:linear-gradient(135deg,#1a3a5c 0%,#2b6cb0 100%);padding:40px 32px;text-align:center;">
      <div style="font-size:56px;margin-bottom:10px;">🔔</div>
      <div style="font-family:Georgia,serif;font-size:26px;color:#fff;font-weight:700;">Nouvelle inscription</div>
      <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:6px;letter-spacing:.04em;">BASSY ENTRAIDE · PANNEAU ADMIN</div>
    </div>

    <div style="background:#fff;padding:36px 32px;">
      <p style="font-size:14px;color:#1a2e22;line-height:1.8;margin:0 0 20px;">Un nouveau membre souhaite rejoindre <strong>Bassy Entraide</strong> et attend votre validation :</p>

      <div style="background:#f7faf8;border-radius:14px;padding:20px 22px;margin:0 0 24px;border:1px solid #ddeee5;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="font-size:12px;font-weight:800;color:#5a7a65;padding:6px 0;text-transform:uppercase;letter-spacing:.06em;width:90px;">Prénom</td><td style="font-size:14px;color:#1a2e22;font-weight:700;padding:6px 0;">${prenom}</td></tr>
          <tr><td style="font-size:12px;font-weight:800;color:#5a7a65;padding:6px 0;text-transform:uppercase;letter-spacing:.06em;">Nom</td><td style="font-size:14px;color:#1a2e22;font-weight:700;padding:6px 0;">${nom || '—'}</td></tr>
          <tr><td style="font-size:12px;font-weight:800;color:#5a7a65;padding:6px 0;text-transform:uppercase;letter-spacing:.06em;">Email</td><td style="font-size:14px;color:#2b6cb0;padding:6px 0;">${email}</td></tr>
        </table>
      </div>

      <a href="https://www.bassy-entraide.fr" style="display:block;text-align:center;background:linear-gradient(135deg,#2d7a52,#1e4d35);color:#fff;padding:15px;border-radius:13px;text-decoration:none;font-weight:800;font-size:15px;">Valider le compte dans l'app →</a>
    </div>

    <div style="background:linear-gradient(135deg,#1a3a5c,#0f2340);padding:20px 32px;text-align:center;">
      <p style="font-size:11px;color:rgba(255,255,255,.55);margin:0;">Bassy Entraide · Administration · bassy-entraide.fr</p>
    </div>

  </div>
</body>
</html>`
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("RESEND ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
}