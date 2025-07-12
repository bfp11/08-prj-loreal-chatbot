const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const CLOUDLARE_WORKER_URL = 'https://your-cloudflare-worker-name.your-subdomain.workers.dev'; // replace with your Cloudflare URL

const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L'Oréal. Only answer questions about L'Oréal beauty products, skincare, haircare, fragrances, and routines. Politely refuse unrelated queries."
  }
];

appendMessage("ai", "👋 Hello! How can I help you today?");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = userInput.value.trim();
  if (!input) return;

  // Display user's question
  appendMessage("user", input);
  userInput.value = "";

  messages.push({ role: "user", content: input });

  try {
    const response = await fetch(CLOUDLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Sorry, no response found.";

    messages.push({ role: "assistant", content: aiResponse });
    appendMessage("ai", aiResponse);
  } catch (error) {
    console.error("Fetch error:", error);
    appendMessage("ai", "⚠️ Something went wrong. Please try again.");
  }
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
