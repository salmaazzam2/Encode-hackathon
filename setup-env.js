const fs = require('fs');
const path = require('path');

console.log('🚀 Dream Visualizer Environment Setup');
console.log('=====================================\n');

// Check if .env already exists
const envPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists in server directory');
  console.log('If you need to update it, please edit server/.env manually\n');
} else {
  console.log('📝 Creating .env file in server directory...');
  
  const envContent = `# OpenAI API Key - Get this from https://platform.openai.com/api-keys
OPENAI_API_KEY=your__here

# MongoDB Atlas Connection String - Replace with your actual connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dream-visualizer?retryWrites=true&w=majority

# Server Port
PORT=5001
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created server/.env file');
  console.log('⚠️  IMPORTANT: You need to edit server/.env and add your actual:');
  console.log('   1. OpenAI API Key (get from https://platform.openai.com/api-keys)');
  console.log('   2. MongoDB Atlas connection string\n');
}

console.log('📋 Next steps:');
console.log('1. Get your OpenAI API key from: https://platform.openai.com/api-keys');
console.log('2. Edit server/.env and replace "your_openai_api_key_here" with your actual API key');
console.log('3. If you have a MongoDB Atlas connection string, replace the MONGODB_URI as well');
console.log('4. Run "npm run dev" again to start the application\n');

console.log('💡 If you don\'t have an OpenAI API key yet:');
console.log('   - Go to https://platform.openai.com/api-keys');
console.log('   - Sign up or log in');
console.log('   - Create a new API key');
console.log('   - Copy the key and paste it in server/.env\n'); 