## Build Instructions

### Step 1: Install & Run docker

To run the application, you need to have docker installed on your machine as the PSQL db is running in a dockerized container.

Once you've installed and started up docker, you start up the PSQL container by running `docker-compose up -d` in the `/backend` folder. This will initialize the PSQL database by running the `init.sql` file.

The `init.sql` file sets up the minimum information needed to test out the application. It creates 2 example EHR mappings as well as a patient.

### Step 2: Start up backend server

Since this is a zip folder, you won't need to install any package dependencies as they are already included. You should be able to start up the server by running `npm run dev`, which launches the server on port 5000 in dev mode, e.g. with nodemon so it can refresh as needed.

### Step 3: Start up frontend

Like the backend, the frontend should already have all the required dependencies installed so all you need to do is navigate to `/frontend` and run `npm run dev`. This will start up the vite-react project on `http://localhost:5173/`.

## Testing

### Server

I've provided unit tests for all of the API endpoints. To run these tests, use the command `npm test` in the `/backend` folder which will run the full test suite. Otherwise, to test a specific file, you can run `npm test -- backend/tests/<entity>/<testname>.test.js`, for example, `npm test -- backend/tests/patient/getPatient.test.js`

To additionally test these APIs, you can use Postman to submit custom requests to these API endpoints.

### Frontend

Due to time constraints, I was not able to write unit/component tests for the frontend, however, I do have error handling and logging in much of the code.

Given more time, I would try to include unit tests to test the helper methods on the frontend.

## Application Architecture

The application is a monolithic structure with the frontend being a Vite-React project and the backend being a Node.js application along with Docker and PostgreSQL.

### Backend

The backend consists of the following main routes:

- `/api/patients`: Handles CRUD operations and additional endpoints for patient data.
- `/api/ehr`: Manages Electronic Health Records (EHR) related operations.
- `/api/ehr-mappings`: Manages mappings between different EHR systems.

#### API Endpoints

- **Patients**

  - `POST /api/patients`: Create a new patient.
  - `GET /api/patients/:patient_id`: Retrieve a specific patient by ID.
  - `GET /api/patients`: Retrieve all patients.
  - `PUT /api/patients/:patient_id`: Update a specific patient by ID.
  - `DELETE /api/patients/:patient_id`: Delete a specific patient by ID.
  - `POST /api/patients/bulk-update`: Bulk update patients.
  - `POST /api/patients/:patient_id/answers`: Submit answers for a patient.
  - `GET /api/patients/:patient_id/answers`: Retrieve answers for a patient.

- **EHR**

  - `POST /api/ehr`: Create a new EHR entry.
  - `GET /api/ehr/:ehr_id`: Retrieve a specific EHR entry by ID.
  - `GET /api/ehr`: Retrieve all EHR entries.
  - `PUT /api/ehr/:ehr_id`: Update a specific EHR entry by ID.
  - `DELETE /api/ehr/:ehr_id`: Delete a specific EHR entry by ID.

- **EHR Mappings**
  - `POST /api/ehr-mappings`: Create a new EHR mapping.
  - `GET /api/ehr-mappings/:ehr_name`: Retrieve a specific EHR mapping by ID.
  - `GET /api/ehr-mappings`: Retrieve all EHR mappings.
  - `PUT /api/ehr-mappings/:ehr_name`: Update a specific EHR mapping by ID.
  - `DELETE /api/ehr-mappings/:ehr_name`: Delete a specific EHR mapping by ID.

### Frontend

The frontend is a Vite-React project structured with the following main components and routes:

#### Components

- **BulkPatientChanges**: Update bulk patient data based on the patient's insurance provider
- **EHRMappingList**: Displays a list of EHR mappings.
- **EHRMappingForm**: Shows detailed information for a specific EHR mapping.

Due to time constraints and scope, I was not able to build a frontend feature to add/remove patients, but you can do this via postman requests or by logging into the PSQL instance in the docker server and creating new patients there. I recommend postman for the simplicity.

Viewing all EHR Mappings are done at `http://localhost:5173/mappings`. This view will display a list of all of the EHR Mappings and let a user edit/delete a mapping. Likewise, a user can create a new mapping at the top.

There are 2 other navigation links, `Bulk Patient Changes` and `Override Mapping`.

For `Bulk Patient Changes`, you can filter all users by the insurance provider and apply bulk changes to them via a JSON object.

The `Override Mapping` functionality is very similar except you can filter by a patient's uuid and submit an ehr mapping override specific to that user.

If given more time, I would have cleaned up the UI to include more functionality as far as user management and EHR management, mainly around the form and input components and how the fields are displayed.

## Assumptions and Clarifications

The problem statement was sort of vague and to be honest is something that I would have spent time on call with a PM to fully clarify my understanding and use case. With that being said, the assumptions I made are that the system can have Patients and that the patients will have submitted data through a particular EHR system. The answers "should" be submitted to the `patients_answers` table but due to time constraints, I was not able to finish this work.

Secondly, the structure of the EHR mappings was abit unclear. It seems like the idea is that these mappings can exist as any type of JSON object with any number of fields, e.g, and that we are trying to "normalize" a patient's data based on the EHR system they are submitting it to. The EHR Controller will take the submitted answers and try to normalize them based on either the patient's overrides else map to the direct EHR mapping.

Likewise, regarding the API endpoints for the EHR question and answer submissions, the problem statement seems like an inefficient way of modeling this. I would think that we would want to normalize the questions coming from the EHR mappings per patient rather than trying to have multiple endpoints for each question per EHR system. This seems like a lot of engineering overhead to maintain this reverse api relationship for data normalization. But this could also be a lack of understanding of the problem statement which again I would have spent time in a real world scenario with a PM to fully understand the requirements and given the nature of the take home and email communication, is not an effective method of communication for this.

Lastly, the evaluation portion seems severly out of scope for a take home. Technically, PSQL can support up to 10 million concurrent active users and with proper infrastructure, sharding, partitioning, and indexing, is more than sufficient to handle high TPS/QPS loads.

As far as fault tolerance, service uptime, etc.. again this seems to be out of scope for the nature of this take home. This is usually a full system design that takes multiple engineers to build or a single engineer days or weeks to build. It contains aspects considered in a fully deployed application with multiple services, e.g. AWS, GCP and additional tooling like Apache Kafka + Flink/Spark to handle large batch data processing, which for a system like this, would be very good.
