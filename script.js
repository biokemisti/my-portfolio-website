// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            // Close mobile menu if open
            navMenu.classList.remove("active");

            // Smooth scroll to target
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById("contact-form");
const submitButton = contactForm.querySelector('button[type="submit"]');
const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

// Function to show a success or error message (5 seconds)
function showMessage(element, duration = 5000) {
    element.style.display = "block";
    setTimeout(() => {
        element.style.display = "none";
    }, duration);
}

// Function to set button loading state
function setButtonLoading(loading) {
    if (loading) {
        submitButton.classList.add("loading");
        submitButton.disabled = true;
    } else {
        submitButton.classList.remove("loading");
        submitButton.disabled = false;
    }
}

// Handle form submission
contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    setButtonLoading(true);

    const formData = new FormData(this);
    const data = {
        user_name: formData.get("user_name"),
        user_email: formData.get("user_email"),
        message: formData.get("message"),
    };

    // Send the email to the Netlify serverless function
    fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showMessage(successMessage);
            } else {
                showMessage(errorMessage);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            showMessage(errorMessage);
        })
        .finally(function () {
            setButtonLoading(false);
        });
});

// Scroll-based animations
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll(".section");

    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }
    });
});

// Initialize section animations
document.querySelectorAll(".section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
});

// Input validation
contactForm.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("invalid", function (e) {
        e.preventDefault();
        this.classList.add("invalid");
    });

    input.addEventListener("input", function () {
        this.classList.remove("invalid");
    });
});
