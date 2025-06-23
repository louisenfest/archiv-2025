const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const data = {
      message: body.message || "Kein Inhalt übermittelt.",
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        ...data,
      }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorType: error.name,
        errorMessage: error.message,
        trace: error.stack?.split("\n"),
      }),
    };
  }
};
