document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const collegeSelect = document.getElementById('college');
    const courseSelect = document.getElementById('course');

    const coursesByCollege = {
        "GTU - School of Management Studies (GSMS)": [
            "Bachelor of Business Administration (BBA)",
            "Master of Business Administration in International Business (MBA-IB)",
            "Master of Business Administration in Innovation, Entrepreneurship, and Venture Development (MBA-IEV)"
        ],
        "GTU - School of Engineering and Technology (GTU-SET)": [
            "Bachelor of Engineering in Computer Engineering",
            "Bachelor of Engineering in Electronics and Communication Engineering (Proposed for 2024-25)",
            "Master of Engineering in Computer Engineering (Cyber Security)",
            "Master of Engineering in Electronics and Communication Engineering (Mobile Communication and Network Technology)",
            "Master of Engineering in Computer Engineering (Internet of Things)",
            "Master of Technology in Biotechnology",
            "Post Graduate Diploma in Data Science"
        ],
        "Kaushalya The Skill University": [
            "Bachelor of Business Administration (BBA)",
            "Bachelor of Computer Application (BCA)",
            "Bachelor of Design (B.Des)",
            "Bachelor of Arts (B.A)",
            "Bachelor of Commerce (B.Com)",
            "Bachelor of Science (B.Sc)",
            "Master of Science (M.Sc)",
            "Master of Arts (M.A)"
        ],
        "Vishwakarma Government Engineering College (VGEC)": [
            "Chemical Engineering",
            "Civil Engineering",
            "Computer Engineering",
            "Computer Science and Engineering (Data Science)",
            "Electrical Engineering",
            "Electronics and Communication Engineering",
            "Electronics and Instrumentation Engineering",
            "Information Technology",
            "Information and Communication Technology",
            "Instrumentation and Control Engineering",
            "Mechanical Engineering",
            "Power Electronics Engineering"
        ],
        "School of Applied Sciences & Technology (SAST - GTU)": [
            "Bachelor of Science (B.Sc.) Honors with Research in Biotechnology",
            "Master of Science (M.Sc.) in Industrial Biotechnology"
        ]
    };

    collegeSelect.addEventListener('change', function() {
        const selectedCollege = collegeSelect.value;
        const courses = coursesByCollege[selectedCollege] || [];
        
        // Clear existing options
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        
        // Populate course options based on selected college
        courses.forEach(function(course) {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
        });
    });

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const college = collegeSelect.value;
            const course = courseSelect.value;
            const year = document.getElementById('year').value;
            const linkedin = document.getElementById('linkedin').value;
            const instagram = document.getElementById('instagram').value;
            const contact = document.getElementById('contact').value;

            // Send data to server (you'll need a backend API endpoint)
            fetch('/api/register', { // Replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    college: college,
                    course: course,
                    year: year,
                    linkedin: linkedin,
                    instagram: instagram,
                    contact: contact
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('formFeedback').textContent = "Registration successful!";
                    document.getElementById('formFeedback').style.color = "green";
                    this.reset();
                } else {
                    document.getElementById('formFeedback').textContent = data.message || "Registration failed.";
                    document.getElementById('formFeedback').style.color = "red";
                }
            });
        });
    }
});
