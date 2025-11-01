<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Book Appointment</title>
    <style>
        .form-container { max-width: 500px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .error { color: red; font-size: 14px; }
        .success { color: green; font-size: 14px; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Book Your Appointment</h2>
        <form id="guestForm">
            <div class="form-group">
                <label for="full_name">Full Name *</label>
                <input type="text" id="full_name" name="full_name" required>
                <div class="error" id="full_name_error"></div>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
                <div class="error" id="email_error"></div>
            </div>

            <div class="form-group">
                <label for="phone_number">Phone Number *</label>
                <input type="tel" id="phone_number" name="phone_number" required>
                <div class="error" id="phone_number_error"></div>
            </div>

            <div class="form-group">
                <label for="appointment_date">Appointment Date *</label>
                <input type="datetime-local" id="appointment_date" name="appointment_date" required>
                <div class="error" id="appointment_date_error"></div>
            </div>

            <div class="form-group">
                <label for="doctor_id">Select Doctor *</label>
                <select id="doctor_id" name="doctor_id" required>
                    <option value="">Choose a doctor...</option>
                </select>
                <div class="error" id="doctor_id_error"></div>
            </div>

            <button type="submit">Book Appointment</button>
            <div id="message"></div>
        </form>
    </div>

    <script>
        // Load doctors on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadDoctors();
            
            // Set minimum date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('appointment_date').min = tomorrow.toISOString().slice(0, 16);
        });

        async function loadDoctors() {
            try {
                const response = await fetch('/api/doctors');
                const data = await response.json();
                const select = document.getElementById('doctor_id');
                
                data.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.doctor_id;
                    option.textContent = `${doctor.name} - ${doctor.specialization}`;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading doctors:', error);
            }
        }

        document.getElementById('guestForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            clearErrors();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/api/guests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    document.getElementById('message').innerHTML = `<div class="success">${result.message}</div>`;
                    this.reset();
                } else {
                    if (result.errors) {
                        Object.keys(result.errors).forEach(field => {
                            document.getElementById(`${field}_error`).textContent = result.errors[field][0];
                        });
                    }
                    document.getElementById('message').innerHTML = `<div class="error">${result.message}</div>`;
                }
            } catch (error) {
                document.getElementById('message').innerHTML = `<div class="error">An error occurred. Please try again.</div>`;
            }
        });

        function clearErrors() {
            document.querySelectorAll('.error').forEach(el => el.textContent = '');
            document.getElementById('message').innerHTML = '';
        }
    </script>
</body>
</html>