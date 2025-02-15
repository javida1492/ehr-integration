-- Enable the pgcrypto extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    insurance_provider TEXT NOT NULL,
    insurance_policy_number TEXT NOT NULL,
    primary_care_physician TEXT NOT NULL,
    allergies TEXT NOT NULL,
    current_medications TEXT NOT NULL,
    medical_history TEXT NOT NULL,
    social_history TEXT NOT NULL,
    family_history TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the ehr_mappings table
CREATE TABLE IF NOT EXISTS ehr_mappings (
    id SERIAL PRIMARY KEY,
    ehr_name TEXT NOT NULL UNIQUE,  -- "Athena", "Allscripts", etc.
    mapping JSONB NOT NULL,         -- JSON mapping of question fields
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the patient_answers table
CREATE TABLE IF NOT EXISTS patient_answers (
    id SERIAL PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    answer JSONB NOT NULL,
    ehr_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (patient_id, question_id)
);

-- Insert Athena Mapping
INSERT INTO ehr_mappings (ehr_name, mapping) VALUES 
('Athena', '{
    "patient": {
        "name": "PATIENT_IDENT_NAME",
        "gender": "GENDER_OF_PATIENT",
        "dob": "DATE_OF_BIRTH_PATIENT",
        "address": "PATIENT_LOCATION_ADDRESS",
        "phone": "TELEPHONE_NUMBER_PATIENT",
        "email": "PATIENT_EMAIL_ID",
        "emergencyContact": "EMERGENCY_CONTACT_PATIENT",
        "insuranceProvider": "INSURANCE_PROVIDER_PATIENT",
        "insurancePolicyNumber": "POLICY_NUMBER_INSURANCE_PATIENT",
        "primaryCarePhysician": "PRIMARY_CARE_DOCTOR_PATIENT",
        "allergies": "ALLERGIES_PATIENT",
        "currentMedications": "PATIENT_MEDICATIONS_CURRENT",
        "medicalHistory": "HISTORY_MEDICAL_PATIENT",
        "socialHistory": "HISTORY_SOCIAL_PATIENT",
        "familyHistory": "HISTORY_FAMILY_PATIENT"
    }
}')
ON CONFLICT (ehr_name) DO NOTHING;

-- Insert Allscripts Mapping
INSERT INTO ehr_mappings (ehr_name, mapping) VALUES 
('Allscripts', '{
    "patient": {
        "p_name": "NAME_OF_PAT",
        "p_gender": "GENDER_PAT",
        "p_dob": "BIRTHDATE_OF_PAT",
        "p_address": "ADDRESS_PAT",
        "p_phone": "PHONE_NUMBER_PAT",
        "p_email": "EMAIL_ID_PAT",
        "p_emergencyContact": "EMERGENCY_CONTACT_PAT",
        "p_insuranceProvider": "PROVIDER_INSURANCE_PAT",
        "p_insurancePolicyNumber": "POLICY_NUM_INSURANCE_PAT",
        "p_primaryCarePhysician": "PRIMARY_CARE_DOC_PAT",
        "p_medicalHistory": "HISTORY_MEDICAL_PAT",
        "p_allergies": "ALLERGIES_PAT",
        "p_currentMedications": "CURRENT_MEDS_PAT",
        "p_socialHistory": "SOCIAL_HISTORY_PAT",
        "p_familyHistory": "FAMILY_HISTORY_PAT"
    }
}')
ON CONFLICT (ehr_name) DO NOTHING;

-- Insert a test patient into the patients table
INSERT INTO patients (
    name,
    gender,
    dob,
    address,
    phone,
    email,
    emergency_contact,
    insurance_provider,
    insurance_policy_number,
    primary_care_physician,
    allergies,
    current_medications,
    medical_history,
    social_history,
    family_history
)
VALUES (
    'Test Patient',
    'Female',
    '2000-01-01',
    '123 Test Street',
    '555-0000',
    'testpatient@example.com',
    'Emergency Contact Name',
    'Test Insurance',
    'T123456789',
    'Dr. Test',
    'None',
    'None',
    'None',
    'None',
    'None'
);