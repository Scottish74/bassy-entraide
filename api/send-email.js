import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, email, prenom, nom } = req.body;
  console.log("send-email appelé:", { type, email, prenom, nom });
  console.log("RESEND_API_KEY présente:", !!process.env.RESEND_API_KEY);

  try {
    if (type === 'welcome') {
      const r1 = await resend.emails.send({
        from: 'Bassy Entraide <noreply@bassy-entraide.fr>',
        to: [email],
        subject: 'Bienvenue dans Bassy Entraide !',
        html: '<p>Bonjour ' + prenom + ', votre inscription est bien reçue !</p>'
      });
      console.log("Email membre:", JSON.stringify(r1));

      const r2 = await resend.emails.send({
        from: 'Bassy Entraide <noreply@bassy-entraide.fr>',
        to: ['franckscotton@gmail.com'],
        subject: 'Nouvelle inscription - ' + prenom + ' ' + nom,
        html: '<p>Nouveau membre : ' + prenom + ' ' + nom + ' (' + email + ')</p>'
      });
      console.log("Email admin:", JSON.stringify(r2));
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("RESEND ERROR:", err.message, err.statusCode, JSON.stringify(err));
    res.status(500).json({ error: err.message });
  }
}