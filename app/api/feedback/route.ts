const requestTypes = new Set([
  "General Question",
  "Technical Support",
  "Suggest an Improvement",
  "Request a New Feature",
  "Request a Template",
  "Report a Problem",
  "Other",
]);

function textValue(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Please send the feedback form again." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ message: "Please complete the feedback form." }, { status: 400 });
  }

  const feedback = body as Record<string, unknown>;
  const name = textValue(feedback.name, 120);
  const email = textValue(feedback.email, 254);
  const type = textValue(feedback.type, 80);
  const message = textValue(feedback.message, 5000);
  const website = textValue(feedback.website, 200);

  // Hidden honeypot field: bots receive a harmless success response and no email is sent.
  if (website) return Response.json({ message: "Thank you for your feedback." });

  if (!requestTypes.has(type) || message.length < 10) {
    return Response.json({ message: "Choose a request type and write at least 10 characters." }, { status: 400 });
  }

  if (email && !validEmail(email)) {
    return Response.json({ message: "Please enter a valid email address or leave it blank." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SUPPORT_FROM_EMAIL;
  const to = process.env.SUPPORT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return Response.json(
      { message: "Feedback delivery is not configured yet. Please contact the support team directly." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(email ? { reply_to: email } : {}),
        subject: `[DocSprintHub] ${type}`,
        text: [
          `Request type: ${type}`,
          `Name: ${name || "Not provided"}`,
          `Email: ${email || "Not provided"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Email service rejected the feedback message.");
  } catch {
    return Response.json(
      { message: "We could not send your feedback right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return Response.json({ message: "Thank you! Your feedback has been sent to the DocSprintHub Support Team." });
}
