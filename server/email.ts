import { Resend } from "resend";

let cachedClient: Resend | null = null;
let cachedFromEmail: string | null = null;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  const connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error("Resend not connected");
  }

  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email,
  };
}

// Get a fresh Resend client (never cache, access tokens expire)
async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}

export async function sendGameResultsEmail(
  playerName: string,
  finalBalance: number,
  giftType: string,
  playerEmail?: string
) {
  try {
    const { client, fromEmail } = await getResendClient();

    const giftLabels: Record<string, string> = {
      crypto: "Crypto transfer",
      amazon: "Amazon gift card",
      playstation: "PlayStation gift card",
      gas: "Gas card",
    };

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #ff6b35; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #1a1a1a; margin: 0; }
            .content { margin: 20px 0; }
            .balance { font-size: 36px; font-weight: bold; color: #ff6b35; text-align: center; margin: 20px 0; }
            .gift-choice { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ff6b35; margin: 15px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Birthday Challenge Results</h1>
            </div>
            <div class="content">
              <p>Hi ${playerName},</p>
              <p>Congratulations on completing the Birthday Challenge! Here are your results:</p>
              
              <div class="balance">
                $${finalBalance}
              </div>
              
              <p style="text-align: center; color: #666; margin: 10px 0;">Your real-world birthday gift amount</p>
              
              <div class="gift-choice">
                <strong>Your Choice:</strong><br>
                ${giftLabels[giftType] || giftType}
              </div>
              
              <p>Your gift has been recorded and will be processed shortly. Thank you for playing!</p>
            </div>
            <div class="footer">
              <p>The Birthday Challenge • ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const recipients = ["verleepollock@gmail.com"];
    if (playerEmail) {
      recipients.push(playerEmail);
    }

    const response = await client.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `Birthday Challenge Results - $${finalBalance} won!`,
      html: htmlContent,
    });

    console.log(`Email sent for player ${playerName}:`, response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
