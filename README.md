========================================================================
             PATHWISE: AI-PREDICTIVE NAVIGATION SYSTEM
========================================================================
Registration Number: [Insert Your Registration Number Here]
Artefact Submission Folder: [Your Registration Number]-Artefact
Submission Date: August 28, 2026
University: University of Bedfordshire
Course: BSc (Hons) Computer Science / Information Technology
Project Supervisor: Mr. Anuruddha Abeysinghe
========================================================================

------------------------------------------------------------------------
1. PROJECT OVERVIEW
------------------------------------------------------------------------
PathWise is a proactive, predictive navigation platform designed to 
mitigate the compounding ecological, cultural, and structural hazards 
of overtourism. Unlike traditional navigation engines (such as Google 
Maps) which only display congestion reactively (after overcrowding has 
already occurred), PathWise leverages a deep learning Long Short-Term 
Memory (LSTM) network to forecast visitor density 2 to 4 hours in advance. 

Using these predictive logs, the Node.js Behavioral Nudge Engine triggers 
personalized, non-coercive alternative routing detour suggestions ("nudges") 
and points-based local merchant rewards via a responsive React-based 
mobile dashboard. This shifts visitor flow away from critical bottlenecks 
(such as Sigiriya's 1,200 spiral steps or Yala's jeep-congested safaris) 
before overcrowding occurs.

------------------------------------------------------------------------
2. ARTEFACT SUBMISSION FOLDER STRUCTURE
------------------------------------------------------------------------
Ensure your submission zip file is named "[Your Registration Number]-Artefact.zip"
and contains the following directory layout:

[Your Registration Number]-Artefact/
│
├── README.txt                      <-- This documentation file
├── Assignment_2_Topsheet.pdf       <-- Your signed official university topsheet
├── User_Manual.pdf                 <-- Visual guide detailing mobile and admin UI
├── Poster_A1.pdf                   <-- High-resolution print-ready project poster
│
├── source_code/                    <-- Parent directory for all active codebase
│   │
│   ├── mobile_frontend/            <-- React.js Mobile User Application
│   │   ├── package.json
│   │   ├── src/
│   │   └── public/
│   │
│   ├── api_backend/                <-- Node.js & Express REST API Gateway
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── config/ (MongoDB Atlas configuration keys)
│   │   ├── models/ (NoSQL collection schemas)
│   │   └── routes/ (API Endpoints & Behavioral Nudge Engine)
│   │
│   └── ai_prediction_engine/       <-- Python TensorFlow LSTM Environment
│       ├── lstm_forecaster.py      <-- Deep learning model configuration
│       ├── train_lstm.py           <-- Model training loop & validation
│       ├── requirements.txt        <-- Python environment dependencies
│       └── datasets/
│           └── sri_lanka_crowd_logs.csv <-- Simulated historical crowd datasets
│
└── test_videos/                    <-- Verification screen recordings (Optional)
    ├── Mobile_User_Demo.mp4
    └── Admin_Console_Demo.mp4

------------------------------------------------------------------------
3. GOOGLE DRIVE BACKUP LINK (IF SUBMISSION EXCEEDS 600MB)
------------------------------------------------------------------------
In compliance with the Breo 600MB limit: If your source code, models, 
libraries, or high-resolution assets exceed this limit, the complete 
artefact has been uploaded to the shareable folder below:

GOOGLE DRIVE SECURE LINK:
--> [INSERT YOUR GOOGLE DRIVE OR ONEDRIVE DIRECT LINK HERE]
    (Ensure link access is set to: "Anyone with the link can view/download")

------------------------------------------------------------------------
4. PREREQUISITES & SYSTEM REQUIREMENTS
------------------------------------------------------------------------
To successfully configure, execute, and verify the PathWise ecosystem, 
the host machine must have the following developer runtimes installed:

A. Runtime Environments:
   - Node.js (v18.x or higher) & npm (v9.x or higher)
   - Python (v3.10.x or v3.12.x)

B. Cloud Databases:
   - MongoDB Atlas Account (Cloud NoSQL database instance)
   - Active Internet Connection (for live weather API fetching and cloud DB synchronization)

C. Primary Python Libraries:
   - TensorFlow (v2.12.0 or higher) / Keras
   - NumPy & Pandas (Data processing)
   - Scikit-Learn (Data preprocessing, MinMaxScaler)

------------------------------------------------------------------------
5. SYSTEM INSTALLATION & SETUP GUIDE
------------------------------------------------------------------------

STEP 1: DATABASE SETUP (MONGODB ATLAS)
  1. Log into your MongoDB Atlas console and create a new cluster.
  2. Create a database named "pathwise".
  3. Create four essential collections inside your cluster:
     - `locations` (Stores Sri Lankan tourist site records)
     - `historical_data` (Stores hourly crowd counts and weather logs)
     - `user_incentives` (Tracks redeemed badges and local coupons)
  4. Generate a database connection string (URI) and ensure your local 
     IP address is whitelisted in the Atlas Network Access panel.

