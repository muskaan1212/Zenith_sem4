# Zenith Healthcare - Complete JavaScript Implementation

A fully functional healthcare management system with dynamic dashboard, reminders, consultations, and live notifications.

## Project Structure

\`\`\`
zenith-healthcare/
├── index.html              # Landing page
├── login.html              # Login page
├── dashboard.html          # Patient dashboard
├── thank-you.html          # Appointment confirmation
├── style.css               # Main styles (green/gold theme)
├── dashboard.css           # Dashboard-specific styles
├── api-client.js           # Fetch API integration
├── form-validation.js      # Form validation module
├── theme-switcher.js       # Dark/light mode toggle
├── dashboard.js            # Dashboard functionality
├── notifications.js        # Notification manager
├── login.js                # Login authentication
├── db.json                 # JSON Server mock database
└── README.md               # This file
\`\`\`

## Features Implemented

### 1. Dynamic Dashboard
- Welcome section with user greeting
- Stats cards showing appointments, reminders, consultations, and health score
- Real-time DOM manipulation for all interactive elements
- Responsive grid layout

### 2. Reminders Management (CRUD Operations)
- **Create**: Add new reminders with title, time, and description
- **Read**: Display all reminders in a list
- **Update**: Edit existing reminders
- **Delete**: Remove reminders with confirmation
- Form validation before submission
- Visual feedback with toast notifications

### 3. Fetch API Integration
- RESTful API client for JSON Server communication
- GET, POST, PUT, DELETE methods
- Error handling and fallback to mock data
- Automatic retry logic

### 4. Form Validation
- Email format validation
- Required field validation
- Minimum length validation
- Time format validation (HH:MM)
- Real-time error messages

### 5. AJAX (XMLHttpRequest) Demo
- Alternative data fetching using XHR
- Status display (loading, success, error)
- Network error handling
- Response time tracking

### 6. Live Notifications
- Auto-display reminders every 30 seconds
- Notification queue management
- Auto-removal after 10 seconds
- Multiple notification types (success, warning, error)
- Clear all notifications button

### 7. Theme Switcher
- Toggle between light and dark modes
- localStorage persistence
- CSS variables for theme colors
- Smooth transitions

### 8. Authentication
- Login form with validation
- User data storage in localStorage
- Session management
- Logout functionality

## Getting Started

### Prerequisites
- Node.js and npm installed
- JSON Server for mock backend

### Installation

1. **Install JSON Server globally:**
   \`\`\`bash
   npm install -g json-server
   \`\`\`

2. **Start JSON Server:**
   \`\`\`bash
   json-server --watch db.json --port 3001
   \`\`\`

3. **Open the application:**
   - Open `index.html` in your browser
   - Navigate to login page
   - Use any email/password to login (demo mode)
   - Access the dashboard

### Default Login Credentials (Demo)
- Email: any valid email format (e.g., `user@example.com`)
- Password: any password (minimum 6 characters)

## Usage Guide

### Adding a Reminder
1. Click "+ Add Reminder" button
2. Fill in the reminder details:
   - Title: Name of the reminder
   - Time: Time in HH:MM format
   - Description: Optional details
3. Click "Save Reminder"
4. Reminder appears in the list

### Managing Reminders
- **Mark Complete**: Click "Mark Complete" to toggle completion status
- **Edit**: Click "Edit" to modify a reminder
- **Delete**: Click "Delete" to remove a reminder

### Syncing Data (AJAX Demo)
1. Click "Sync Data" button in the AJAX Demo section
2. Data is fetched using XMLHttpRequest
3. Status message shows success or error
4. Notification appears in the Live Notifications section

### Switching Themes
1. Click the theme toggle button (🌙/☀️) in the header
2. Theme preference is saved to localStorage
3. Theme persists across page reloads

### Logging Out
1. Click "Logout" button in the header
2. Confirm logout
3. Redirected to login page
4. Session data is cleared

## API Endpoints

When JSON Server is running on port 3001:

\`\`\`
GET    /api/reminders           # Get all reminders
POST   /api/reminders           # Create reminder
PUT    /api/reminders/:id       # Update reminder
DELETE /api/reminders/:id       # Delete reminder

GET    /api/consultations       # Get all consultations
POST   /api/consultations       # Create consultation

GET    /api/users/:id           # Get user info
PUT    /api/users/:id           # Update user info
\`\`\`

## JavaScript Modules

### api-client.js
- `APIClient` class for HTTP requests
- Methods: `get()`, `post()`, `put()`, `delete()`
- Specific methods for reminders, consultations, users

### form-validation.js
- `FormValidator` class for form validation
- Methods: `validateEmail()`, `validateRequired()`, `validateTime()`
- Form-specific validators: `validateReminderForm()`, `validateLoginForm()`

### theme-switcher.js
- `ThemeSwitcher` class for theme management
- Methods: `enableDarkMode()`, `enableLightMode()`, `toggleTheme()`
- localStorage integration for persistence

### dashboard.js
- `Dashboard` class for main dashboard functionality
- CRUD operations for reminders
- Stats management and updates
- Live notification system
- XHR demo functionality

### notifications.js
- `NotificationManager` class for notification handling
- Methods: `addNotification()`, `removeNotification()`, `clearAll()`
- Auto-removal with configurable duration

### login.js
- `LoginManager` class for authentication
- Form validation and submission
- User data storage
- Redirect to dashboard

## Styling

### Color Scheme
- **Primary**: #2c5530 (Green)
- **Primary Light**: #4a7c59
- **Accent**: #c9a96e (Gold)
- **Accent Light**: #d4b77a

### Dark Mode
- Automatically adjusts all colors
- Maintains contrast and readability
- Smooth transitions

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 480px
- Flexible grid layouts
- Touch-friendly buttons

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### JSON Server Not Running
- Error: "Network error - Make sure JSON Server is running"
- Solution: Run `json-server --watch db.json --port 3001`

### Data Not Syncing
- Check browser console for errors
- Verify JSON Server is running on port 3001
- Check db.json file format

### Theme Not Persisting
- Clear browser localStorage
- Check if localStorage is enabled
- Try a different browser

### Login Not Working
- Ensure password is at least 6 characters
- Check email format is valid
- Clear localStorage and try again

## Future Enhancements
- Real backend API integration
- User authentication with JWT
- Database persistence
- Email notifications
- Appointment scheduling
- Medical records management
- Doctor availability calendar
- Payment integration

## License
MIT License - Feel free to use this project for learning and development.

## Support
For issues or questions, please refer to the inline code comments or check the browser console for error messages.
