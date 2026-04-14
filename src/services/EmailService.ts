import nodemailer from "nodemailer";

function createTransporter() {
  if (process.env.NODE_ENV === "production") { 
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Dev: Ethereal fake SMTP
  return null;
}

export class EmailService {
  async sendVerificationEmail(
    toEmail: string,
    userName: string,
    token: string
  ): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Bem-vindo ao FocusFlow, ${userName}! 🎓</h2>
        <p>Obrigado por se cadastrar. Para ativar sua conta, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}"
            style="background-color: #7C3AED; color: white; padding: 14px 28px;
                   text-decoration: none; border-radius: 8px; font-size: 16px;">
            Verificar minha conta
          </a>
        </div>
        <p style="color: #6B7280; font-size: 14px;">
          Este link expira em <strong>24 horas</strong>.<br/>
          Se você não criou esta conta, ignore este email.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">
          Se o botão não funcionar, copie e cole este link no navegador:<br/>
          <a href="${verificationUrl}" style="color: #7C3AED;">${verificationUrl}</a>
        </p>
      </div>
    `;

    if (process.env.NODE_ENV === "production") {
      const transporter = createTransporter()!;
      await transporter.sendMail({
        from: `"FocusFlow" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Confirme seu cadastro no FocusFlow",
        html,
      });
    } else {
      // Dev: Ethereal
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      const info = await transporter.sendMail({
        from: '"FocusFlow" <focusflow@dev.com>',
        to: toEmail,
        subject: "Confirme seu cadastro no FocusFlow",
        html,
      });

      console.log("📬 Preview do email:", nodemailer.getTestMessageUrl(info));
    }
  }
}