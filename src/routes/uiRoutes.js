// src/routes/uiRoutes.js

const express = require("express");
const router = express.Router();
const { isAuthenticated, redirectIfLoggedIn } = require("../middleware");
const User = require("../domains/user/model");
const { getAvatarColor } = require('../utils/avatar');

// Serve Home Page
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
  });
  
// Serve Signup Page
router.get("/signup", redirectIfLoggedIn, (req, res) => {
    res.render("signup", { title: "Sign Up" });
});

// Serve Login Page
router.get("/login", redirectIfLoggedIn, (req, res) => {
    res.render("login", { title: "Log In" });
});

// Serve Chat Page
router.get("/chat", isAuthenticated, (req, res) => {
    res.render("chat", { title: "Chat" });
});

// Serve profile Page (protected route)
// router.get("/profile", isAuthenticated, async (req, res) => {
//     try {
//         const userId = req.session.userId;
//         const user = await User.findById(userId);  // Assuming you have a User model

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.render("profile", { user, title: "Profile" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//     }
// });

router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);  // Assuming you have a User model

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the avatar color based on the first letter of the username
        const avatarColor = getAvatarColor(user.userName);

        res.render("profile", { user, avatarColor, title: "Profile" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Serve Settings Page
router.get("/settings", isAuthenticated, (req, res) => {
    res.render("settings", { title: "Settings" });
});

// Serve Yu Page
router.get("/yu", (req, res) => {
    const roadmapSections = [
        {
            title: "1. Project Setup & Initial Decisions (Week 1)",
            goal: "Establish core architecture and tech stack.",
            tasks: [
                "Choose frontend framework.",
                "Select backend programming language.",
                "Choose database type.",
                "Select deployment platform.",
                "Choose test suite.",
                "Select auth tools.",
                "Choose rate limiter tool.",
                "Select CDN provider.",
                "Choose real-time connection tool.",
                "Select framework for mobile app.",
                "Choose End-to-End (E2E) Testing Framework.",
                "Select Monitoring & Analytics tools.",
                "Choose environment management tool.",
                "Select version control tool."
            ],
            actions: [
                "Initialize repository for version control.",
                "Set up project structure for both frontend and backend.",
                "Use environment management tool.",
                "Set up CI/CD pipeline."
            ],
            timeframe: "1 week"
        },
        {
            title: "2. Frontend Development (Weeks 2-4)",
            goal: "Develop the user interface (UI) and ensure user experience (UX).",
            tasks: [
                "Set up UI framework.",
                "Integrate styling.",
                "Implement state management.",
                "Configure frontend build tools if needed.",
                "Implement frontend routing."
            ],
            actions: [
                "Develop the basic UI components: forms, buttons, navigation.",
                "Set up responsive design for various devices.",
                "Start basic pages like login, registration, home, and settings."
            ],
            testing: [
                "Use test suite for initial unit tests on UI components."
            ],
            timeframe: "2-3 weeks"
        },
        {
            title: "3. Backend Development (Weeks 3-5)",
            goal: "Set up the core server-side logic and database.",
            tasks: [
                "Set up backend framework.",
                "Create REST APIs (for basic CRUD operations) or WebSocket for real-time features.",
                "Integrate database.",
                "Implement authentication.",
                "Implement rate limiting."
            ],
            actions: [
                "Design initial user schema for authentication.",
                "Set up API endpoints (for user management, settings, etc.).",
                "Implement authentication for user login."
            ],
            testing: [
                "Unit test APIs."
            ],
            timeframe: "2-3 weeks"
        },
        {
            title: "4. Storage & File Management (Week 5)",
            goal: "Set up storage for static files and user-uploaded content.",
            tasks: [
                "Integrate AWS S3/Google Cloud Storage for file uploads.",
                "Set up CDN for image and video delivery."
            ],
            actions: [
                "Ensure upload limits are set for files.",
                "Configure CDN for faster delivery."
            ],
            timeframe: "1 week"
        },
        {
            title: "5. Real-Time Features (Week 6)",
            goal: "Enable real-time interactions within the app.",
            tasks: [
                "Integrate real-time connections for live chat or notifications.",
                "Set up event-driven architecture for real-time communication (optional)."
            ],
            actions: [
                "Test real-time message flow between users.",
                "Ensure performance of real-time connections under load."
            ],
            timeframe: "1 week "
        },
        {
            title: "6. Mobile App (Week 7)",
            goal: "Set up mobile access.",
            tasks: [
                "Use the chosen framework for mobile support."
            ],
            actions: [
                "Implement mobile app features (offline support, home screen installation).",
                "Ensure responsive design works well on mobile."
            ],
            timeframe: "1 week"
        },
        {
            title: "7. Testing & Quality Assurance (Week 6-8)",
            goal: "Ensure the app is stable, functional, and ready for deployment.",
            tasks: [
                "Perform unit tests for both frontend and backend.",
                "Conduct integration tests for API workflows.",
                "Set up end-to-end testing for critical flows.",
                "Test real-time features for message delay, reconnection behavior, etc."
            ],
            actions: [
                "Identify and fix bugs found during testing.",
                "Ensure code quality (ESLint, Prettier integration)."
            ],
            timeframe: "1-2 weeks"
        },
        {
            title: "8. Monitoring & Analytics Setup (Week 7-8)",
            goal: "Set up monitoring and user analytics.",
            tasks: [
                "Integrate analytics for user tracking.",
                "Set up error tracking.",
                "Implement performance monitoring."
            ],
            actions: [
                "Ensure that errors and performance issues are tracked.",
                "Set up alerts for critical errors or slow performance."
            ],
            timeframe: "1 week"
        },
        {
            title: "9. Deployment & MVP Launch (Week 8)",
            goal: "Deploy the app and deliver the MVP.",
            tasks: [
                "Deploy backend (Railway or AWS).",
                "Deploy frontend (Netlify, or Railway).",
                "Ensure both environments are correctly configured for production."
            ],
            actions: [
                "Monitor app performance post-launch.",
                "Begin collecting user feedback for further iterations."
            ],
            timeframe: "1 week"
        }
    ];

    res.render("yu", { title: "Yu", roadmapSections });
});

// Handle Logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).send("An error occurred during logout.");
        }
        res.redirect("/login");
    });
});

module.exports = router;
