// Apply selected template
document.getElementById("template").addEventListener("change", function() {
    let resumePreview = document.getElementById("resume-preview");
    resumePreview.className = ""; // Reset classes
    resumePreview.classList.add(this.value + "-template");
});

// Update resume preview dynamically
document.addEventListener("DOMContentLoaded", function() {
    // Load saved data on page load
    loadData();

    // Attach event listeners for real-time updates
    document.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", updateResume);
    });

    // Enable Drag and Drop (Using Sortable.js)
    new Sortable(document.getElementById("resume-preview"), {
        animation: 150,
        ghostClass: "dragging",
    });

    // Attach functions to buttons
    document.querySelector("button[onclick='updateResume()']").addEventListener("click", updateResume);
    document.querySelector("button[onclick='downloadPDF()']").addEventListener("click", downloadPDF);

    // Load saved profile picture on page load
    let savedPic = localStorage.getItem("profilePic");
    if (savedPic) {
        let profilePreview = document.getElementById("profile-preview");
        profilePreview.src = savedPic;
        profilePreview.style.display = "block";
    }

    // Load Dark Mode preference on page load
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggleButton.textContent = "☀️ Light Mode";
    }
});

// Save form data in Local Storage
function saveData() {
    let formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        linkedin: document.getElementById("linkedin").value,
        education: document.getElementById("education").value,
        experience: document.getElementById("experience").value,
        skills: document.getElementById("skills").value,
        summary: document.getElementById("summary").value,
        template: document.getElementById("template").value,
    };
    localStorage.setItem("resumeData", JSON.stringify(formData));
}

// Update resume preview
function updateResume() {
    // Get user input values
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let linkedin = document.getElementById("linkedin").value;
    let summary = document.getElementById("summary").value;
    let skills = document.getElementById("skills").value;
    let experience = document.getElementById("experience").value;
    let education = document.getElementById("education").value;

    // Update resume preview
    document.getElementById("preview-name").textContent = name || "Your Name";
    document.getElementById("preview-email").textContent = email || "your.email@example.com";
    document.getElementById("preview-phone").textContent = phone || "+123 456 7890";
    document.getElementById("preview-address").textContent = address || "1234 Park Avenue, CA";
    document.getElementById("preview-linkedin").textContent = linkedin || "linkedin.com/your-name";
    document.getElementById("preview-summary").textContent = summary || "A brief summary about yourself...";
    document.getElementById("preview-experience").textContent = experience || "Work experience here";
    document.getElementById("preview-education").textContent = education || "Education details here";

    // Update skills as bullet points
    let skillsPreview = document.getElementById("preview-skills");
    skillsPreview.innerHTML = ""; // Clear previous content

    if (skills) {
        // Split skills by comma or newline
        let skillsList = skills.split(/[,\n]/).map(skill => skill.trim()).filter(skill => skill);

        // Create a <ul> element
        let ul = document.createElement("ul");

        // Add each skill as a <li> element
        skillsList.forEach(skill => {
            let li = document.createElement("li");
            li.textContent = skill;
            ul.appendChild(li);
        });

        // Append the <ul> to the skills preview
        skillsPreview.appendChild(ul);
    } else {
        skillsPreview.textContent = "Skills here"; // Default text if no skills are entered
    }

    // Save data to localStorage
    saveData();
}
// Load saved data on page refresh
function loadData() {
    let savedData = JSON.parse(localStorage.getItem("resumeData"));
    if (savedData) {
        document.getElementById("name").value = savedData.name;
        document.getElementById("email").value = savedData.email;
        document.getElementById("phone").value = savedData.phone;
        document.getElementById("address").value = savedData.address;
        document.getElementById("linkedin").value = savedData.linkedin;
        document.getElementById("education").value = savedData.education;
        document.getElementById("experience").value = savedData.experience;
        document.getElementById("skills").value = savedData.skills;
        document.getElementById("summary").value = savedData.summary;
        document.getElementById("template").value = savedData.template;

        updateResume(); // Apply data to preview
    }
}

// Handle profile picture upload
document.getElementById("profile-pic").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let profilePreview = document.getElementById("profile-preview");
            profilePreview.src = e.target.result;
            profilePreview.style.display = "block";

            // Save image data to localStorage
            localStorage.setItem("profilePic", e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Toggle Dark Mode
const toggleButton = document.getElementById("dark-mode-toggle");
toggleButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    // Update button text and save state
    if (document.body.classList.contains("dark-mode")) {
        toggleButton.textContent = "☀️ Light Mode";
        localStorage.setItem("darkMode", "enabled");
    } else {
        toggleButton.textContent = "🌙 Dark Mode";
        localStorage.setItem("darkMode", "disabled");
    }
});

// Download as PDF
function downloadPDF() {
    // Create a wrapper div to hold both panels
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row"; // Side by side layout
    wrapper.style.width = "100%";
    wrapper.style.gap = "0"; // No gap between panels
    wrapper.style.margin = "0"; // No margin
    wrapper.style.padding = "0"; // No padding

    // Clone the panels
    const element1 = document.querySelector(".resume-panel").cloneNode(true);
    const element2 = document.querySelector(".resume-panel-2").cloneNode(true);

    // Append both panels to the wrapper
    wrapper.appendChild(element1);
    wrapper.appendChild(element2);

    // Append wrapper to the body (hidden)
    document.body.appendChild(wrapper);

    // Convert to PDF
    html2pdf(wrapper, {
        margin: 0, // No margin in the PDF
        filename: "Resume.pdf",
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 3,
            useCORS: true, // Ensure images are loaded correctly
            logging: true, // Enable logging for debugging
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        },
    }).then(() => {
        document.body.removeChild(wrapper); // Clean up after download
    });
}