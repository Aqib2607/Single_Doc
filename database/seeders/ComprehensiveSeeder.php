<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ComprehensiveSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        $this->clearExistingData();
        
        // Seed data in dependency order
        $this->seedDoctors();
        $this->seedPatients();
        $this->seedAppointments();
        $this->seedCartItems();
        $this->seedConsultations();
        $this->seedMedicalRecords();
        $this->seedPrescriptions();
        $this->seedMessages();
        $this->seedMedicines();
        $this->seedTests();
        $this->seedDoctorReviews();
        $this->seedBlogs();
        $this->seedGalleries();
        $this->seedSubscriptions();
        $this->seedSchedules();
        
        // Output summary report
        $this->outputSummaryReport();
    }

    private function clearExistingData(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        $tables = [
            'schedules', 'subscriptions', 'galleries', 'blogs', 'doctor_reviews',
            'tests', 'medicines', 'messages', 'prescriptions', 'medical_records',
            'consultations', 'cart_items', 'appointments', 'patients', 'doctors'
        ];
        
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        echo "✓ Cleared existing data\n";
    }

    private function seedDoctors(): void
    {
        $doctors = [
            [
                'doctor_id' => 1,
                'name' => 'Dr. Sarah Johnson',
                'email' => 'sarah.johnson@hospital.com',
                'password' => Hash::make('password123'),
                'specialization' => 'Cardiology',
                'license_number' => 'MD-CARD-2018-001',
                'bio' => 'Experienced cardiologist with 15 years of practice specializing in heart disease prevention and treatment.',
                'phone' => '+1-555-0101',
                'gender' => 'female',
                'availability' => json_encode(['monday' => '09:00-17:00', 'tuesday' => '09:00-17:00', 'wednesday' => '09:00-17:00']),
                'consultation_fee' => 250.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 2,
                'name' => 'Dr. Michael Chen',
                'email' => 'michael.chen@hospital.com',
                'password' => Hash::make('password123'),
                'specialization' => 'Pediatrics',
                'license_number' => 'MD-PED-2019-002',
                'bio' => 'Board-certified pediatrician dedicated to providing comprehensive healthcare for children and adolescents.',
                'phone' => '+1-555-0102',
                'gender' => 'male',
                'availability' => json_encode(['monday' => '08:00-16:00', 'thursday' => '08:00-16:00', 'friday' => '08:00-16:00']),
                'consultation_fee' => 180.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 3,
                'name' => 'Dr. Emily Rodriguez',
                'email' => 'emily.rodriguez@hospital.com',
                'password' => Hash::make('password123'),
                'specialization' => 'Dermatology',
                'license_number' => 'MD-DERM-2020-003',
                'bio' => 'Dermatologist specializing in skin cancer detection, cosmetic procedures, and general dermatology.',
                'phone' => '+1-555-0103',
                'gender' => 'female',
                'availability' => json_encode(['tuesday' => '10:00-18:00', 'wednesday' => '10:00-18:00', 'saturday' => '09:00-13:00']),
                'consultation_fee' => 200.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 4,
                'name' => 'Dr. James Wilson',
                'email' => 'james.wilson@hospital.com',
                'password' => Hash::make('password123'),
                'specialization' => 'Orthopedics',
                'license_number' => 'MD-ORTH-2017-004',
                'bio' => 'Orthopedic surgeon with expertise in joint replacement, sports medicine, and trauma surgery.',
                'phone' => '+1-555-0104',
                'gender' => 'male',
                'availability' => json_encode(['monday' => '07:00-15:00', 'wednesday' => '07:00-15:00', 'friday' => '07:00-15:00']),
                'consultation_fee' => 300.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 5,
                'name' => 'Dr. Lisa Thompson',
                'email' => 'lisa.thompson@hospital.com',
                'password' => Hash::make('password123'),
                'specialization' => 'Neurology',
                'license_number' => 'MD-NEURO-2021-005',
                'bio' => 'Neurologist specializing in epilepsy, stroke treatment, and neurodegenerative diseases.',
                'phone' => '+1-555-0105',
                'gender' => 'female',
                'availability' => json_encode(['tuesday' => '09:00-17:00', 'thursday' => '09:00-17:00', 'saturday' => '08:00-12:00']),
                'consultation_fee' => 275.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('doctors')->insert($doctors);
        echo "✓ Seeded 5 doctors\n";
    }

    private function seedPatients(): void
    {
        $patients = [
            [
                'patient_id' => 1,
                'name' => 'John Smith',
                'email' => 'john.smith@email.com',
                'password' => Hash::make('password123'),
                'date_of_birth' => '1985-03-15',
                'gender' => 'male',
                'phone' => '+1-555-1001',
                'address' => '123 Main Street, Springfield, IL 62701',
                'emergency_contact_name' => 'Jane Smith',
                'emergency_contact_phone' => '+1-555-1002',
                'medical_history' => 'Hypertension, Type 2 Diabetes',
                'allergies' => 'Penicillin, Shellfish',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 2,
                'name' => 'Maria Garcia',
                'email' => 'maria.garcia@email.com',
                'password' => Hash::make('password123'),
                'date_of_birth' => '1992-07-22',
                'gender' => 'female',
                'phone' => '+1-555-1003',
                'address' => '456 Oak Avenue, Chicago, IL 60601',
                'emergency_contact_name' => 'Carlos Garcia',
                'emergency_contact_phone' => '+1-555-1004',
                'medical_history' => 'Asthma, Seasonal Allergies',
                'allergies' => 'Pollen, Dust mites',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 3,
                'name' => 'Robert Johnson',
                'email' => 'robert.johnson@email.com',
                'password' => Hash::make('password123'),
                'date_of_birth' => '1978-11-08',
                'gender' => 'male',
                'phone' => '+1-555-1005',
                'address' => '789 Pine Street, Milwaukee, WI 53201',
                'emergency_contact_name' => 'Linda Johnson',
                'emergency_contact_phone' => '+1-555-1006',
                'medical_history' => 'High Cholesterol, Previous Heart Attack (2019)',
                'allergies' => 'None known',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 4,
                'name' => 'Sarah Davis',
                'email' => 'sarah.davis@email.com',
                'password' => Hash::make('password123'),
                'date_of_birth' => '2010-05-12',
                'gender' => 'female',
                'phone' => '+1-555-1007',
                'address' => '321 Elm Street, Madison, WI 53703',
                'emergency_contact_name' => 'Michael Davis',
                'emergency_contact_phone' => '+1-555-1008',
                'medical_history' => 'Childhood Asthma',
                'allergies' => 'Latex, Tree nuts',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 5,
                'name' => 'David Brown',
                'email' => 'david.brown@email.com',
                'password' => Hash::make('password123'),
                'date_of_birth' => '1965-09-30',
                'gender' => 'male',
                'phone' => '+1-555-1009',
                'address' => '654 Maple Drive, Green Bay, WI 54301',
                'emergency_contact_name' => 'Patricia Brown',
                'emergency_contact_phone' => '+1-555-1010',
                'medical_history' => 'Arthritis, Previous knee surgery',
                'allergies' => 'Sulfa drugs',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('patients')->insert($patients);
        echo "✓ Seeded 5 patients\n";
    }

    private function seedAppointments(): void
    {
        $appointments = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@email.com',
                'phone' => '+1-555-1001',
                'gender' => 'male',
                'appointment_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'appointment_time' => '09:00:00',
                'doctor' => 'Dr. Sarah Johnson',
                'consultation_type' => 'in-person',
                'reason' => 'Routine cardiac checkup and blood pressure monitoring',
                'terms_accepted' => true,
                'status' => 'confirmed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria.garcia@email.com',
                'phone' => '+1-555-1003',
                'gender' => 'female',
                'appointment_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'appointment_time' => '14:30:00',
                'doctor' => 'Dr. Emily Rodriguez',
                'consultation_type' => 'telemedicine',
                'reason' => 'Skin rash evaluation and treatment consultation',
                'terms_accepted' => true,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Davis',
                'email' => 'sarah.davis@email.com',
                'phone' => '+1-555-1007',
                'gender' => 'female',
                'appointment_date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'appointment_time' => '10:15:00',
                'doctor' => 'Dr. Michael Chen',
                'consultation_type' => 'follow-up',
                'reason' => 'Asthma management and inhaler technique review',
                'terms_accepted' => true,
                'status' => 'confirmed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'David Brown',
                'email' => 'david.brown@email.com',
                'phone' => '+1-555-1009',
                'gender' => 'male',
                'appointment_date' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'appointment_time' => '08:00:00',
                'doctor' => 'Dr. James Wilson',
                'consultation_type' => 'consultation',
                'reason' => 'Knee pain assessment and possible treatment options',
                'terms_accepted' => true,
                'status' => 'confirmed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Robert Johnson',
                'email' => 'robert.johnson@email.com',
                'phone' => '+1-555-1005',
                'gender' => 'male',
                'appointment_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'appointment_time' => '11:00:00',
                'doctor' => 'Dr. Lisa Thompson',
                'consultation_type' => 'in-person',
                'reason' => 'Neurological evaluation for recurring headaches',
                'terms_accepted' => true,
                'status' => 'cancelled',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('appointments')->insert($appointments);
        echo "✓ Seeded 5 appointments\n";
    }

    private function seedCartItems(): void
    {
        $cartItems = [
            [
                'session_id' => 'sess_' . uniqid(),
                'name' => 'Blood Pressure Monitor',
                'description' => 'Digital automatic blood pressure monitor with large display',
                'price' => 89.99,
                'quantity' => 1,
                'category' => 'Medical Devices',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'session_id' => 'sess_' . uniqid(),
                'name' => 'Thermometer Digital',
                'description' => 'Fast-reading digital thermometer with fever alert',
                'price' => 24.99,
                'quantity' => 2,
                'category' => 'Medical Devices',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'session_id' => 'sess_' . uniqid(),
                'name' => 'First Aid Kit',
                'description' => 'Complete first aid kit for home and travel use',
                'price' => 45.50,
                'quantity' => 1,
                'category' => 'Emergency Supplies',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'session_id' => 'sess_' . uniqid(),
                'name' => 'Pulse Oximeter',
                'description' => 'Fingertip pulse oximeter for oxygen saturation monitoring',
                'price' => 35.00,
                'quantity' => 1,
                'category' => 'Medical Devices',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'session_id' => 'sess_' . uniqid(),
                'name' => 'Compression Socks',
                'description' => 'Medical grade compression socks for circulation support',
                'price' => 19.99,
                'quantity' => 3,
                'category' => 'Medical Supplies',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('cart_items')->insert($cartItems);
        echo "✓ Seeded 5 cart items\n";
    }

    private function seedConsultations(): void
    {
        $consultations = [
            [
                'doctor_id' => 1,
                'patient_id' => 1,
                'consultation_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'diagnosis' => 'Hypertension Stage 1',
                'treatment' => 'Lifestyle modifications and ACE inhibitor therapy',
                'notes' => 'Patient shows good compliance with medication. Blood pressure improving.',
                'treatment_plan' => 'Continue current medication, increase exercise, reduce sodium intake',
                'follow_up_date' => Carbon::now()->addDays(30)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 2,
                'patient_id' => 4,
                'consultation_date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'diagnosis' => 'Mild Persistent Asthma',
                'treatment' => 'Inhaled corticosteroid and bronchodilator therapy',
                'notes' => 'Asthma well-controlled with current regimen. Proper inhaler technique demonstrated.',
                'treatment_plan' => 'Continue current inhalers, avoid known triggers, peak flow monitoring',
                'follow_up_date' => Carbon::now()->addDays(90)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 3,
                'patient_id' => 2,
                'consultation_date' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'diagnosis' => 'Contact Dermatitis',
                'treatment' => 'Topical corticosteroid and antihistamine',
                'notes' => 'Rash responding well to treatment. Identified potential allergen.',
                'treatment_plan' => 'Complete steroid course, avoid identified triggers, moisturize regularly',
                'follow_up_date' => Carbon::now()->addDays(14)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 4,
                'patient_id' => 5,
                'consultation_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'diagnosis' => 'Osteoarthritis of the knee',
                'treatment' => 'Physical therapy and NSAIDs',
                'notes' => 'Moderate joint space narrowing on X-ray. Patient reports pain improvement.',
                'treatment_plan' => 'Continue PT exercises, weight management, consider injection if needed',
                'follow_up_date' => Carbon::now()->addDays(60)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 5,
                'patient_id' => 3,
                'consultation_date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'diagnosis' => 'Tension-type headache',
                'treatment' => 'Stress management and preventive medication',
                'notes' => 'No neurological deficits found. Headaches likely stress-related.',
                'treatment_plan' => 'Stress reduction techniques, regular sleep schedule, preventive medication',
                'follow_up_date' => Carbon::now()->addDays(45)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('consultations')->insert($consultations);
        echo "✓ Seeded 5 consultations\n";
    }

    private function seedMedicalRecords(): void
    {
        $medicalRecords = [
            [
                'patient_id' => 1,
                'patient_email' => 'john.smith@email.com',
                'doctor_id' => 1,
                'record_type' => 'Lab Results',
                'title' => 'Lipid Panel and HbA1c',
                'description' => 'Comprehensive metabolic panel showing improved cholesterol levels and good diabetes control',
                'file_path' => '/medical_records/patient_1_lab_results_2024.pdf',
                'status' => 'complete',
                'record_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 2,
                'patient_email' => 'maria.garcia@email.com',
                'doctor_id' => 3,
                'record_type' => 'Imaging',
                'title' => 'Skin Biopsy Results',
                'description' => 'Histopathology report confirming benign dermatitis with no malignant changes',
                'file_path' => '/medical_records/patient_2_biopsy_2024.pdf',
                'status' => 'reviewed',
                'record_date' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 3,
                'patient_email' => 'robert.johnson@email.com',
                'doctor_id' => 5,
                'record_type' => 'Imaging',
                'title' => 'Brain MRI Scan',
                'description' => 'MRI brain with and without contrast - no acute abnormalities detected',
                'file_path' => '/medical_records/patient_3_mri_2024.pdf',
                'status' => 'complete',
                'record_date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 4,
                'patient_email' => 'sarah.davis@email.com',
                'doctor_id' => 2,
                'record_type' => 'Pulmonary Function',
                'title' => 'Spirometry Test Results',
                'description' => 'Pulmonary function test showing mild obstructive pattern consistent with asthma',
                'file_path' => '/medical_records/patient_4_spirometry_2024.pdf',
                'status' => 'reviewed',
                'record_date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => 5,
                'patient_email' => 'david.brown@email.com',
                'doctor_id' => 4,
                'record_type' => 'Imaging',
                'title' => 'Knee X-Ray',
                'description' => 'Bilateral knee X-rays showing moderate osteoarthritic changes',
                'file_path' => '/medical_records/patient_5_xray_2024.pdf',
                'status' => 'pending',
                'record_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('medical_records')->insert($medicalRecords);
        echo "✓ Seeded 5 medical records\n";
    }

    private function seedPrescriptions(): void
    {
        $prescriptions = [
            [
                'doctor_id' => 1,
                'patient_id' => 1,
                'patient_email' => 'john.smith@email.com',
                'medication_name' => 'Lisinopril',
                'dosage' => '10mg',
                'frequency' => 'Once daily',
                'instructions' => 'Take in the morning with or without food. Monitor blood pressure regularly.',
                'start_date' => Carbon::now()->subDays(30)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(60)->format('Y-m-d'),
                'is_active' => true,
                'refills_remaining' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 2,
                'patient_id' => 4,
                'patient_email' => 'sarah.davis@email.com',
                'medication_name' => 'Albuterol Inhaler',
                'dosage' => '90mcg',
                'frequency' => 'As needed',
                'instructions' => 'Use 2 puffs every 4-6 hours as needed for wheezing or shortness of breath.',
                'start_date' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'end_date' => null,
                'is_active' => true,
                'refills_remaining' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 3,
                'patient_id' => 2,
                'patient_email' => 'maria.garcia@email.com',
                'medication_name' => 'Hydrocortisone Cream',
                'dosage' => '1%',
                'frequency' => 'Twice daily',
                'instructions' => 'Apply thin layer to affected areas. Do not use on face or for more than 2 weeks.',
                'start_date' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'is_active' => true,
                'refills_remaining' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 4,
                'patient_id' => 5,
                'patient_email' => 'david.brown@email.com',
                'medication_name' => 'Ibuprofen',
                'dosage' => '400mg',
                'frequency' => 'Three times daily',
                'instructions' => 'Take with food to prevent stomach upset. Do not exceed 1200mg per day.',
                'start_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(20)->format('Y-m-d'),
                'is_active' => true,
                'refills_remaining' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 5,
                'patient_id' => 3,
                'patient_email' => 'robert.johnson@email.com',
                'medication_name' => 'Sumatriptan',
                'dosage' => '50mg',
                'frequency' => 'As needed',
                'instructions' => 'Take at first sign of headache. May repeat once after 2 hours if needed.',
                'start_date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(90)->format('Y-m-d'),
                'is_active' => true,
                'refills_remaining' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('prescriptions')->insert($prescriptions);
        echo "✓ Seeded 5 prescriptions\n";
    }

    private function seedMessages(): void
    {
        $messages = [
            [
                'sender_id' => 1,
                'sender_type' => 'patient',
                'receiver_id' => 1,
                'receiver_type' => 'doctor',
                'subject' => 'Question about medication side effects',
                'message' => 'Hi Dr. Johnson, I\'ve been experiencing some dizziness since starting the new blood pressure medication. Is this normal?',
                'is_read' => true,
                'read_at' => Carbon::now()->subHours(2),
                'created_at' => Carbon::now()->subHours(4),
                'updated_at' => Carbon::now()->subHours(2),
            ],
            [
                'sender_id' => 1,
                'sender_type' => 'doctor',
                'receiver_id' => 1,
                'receiver_type' => 'patient',
                'subject' => 'Re: Question about medication side effects',
                'message' => 'Hello John, mild dizziness can be common when starting blood pressure medication. Please monitor your symptoms and let me know if they worsen.',
                'is_read' => false,
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(1),
                'updated_at' => Carbon::now()->subHours(1),
            ],
            [
                'sender_id' => 4,
                'sender_type' => 'patient',
                'receiver_id' => 2,
                'receiver_type' => 'doctor',
                'subject' => 'Inhaler technique question',
                'message' => 'Dr. Chen, I want to make sure I\'m using my inhaler correctly. Could you review the technique with me at my next visit?',
                'is_read' => true,
                'read_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'sender_id' => 2,
                'sender_type' => 'patient',
                'receiver_id' => 3,
                'receiver_type' => 'doctor',
                'subject' => 'Skin condition update',
                'message' => 'The rash is improving with the cream you prescribed. Should I continue using it for the full two weeks?',
                'is_read' => false,
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(6),
                'updated_at' => Carbon::now()->subHours(6),
            ],
            [
                'sender_id' => 4,
                'sender_type' => 'doctor',
                'receiver_id' => 5,
                'receiver_type' => 'patient',
                'subject' => 'Physical therapy referral',
                'message' => 'David, I\'ve sent your physical therapy referral to the clinic. They should contact you within 2 business days to schedule your first appointment.',
                'is_read' => true,
                'read_at' => Carbon::now()->subHours(3),
                'created_at' => Carbon::now()->subHours(8),
                'updated_at' => Carbon::now()->subHours(3),
            ],
        ];

        DB::table('messages')->insert($messages);
        echo "✓ Seeded 5 messages\n";
    }

    private function seedMedicines(): void
    {
        $medicines = [
            [
                'name' => 'Acetaminophen',
                'description' => 'Pain reliever and fever reducer for mild to moderate pain',
                'manufacturer' => 'Johnson & Johnson',
                'price' => 8.99,
                'stock_quantity' => 150,
                'dosage_form' => 'Tablet',
                'strength' => '500mg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Amoxicillin',
                'description' => 'Antibiotic used to treat bacterial infections',
                'manufacturer' => 'Pfizer',
                'price' => 12.50,
                'stock_quantity' => 75,
                'dosage_form' => 'Capsule',
                'strength' => '250mg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Omeprazole',
                'description' => 'Proton pump inhibitor for acid reflux and heartburn',
                'manufacturer' => 'AstraZeneca',
                'price' => 15.75,
                'stock_quantity' => 100,
                'dosage_form' => 'Delayed-release capsule',
                'strength' => '20mg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Metformin',
                'description' => 'Medication for type 2 diabetes management',
                'manufacturer' => 'Bristol Myers Squibb',
                'price' => 18.25,
                'stock_quantity' => 200,
                'dosage_form' => 'Extended-release tablet',
                'strength' => '500mg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Loratadine',
                'description' => 'Antihistamine for allergies and hay fever',
                'manufacturer' => 'Merck',
                'price' => 9.99,
                'stock_quantity' => 0,
                'dosage_form' => 'Tablet',
                'strength' => '10mg',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('medicines')->insert($medicines);
        echo "✓ Seeded 5 medicines\n";
    }

    private function seedTests(): void
    {
        $tests = [
            [
                'name' => 'Complete Blood Count (CBC)',
                'description' => 'Comprehensive blood test measuring various blood components',
                'category' => 'Hematology',
                'price' => 45.00,
                'sample_type' => 'Blood',
                'duration_hours' => 4,
                'preparation_instructions' => 'No special preparation required. Can eat and drink normally.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lipid Panel',
                'description' => 'Blood test measuring cholesterol and triglyceride levels',
                'category' => 'Chemistry',
                'price' => 35.00,
                'sample_type' => 'Blood',
                'duration_hours' => 6,
                'preparation_instructions' => 'Fast for 9-12 hours before the test. Water is allowed.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Thyroid Function Test (TSH)',
                'description' => 'Blood test to evaluate thyroid gland function',
                'category' => 'Endocrinology',
                'price' => 55.00,
                'sample_type' => 'Blood',
                'duration_hours' => 8,
                'preparation_instructions' => 'No fasting required. Take medications as usual unless instructed otherwise.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Urinalysis',
                'description' => 'Urine test to detect urinary tract infections and kidney problems',
                'category' => 'Urology',
                'price' => 25.00,
                'sample_type' => 'Urine',
                'duration_hours' => 2,
                'preparation_instructions' => 'Collect midstream urine sample in provided container.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Chest X-Ray',
                'description' => 'Imaging test to examine the chest, lungs, and heart',
                'category' => 'Radiology',
                'price' => 120.00,
                'sample_type' => 'Imaging',
                'duration_hours' => 1,
                'preparation_instructions' => 'Remove jewelry and metal objects from chest area. Wear comfortable clothing.',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tests')->insert($tests);
        echo "✓ Seeded 5 tests\n";
    }

    private function seedDoctorReviews(): void
    {
        $reviews = [
            [
                'doctor_id' => 1,
                'patient_id' => 1,
                'rating' => 5,
                'comment' => 'Dr. Johnson is excellent! Very thorough and takes time to explain everything clearly. Highly recommend.',
                'is_approved' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 2,
                'patient_id' => 4,
                'rating' => 4,
                'comment' => 'Great pediatrician. My daughter feels comfortable with Dr. Chen and he\'s very patient with children.',
                'is_approved' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 3,
                'patient_id' => 2,
                'rating' => 5,
                'comment' => 'Dr. Rodriguez quickly diagnosed my skin condition and the treatment worked perfectly. Professional and knowledgeable.',
                'is_approved' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 4,
                'patient_id' => 5,
                'rating' => 3,
                'comment' => 'Good doctor but appointment was rushed. Treatment plan is working well though.',
                'is_approved' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 5,
                'patient_id' => 3,
                'rating' => 4,
                'comment' => 'Dr. Thompson was very thorough in her neurological examination. Waiting time was a bit long but worth it.',
                'is_approved' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('doctor_reviews')->insert($reviews);
        echo "✓ Seeded 5 doctor reviews\n";
    }

    private function seedBlogs(): void
    {
        $blogs = [
            [
                'doctor_id' => 1,
                'title' => 'Understanding Heart Health: Prevention is Key',
                'excerpt' => 'Learn about the importance of cardiovascular health and simple steps you can take to protect your heart.',
                'content' => 'Heart disease remains one of the leading causes of death worldwide, but many cases are preventable through lifestyle modifications. Regular exercise, a balanced diet rich in fruits and vegetables, maintaining a healthy weight, and avoiding smoking are fundamental steps in heart disease prevention. Regular check-ups and monitoring of blood pressure, cholesterol levels, and blood sugar are equally important. Early detection and management of risk factors can significantly reduce the likelihood of developing serious cardiovascular conditions.',
                'category' => 'Cardiology',
                'image' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center',
                'read_time' => '7 min read',
                'status' => 'published',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'doctor_id' => 2,
                'title' => 'Childhood Vaccination: Protecting Our Future',
                'excerpt' => 'A comprehensive guide to childhood vaccinations and their importance in preventing serious diseases.',
                'content' => 'Vaccines are one of the most effective tools we have to prevent serious diseases in children. The recommended vaccination schedule is designed to provide protection when children are most vulnerable to certain diseases. Common vaccines include those for measles, mumps, rubella, polio, and whooping cough. It\'s important for parents to understand that vaccines are thoroughly tested for safety and effectiveness before approval. Maintaining up-to-date vaccinations not only protects your child but also contributes to community immunity, protecting those who cannot be vaccinated due to medical conditions.',
                'category' => 'Pediatrics',
                'image' => 'https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1178',
                'read_time' => '6 min read',
                'status' => 'published',
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'doctor_id' => 3,
                'title' => 'Summer Skin Care: Protection and Prevention',
                'excerpt' => 'Essential tips for maintaining healthy skin during summer months and preventing sun damage.',
                'content' => 'Summer brings increased sun exposure, which can lead to various skin problems if proper precautions aren\'t taken. The most important step is using broad-spectrum sunscreen with at least SPF 30, applied generously and reapplied every two hours. Protective clothing, wide-brimmed hats, and seeking shade during peak sun hours (10 AM to 4 PM) are also crucial. Stay hydrated and moisturize regularly to maintain skin health. Be aware of changes in moles or new skin growths, and consult a dermatologist if you notice anything suspicious.',
                'category' => 'Dermatology',
                'image' => 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop&crop=center',
                'read_time' => '5 min read',
                'status' => 'published',
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'doctor_id' => 4,
                'title' => 'Joint Health: Keeping Active as You Age',
                'excerpt' => 'Learn how to maintain joint health and mobility throughout your life with proper care and exercise.',
                'content' => 'Joint health becomes increasingly important as we age, but there are many ways to maintain mobility and reduce the risk of arthritis and other joint problems. Regular low-impact exercise such as swimming, walking, and cycling helps maintain joint flexibility and strength. Maintaining a healthy weight reduces stress on weight-bearing joints. A diet rich in omega-3 fatty acids and antioxidants can help reduce inflammation. If you experience persistent joint pain or stiffness, early intervention with physical therapy or medical treatment can prevent further deterioration.',
                'category' => 'Orthopedics',
                'image' => 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
                'read_time' => '8 min read',
                'status' => 'published',
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'doctor_id' => 5,
                'title' => 'Managing Stress for Better Brain Health',
                'excerpt' => 'Discover the connection between stress management and neurological health, plus practical stress reduction techniques.',
                'content' => 'Chronic stress can have significant impacts on brain health, affecting memory, concentration, and overall cognitive function. The brain\'s stress response system, when constantly activated, can lead to inflammation and cellular damage. Effective stress management techniques include regular exercise, meditation, deep breathing exercises, and maintaining social connections. Adequate sleep is crucial for brain health and stress recovery. If stress becomes overwhelming or leads to persistent symptoms like headaches, memory problems, or mood changes, it\'s important to seek professional help.',
                'category' => 'Neurology',
                'image' => 'https://images.unsplash.com/photo-1752650735615-9829d8008a01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1331',
                'read_time' => '6 min read',
                'status' => 'published',
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(7),
            ],
        ];

        DB::table('blogs')->insert($blogs);
        echo "✓ Seeded 5 blogs\n";
    }

    private function seedGalleries(): void
    {
        $galleries = [
            [
                'doctor_id' => 1,
                'title' => 'Cardiac Catheterization Procedure',
                'description' => 'Educational video showing the cardiac catheterization procedure for diagnostic purposes',
                'url' => 'https://www.youtube.com/watch?v=OIQxrLraD4c',
                'type' => 'video',
                'category' => 'Procedures',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 2,
                'title' => 'Pediatric Examination Room',
                'description' => 'Child-friendly examination room designed to make young patients comfortable',
                'url' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
                'type' => 'image',
                'category' => 'Facilities',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 3,
                'title' => 'Dermatology Equipment',
                'description' => 'State-of-the-art dermatoscope used for detailed skin examination',
                'url' => 'https://images.unsplash.com/photo-1690306815613-f839b74af330?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
                'type' => 'image',
                'category' => 'Equipment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 4,
                'title' => 'Knee Replacement Surgery',
                'description' => 'Educational video demonstrating minimally invasive knee replacement technique',
                'url' => 'https://www.youtube.com/watch?v=CoGVoc4J94Y',
                'type' => 'video',
                'category' => 'Procedures',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 5,
                'title' => 'EEG Testing Facility',
                'description' => 'Modern EEG testing room for neurological diagnostics',
                'url' => 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop',
                'type' => 'image',
                'category' => 'Facilities',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 1,
                'title' => 'Modern Hospital Reception',
                'description' => 'Welcoming and modern hospital reception area',
                'url' => 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop',
                'type' => 'image',
                'category' => 'Facilities',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 2,
                'title' => 'Understanding Blood Pressure',
                'description' => 'Educational video about hypertension and blood pressure monitoring',
                'url' => 'https://www.youtube.com/watch?v=cuLH7SyWXFk',
                'type' => 'video',
                'category' => 'Education',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'doctor_id' => 3,
                'title' => 'Advanced Medical Equipment',
                'description' => 'State-of-the-art medical diagnostic equipment',
                'url' => 'https://images.unsplash.com/photo-1656189721573-51e3197e61b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=734',
                'type' => 'image',
                'category' => 'Equipment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('galleries')->insert($galleries);
        echo "✓ Seeded 8 galleries\n";
    }

    private function seedSubscriptions(): void
    {
        $subscriptions = [
            [
                'email' => 'newsletter.subscriber1@email.com',
                'status' => 'active',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ],
            [
                'email' => 'health.updates@email.com',
                'status' => 'active',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'email' => 'medical.news@email.com',
                'status' => 'inactive',
                'created_at' => Carbon::now()->subDays(60),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'email' => 'wellness.tips@email.com',
                'status' => 'active',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'email' => 'patient.portal@email.com',
                'status' => 'active',
                'created_at' => Carbon::now()->subDays(45),
                'updated_at' => Carbon::now()->subDays(45),
            ],
        ];

        DB::table('subscriptions')->insert($subscriptions);
        echo "✓ Seeded 5 subscriptions\n";
    }

    private function seedSchedules(): void
    {
        $schedules = [
            // Dr. Sarah Johnson (doctor_id: 1) - Cardiology
            ['doctor_id' => 1, 'day_of_week' => 'monday', 'start_time' => '09:00:00', 'end_time' => '17:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 1, 'day_of_week' => 'tuesday', 'start_time' => '09:00:00', 'end_time' => '17:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 1, 'day_of_week' => 'wednesday', 'start_time' => '09:00:00', 'end_time' => '17:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Dr. Michael Chen (doctor_id: 2) - Pediatrics
            ['doctor_id' => 2, 'day_of_week' => 'monday', 'start_time' => '08:00:00', 'end_time' => '16:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 2, 'day_of_week' => 'thursday', 'start_time' => '08:00:00', 'end_time' => '16:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 2, 'day_of_week' => 'friday', 'start_time' => '08:00:00', 'end_time' => '16:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Dr. Emily Rodriguez (doctor_id: 3) - Dermatology
            ['doctor_id' => 3, 'day_of_week' => 'tuesday', 'start_time' => '10:00:00', 'end_time' => '18:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 3, 'day_of_week' => 'wednesday', 'start_time' => '10:00:00', 'end_time' => '18:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 3, 'day_of_week' => 'saturday', 'start_time' => '09:00:00', 'end_time' => '13:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Dr. James Wilson (doctor_id: 4) - Orthopedics
            ['doctor_id' => 4, 'day_of_week' => 'monday', 'start_time' => '07:00:00', 'end_time' => '15:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 4, 'day_of_week' => 'wednesday', 'start_time' => '07:00:00', 'end_time' => '15:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 4, 'day_of_week' => 'friday', 'start_time' => '07:00:00', 'end_time' => '15:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Dr. Lisa Thompson (doctor_id: 5) - Neurology
            ['doctor_id' => 5, 'day_of_week' => 'tuesday', 'start_time' => '09:00:00', 'end_time' => '17:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 5, 'day_of_week' => 'thursday', 'start_time' => '09:00:00', 'end_time' => '17:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['doctor_id' => 5, 'day_of_week' => 'saturday', 'start_time' => '08:00:00', 'end_time' => '12:00:00', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('schedules')->insert($schedules);
        echo "✓ Seeded 15 schedules\n";
    }

    private function outputSummaryReport(): void
    {
        echo "\n" . str_repeat("=", 50) . "\n";
        echo "SEED DATA SUMMARY REPORT\n";
        echo str_repeat("=", 50) . "\n";

        $tables = [
            'doctors' => 'Doctors',
            'patients' => 'Patients', 
            'appointments' => 'Appointments',
            'cart_items' => 'Cart Items',
            'consultations' => 'Consultations',
            'medical_records' => 'Medical Records',
            'prescriptions' => 'Prescriptions',
            'messages' => 'Messages',
            'medicines' => 'Medicines',
            'tests' => 'Tests',
            'doctor_reviews' => 'Doctor Reviews',
            'blogs' => 'Blogs',
            'galleries' => 'Galleries',
            'subscriptions' => 'Subscriptions',
            'schedules' => 'Schedules'
        ];

        foreach ($tables as $table => $displayName) {
            $count = DB::table($table)->count();
            echo sprintf("%-20s: %d records\n", $displayName, $count);
        }

        echo str_repeat("-", 50) . "\n";
        echo "Total Tables Seeded: " . count($tables) . "\n";
        echo "Total Records Created: " . array_sum(array_map(fn($table) => DB::table($table)->count(), array_keys($tables))) . "\n";
        echo str_repeat("=", 50) . "\n";
        echo "✅ Database seeding completed successfully!\n";
    }
}