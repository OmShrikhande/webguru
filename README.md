# 🙄 WebGuru App+Web: Yet Another Web Project

![Eye Roll](https://media.giphy.com/media/3oKHWzO5RzZUXUBQ6Q/giphy.gif)

## 🤦‍♂️ What is this monstrosity?

Oh great, *another* web application that promises to revolutionize... something. This magnificent pile of code consists of an Admin panel (because everyone loves admin panels) and a Master application (because "Master" sounds important). 

Contact the genius behind this masterpiece: [omshrikhande73@gmail.com](mailto:omshrikhande73@gmail.com)

## 🔥 Project Structure (Try not to get lost)

```
webguru app+web/
├── Admin/                # Admin stuff (shocking, I know)
│   ├── Backend/          # Where all the server magic happens
│   └── frontend/         # Pretty buttons and forms for admins
└── webgMaster/           # The "Master" application (ooooh fancy)
```

## 💩 Setup Instructions (Good luck with this)

![Setup Nightmare](https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif)

### 1. Prerequisites (Things you should already have but probably don't)

- Node.js (latest version, because why use stable versions?)
- MongoDB (because SQL databases are so last decade)
- XAMPP (yes, we're still using this in 2024)
- Patience (you'll need lots of it)

### 2. Backend Setup (Admin)

```bash
# Navigate to the backend folder (if you can find it)
cd "c:/xampp/htdocs/webguru app+web/Admin/Backend"

# Install dependencies (grab a coffee, this might take a while)
npm install

# Create a .env file with these variables (because security is an afterthought)
echo "MONGO_URI=mongodb://localhost:27017/webguru
PORT=5000
JWT_SECRET=somesupersecretkeythatyoushouldchange
API_BASE_URL=http://localhost" > .env

# Start the server (and pray it works)
npm run dev
```

### 3. Frontend Setup (Admin)

```bash
# Navigate to the admin frontend folder
cd "c:/xampp/htdocs/webguru app+web/Admin/frontend"

# Install dependencies (maybe grab another coffee)
npm install

# Start the development server (fingers crossed)
npm start
```

### 4. Master Application Setup

```bash
# Navigate to the webgMaster folder
cd "c:/xampp/htdocs/webguru app+web/webgMaster"

# Install dependencies (third coffee recommended)
npm install

# Start the development server
npm run dev
```

## 🤡 Admin Frontend Features

![Clown](https://media.giphy.com/media/x0npYExCGOZeo/giphy.gif)

The Admin frontend is a React application built with:

- React 19 (because we love living on the bleeding edge)
- React Router v7 (for navigating through the labyrinth of admin pages)
- Tailwind CSS (because writing custom CSS is too mainstream)
- Axios (for making API calls that may or may not work)
- React Toastify (to notify users when something inevitably breaks)
- Leaflet (for maps that nobody will use)
- Framer Motion (for fancy animations to distract from bugs)
- Firebase (because one database wasn't complicated enough)

### Key Features:
- Dashboard with fancy charts that executives will pretend to understand
- User management (add/edit/delete/forget users exist)
- Attendance tracking (to catch employees slacking off)
- Location tracking (because privacy is overrated)
- Authentication (that will lock you out at the worst possible moment)

## 🧙‍♂️ Master Frontend Features

![Wizard](https://media.giphy.com/media/3o84U6421OOWegpQhq/giphy.gif)

The Master application is built with:

- React 19 (same bleeding edge, different application)
- Vite (because webpack was too reliable)
- Material UI v7 (for that corporate look everyone pretends to like)
- Chart.js (more charts that nobody reads)
- Recharts (in case one charting library wasn't enough)
- Leaflet (more maps!)
- Framer Motion (more animations!)
- Firebase (more databases!)

### Key Features:
- Even more dashboards with even fancier charts
- Master data management (whatever that means)
- Probably some other features that weren't documented

## 🔧 Admin Backend

![Broken Tools](https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif)

The backend is an Express.js application with:

- Express (for routing that will confuse you)
- Mongoose (for MongoDB interactions that will frustrate you)
- JWT authentication (that will expire when you least expect it)
- Bcrypt (for hashing passwords and developer dreams)
- Multer (for file uploads that will mysteriously disappear)
- Nodemailer (for emails that will end up in spam)

### API Endpoints:
- `/api/admin` - Admin user management
- `/api/master` - Master data operations
- `/api/dashboard` - Dashboard data
- `/api` - Various other endpoints scattered about

## 🚨 Troubleshooting

![Fire](https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif)

1. **Nothing works?** Have you tried turning it off and on again?
2. **MongoDB won't connect?** Check if MongoDB is actually running (it probably isn't)
3. **NPM install fails?** Clear cache, delete node_modules, sacrifice a goat, try again
4. **Frontend shows blank page?** Check console for the 47 errors waiting for you
5. **Backend crashes?** That's normal behavior, just restart it
6. **Still having issues?** Contact [omshrikhande73@gmail.com](mailto:omshrikhande73@gmail.com) and wait patiently for a response that may never come

## 📜 License

This project is licensed under the "Good Luck With That" License.

---

*This README was written by someone who clearly had enough of writing documentation. If you've read this far, congratulations, you're as masochistic as the developer who created this project.*