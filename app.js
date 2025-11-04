document.getElementById('admissionForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        age: parseInt(formData.get('age')),
        course: formData.get('course')
    };

    const messageDiv = document.getElementById('message');
    messageDiv.className = '';
    messageDiv.textContent = 'Submitting...';

    try {
        const response = await fetch('http://localhost:4000/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            messageDiv.className = 'success';
            messageDiv.textContent = `Admission successful! Student ID: ${result.student.id}`;
            event.target.reset(); // Clear the form
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = `Error: ${result.errors ? result.errors.join(', ') : result.message}`;
        }
    } catch (error) {
        messageDiv.className = 'error';
        messageDiv.textContent = 'Network error. Please check if the server is running.';
        console.error('Error:', error);
    }
});
