/* app.js */

/* ---------- Menu toggle (mobile) ---------- */
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');

        // change icon between bars and times (FontAwesome)
        if (menuIcon.classList.contains('fa-bars')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark'); // fa-times alternative in FA6 is fa-xmark
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });
}

/* Close navbar on link click (mobile) */
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            // reset icon
            if (menuIcon) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        }
    });
});

/* ---------- Typed.js (typed.umd.js loaded in HTML) ---------- */
if (typeof Typed !== 'undefined') {
    new Typed('.multiple-text', {
        strings: ['Frontend Developer', 'React Developer', 'Web Designer', 'Problem Solver'],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 1200,
        loop: true,
        showCursor: true
    });
}

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length > 1) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

function onScrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120; // adjust for header height
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
window.addEventListener('scroll', onScrollActive);
window.addEventListener('load', onScrollActive);

/* ---------- Simple scroll reveal using IntersectionObserver ---------- */
const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal'); // CSS should define .reveal animation (we'll use inline effect below)
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

/* Targets to reveal: skills, portfolio boxes, about-img, home-content etc. */
document.querySelectorAll('.skill, .portfolio-box, .about-img, .home-content, .portfolio-layer').forEach(el => {
    revealObserver.observe(el);
});

/* Add small CSS for .reveal (in JS so no need to change your CSS file) */
(function insertRevealStyle() {
    const id = 'js-reveal-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
    .reveal { 
      opacity: 1 !important; 
      transform: translateY(0) !important; 
      transition: all 700ms cubic-bezier(.2,.8,.2,1);
    }
    .skill, .portfolio-box, .about-img, .home-content, .portfolio-layer {
      opacity: 0;
      transform: translateY(30px);
    }
  `;
    document.head.appendChild(style);
})();

/* ---------- Resume download button enhancement ---------- */
const resumeBtn = document.querySelector('.btn'); // your Download Resume button has .btn
if (resumeBtn && resumeBtn.tagName === 'A') {
    // if user left href="#" we replace it with resume.pdf download
    if (!resumeBtn.getAttribute('href') || resumeBtn.getAttribute('href') === '#') {
        resumeBtn.setAttribute('href', 'resume.pdf'); // put your actual resume file name here if different
        resumeBtn.setAttribute('download', 'Aman_Kumar_Resume.pdf');
    }
}

/* ---------- Contact form: simple client-side validation + friendly UX ---------- */
const contactForm = document.querySelector('form[name="contactForm"]') || document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        // Basic validation (HTML already has required attributes, but JS gives nicer UX)
        const name = contactForm.querySelector('input[name="fullname"]');
        const email = contactForm.querySelector('input[name="email"]');
        const message = contactForm.querySelector('textarea[name="message"]');

        // If any required missing, let HTML handle it, else show a small overlay message and allow default submission
        if (name && email && message) {
            // show a temporary "sending" overlay to user
            e.preventDefault();

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.background = 'rgba(0,0,0,0.6)';
            overlay.style.zIndex = 9999;
            overlay.innerHTML = '<div style=\"background:#fff;padding:22px 28px;border-radius:10px;font-size:16px;color:#111;\">Sending message... <span style=\"display:block;margin-top:8px;font-size:13px;color:#666\">Please wait</span></div>';
            document.body.appendChild(overlay);

            // simulate sending then submit (if using Formspree or your backend you may directly submit via fetch instead)
            setTimeout(() => {
                document.body.removeChild(overlay);
                // If your form has action to Formspree (or contact.php), we can submit now:
                contactForm.submit();
            }, 900); // short delay for UX
        }
    });
}

// -----------------------
// AJAX Contact Form (Formspree)
// -----------------------
const form = document.getElementById("contactForm");
const statusTxt = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    statusTxt.innerHTML = "Sending message...";
    statusTxt.style.color = "orange";

    const formData = new FormData(form);

    try {
        const response = await fetch("https://formspree.io/f/xdklyyqr", {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            statusTxt.innerHTML = "Message sent successfully! ✅";
            statusTxt.style.color = "lightgreen";
            form.reset();
        } else {
            statusTxt.innerHTML = "Failed to send message ❌";
            statusTxt.style.color = "red";
        }
    } catch (error) {
        statusTxt.innerHTML = "Network Error ❌ Try again!";
        statusTxt.style.color = "red";
    }
});

// Success Popup
function showPopup(message) {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#fff";
    popup.style.color = "#111";
    popup.style.padding = "20px 30px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)";
    popup.style.fontSize = "18px";
    popup.style.zIndex = 99999;
    popup.innerHTML = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transition = "0.5s";
    }, 1500);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000);
}




/* ---------- Small accessibility improvements ---------- */
// Add keyboard toggle for menu (Enter key)
if (menuIcon) {
    menuIcon.tabIndex = 0;
    menuIcon.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') menuIcon.click();
    });
}

/* ---------- Optional: scroll to top button behavior (footer icon) ---------- */
const toTop = document.querySelector('.footer-iconTop a');
if (toTop) {
    toTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
