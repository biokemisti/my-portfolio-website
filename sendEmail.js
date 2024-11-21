exports.handler = async function (event, context) {
    const { user_name, user_email, message } = JSON.parse(event.body);

    const { SMTPClient } = await import("emailjs");

    // Create the email client instance
    const client = new SMTPClient({
        user: process.env.EMAILJS_USER,
        password: process.env.EMAILJS_PASSWORD,
        host: process.env.EMAILJS_HOST,
        ssl: true,
        port: 465,
    });

    // Set up email parameters
    const emailParams = {
        from: process.env.EMAILJS_USER,
        to: process.env.EMAILJS_RECIPIENT,
        subject: `New message from ${user_name}`,
        text: `Email: ${user_email}\n\nMessage:\n${message}`,
    };

    try {
        // Send the email
        await new Promise((resolve, reject) => {
            client.send(emailParams, function (error, message) {
                if (error) {
                    console.error("Email send failed:", error);
                    reject(error);
                } else {
                    console.log("Email sent successfully:", message);
                    resolve(message);
                }
            });
        });

        // Respond
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Message sent successfully",
            }),
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Failed to send message",
            }),
        };
    }
};
