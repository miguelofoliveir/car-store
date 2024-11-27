CarStore
CarStore is a comprehensive management system for products, orders, clients, user roles, and stock. It streamlines the process of managing a store by offering features tailored for administrators, sellers, and clients.

🌟 About the Project
This system is designed to provide an intuitive interface and role-based navigation, allowing users to efficiently manage their operations. Whether it's updating stock levels, tracking orders, or managing clients, CarStore ensures a smooth workflow.

Technologies Used
Framework: Angular 16.2.16
Styling: TailwindCSS and Angular Material
Charts: ngx-charts
Mock API: JSON Server
Programming Languages: TypeScript, HTML, SCSS
🚀 Key Features
Authentication
Role-based access for Admin, Seller, and Client.
Validation of credentials via a mock backend.
Products (Catalog)
List Products: Filters by name, brand, price, and category.
CRUD Operations: Add, edit, delete, and view product details.
Stock
Manage product quantities with real-time updates.
Alerts for low-stock items.
Orders
Filter orders by client, status, or date.
Manage orders with options to create, view, and update statuses.
Clients
Accessible to Admin and Sellers for managing client information.
User Management
Admin-exclusive feature for managing users and roles.
Dashboard
Displays key metrics and charts for an overview of system activity.
⚙️ How to Run the Project
Prerequisites
Node.js and npm installed.
Angular CLI installed globally:
npm install -g @angular/cli
Steps to Run
Clone the Repository:

git clone https://github.com/miguelofoliveir/car-store.git
cd car-store
Install Dependencies:

npm install
Start JSON Server (Mock API):

npm run start:json-server
This will run the mock API at http://localhost:3000/.

Start the Angular Application:

npm start
The app will be available at http://localhost:4200/.

🧪 Running Tests
Unit Tests
Run the following command to execute unit tests using Karma:

npm test
📋 Features by User Role
Admin:

Full access to all features.
Manage products, orders, clients, users, and stock.
Seller:

Access to products, orders, and clients.
Limited permissions for specific management actions.
Client:

View-only access to their orders.
📖 Project Structure
car-store/
├── src/
│   ├── app/
│   │   ├── auth/                # Authentication module
│   │   ├── products/            # Products module
│   │   ├── stock/               # Stock module
│   │   ├── orders/              # Orders module
│   │   ├── clients/             # Clients module
│   │   ├── user-role/           # User management module
│   │   ├── dashboard/           # Dashboard with metrics
│   │   ├── shared/              # Shared components and modules
│   └── environments/            # Environment configurations
├── server/                      # Mock API with JSON Server
│   ├── db.json                  # Mock data
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # TailwindCSS configuration
└── README.md                    # Project documentation
🌟 Repository
GitHub Repository

Feel free to explore, contribute, or raise issues! 🚀