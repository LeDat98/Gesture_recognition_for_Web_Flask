# Gesture Recognition for Web Flask

This guide will help you set up the Gesture Recognition for Web Flask project on your local machine.

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/LeDat98/Gesture_recognition_for_Web_Flask.git
   ```
Clones the project repository to your local machine.
2.**Navigate to the project directory**
   ```bash
   cd Gesture_recognition_for_Web_Flask
   ```
3.**Create a Python virtual environment**
   ```bash
   python3 -m venv env
   ```
4.**Activate the virtual environment**
   ```bash
   source env/bin/activate
   ```
5.**nstall required Python packages**
   ```bash
   pip install -r requirements.txt
   ```
6.**Install Node Version Manager (NVM)**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```
   **OR**
   ```bash
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```
7.**Source your shell configuration**
   ```bash
   source ~/.bashrc
   ```
   **OR**
   ```bash
   source ~/.zshrc
   ```
   Reloads your shell configuration.
8.**nvm install v18.17.0**
   Installs Node.js version 18.17.0. or more
   ```bash
   nvm install v18.17.0
   ```
9.**Set default Node.js version in NVM**
   ```bash
   nvm alias default v18.17.0
   ```
10.**Install project npm dependencies**
   Installs npm dependencies defined in package.json.
   ```bash
   npm install
   ```
## Run Gesture Recognition app
After installation, activate your Python virtual environment and start the Flask application using:
**Run this commd**
   ```bash
   python3 app.py
   ```

