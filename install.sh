# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
git clone https://github.com/csecsoliver/HumanJIT
cd HumanJIT
cd backend
npm i
npx tsx index.ts

