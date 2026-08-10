const requestTypes = new Set([
  "General Question",
  "Technical Support",
  "Suggest an Improvement",
  "Request a New Feature",
  "Request a Template",
  "Report a Problem",
  "Other",
]);

const responseHeaders = {
  "Cache-Control": "no-store",
};

function textValue(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function feedbackResponse(message: string, status = 200) {
  return Response.json(
    { message },
    {
      status,
      headers: responseHeaders,
    },
  );
}

function getSupportEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.SUPPORT_FROM_EMAIL?.trim();
  const to = process.env.SUPPORT_TO_EMAIL?.trim();

  return apiKey && from && to ? { apiKey, from, to } : null;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return feedbackResponse("Please send the feedback form again.", 400);
  }

  if (!body || typeof body !== "object") {
    return feedbackResponse("Please complete the feedback form.", 400);
  }

  const feedback = body as Record<string, unknown>;
  const name = textValue(feedback.name, 120);
  const email = textValue(feedback.email, 254);
  const type = textValue(feedback.type, 80);
  const message = textValue(feedback.message, 5000);
  const website = textValue(feedback.website, 200);

  // Hidden honeypot field: bots receive a harmless success response and no email is sent.
  if (website) return feedbackResponse("Thank you for your feedback.");

  if (!requestTypes.has(type) || message.length < 10) {
    return feedbackResponse(
      "Choose a request type and write at least 10 characters.",
      400,
    );
  }

  if (email && !validEmail(email)) {
    return feedbackResponse(
      "Please enter a valid email address or leave it blank.",
      400,
    );
  }

  const emailConfig = getSupportEmailConfig();

  if (!emailConfig) {
    return feedbackResponse(
      "Feedback delivery is temporarily unavailable. Please try again later.",
      503,
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailConfig.from,
        to: [emailConfig.to],
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
    return feedbackResponse(
      "We could not send your feedback right now. Please try again shortly.",
      502,
    );
  }

  return feedbackResponse(
    "Thank you! Your feedback has been sent successfully. The DocSprintHub Support Team will review it shortly.",
  );
}