STEP 2: CONFIGURING THE NODE.JS REST API BACKEND
  1. Open your terminal and navigate to the backend folder:
     $ cd source_code/api_backend
  2. Install all necessary dependencies:
     $ npm install
  3. Create an environment configuration file named `.env` in the root 
     of `api_backend/` and populate it with your environment keys:
     --------------------------------------------------
     PORT=5000
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pathwise?retryWrites=true&w=majority
     OPENWEATHER_API_KEY=your_openweathermap_api_key_here
     GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
     --------------------------------------------------

STEP 3: CONFIGURING THE REACT MOBILE FRONTEND
  1. Open a new terminal window and navigate to the frontend folder:
     $ cd source_code/mobile_frontend
  2. Install the responsive UI package dependencies:
     $ npm install
  3. Configure your API base URL inside the frontend React configuration:
     Create a `.env` file inside `mobile_frontend/` and add:
     --------------------------------------------------
     REACT_APP_API_URL=http://localhost:5000
     --------------------------------------------------

STEP 4: CONFIGURING THE AI PREDICTION ENVIRONMENT (PYTHON)
  1. Open a terminal and navigate to the AI microservice engine:
     $ cd source_code/ai_prediction_engine
  2. Create a local Python virtual environment (recommended):
     $ python -m venv venv
     $ source venv/bin/activate  # On Windows use: venv\Scripts\activate
  3. Install TensorFlow, NumPy, and Pandas:
     $ pip install -r requirements.txt

------------------------------------------------------------------------
6. EXECUTION RUN GUIDE
------------------------------------------------------------------------

PHASE A: INITIALIZING THE DEEP LEARNING LSTM MODEL
  1. Ensure your simulated historical dataset (CSV) is in `datasets/`.
  2. Run the model training script to compile, train, and save the 
     optimal LSTM model parameters:
     $ python train_lstm.py
  3. Verify that the trained parameters are successfully exported as 
     `pathwise_lstm_model.h5` (or `.keras`) and that the validation 
     Mean Absolute Error (MAE) settles below your target threshold.

PHASE B: LAUNCHING THE BACKEND API & NUDGE ENGINE
  1. Go back to your backend directory:
     $ cd source_code/api_backend
  2. Start the Express server:
     $ npm run dev  # Or: node server.js
  3. Verify that the console prints:
     "Server running on port 5000"
     "MongoDB Atlas database connection established successfully."

PHASE C: BOOTING UP THE MOBILE APPLICATION UI
  1. Go to your frontend directory:
     $ cd source_code/mobile_frontend
  2. Launch the local development web server:
     $ npm start
  3. Your browser should automatically open the mobile interface at:
     http://localhost:3000
  4. Toggle the user mock location selector to select Sigiriya, Ella Nine Arch, 
     or Bentota Beach and verify that the system successfully returns 
     predictive visitor density curves and proactive routing detour nudges.

------------------------------------------------------------------------
7. VERIFICATION AND TESTING PROCEDURES
------------------------------------------------------------------------
To verify the system integration is executing correctly, perform these 
five distinct functional test checks:

1. Data Integration Test:
   Verify that selecting a location on the React UI sends an HTTP GET 
   request to `/api/locations/:id` and that the backend responds 
   with correct metadata and weather information within 1.5 seconds.

2. LSTM Microservice Prediction Test:
   Ensure that hitting `/api/predictions/forecast` invokes your Python 
   prediction wrapper, passes the target site's weather array, and 
   returns a 4-hour temporal crowd density forecast in JSON format.

3. Behavioral Nudge Logic Test:
   Simulate a crowd surge (>90% capacity) at Sigiriya by manually 
   injecting high predicted values. Confirm that the React mobile app 
   instantly renders a bright red detour warning ("PathWise Proactive 
   Nudge") suggestively pointing toward Pidurangala Rock instead.

4. Reward & Coupon Redemption Test:
   Click "Accept Detour" inside the mobile UI. Verify that your local 
   user incentive wallet updates in MongoDB Atlas and generates a 
   one-time merchant discount coupon code for use at local cafes.

5. API Response Integrity Test:
   Verify that all backend Express API routes return standard, structured 
   HTTP responses with correct CORS headers and valid JSON serialization.

------------------------------------------------------------------------
8. TROUBLESHOOTING & COMMON ERROR RESOLUTION
------------------------------------------------------------------------
- ISSUE: MongoDB connection timeout error on server startup.
  REMEDY: Double-check your database credentials in the `.env` file 
  and ensure your local machine's IP address is added to the 0.0.0.0/0 
  Network Access list in MongoDB Atlas.

- ISSUE: Python script crashes with `ModuleNotFoundError` for tensorflow.
  REMEDY: Verify your local virtual environment is active before running 
  `pip install`. On macOS M1/M2/M3 chips, ensure you install the metal-accelerated 
  packages via Apple's TensorFlow instructions.

- ISSUE: React app throws a network error when calling backend endpoints.
  REMEDY: Ensure your backend server is actively running on port 5000 
  and that CORS (Cross-Origin Resource Sharing) middleware is enabled 
  in your backend Express app (`server.js`).

========================================================================
     FOR TECHNICAL ASSISTANCE, REACH OUT TO YOUR ASSIGNED DEVELOPER
========================================================================
