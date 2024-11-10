export default () => ({
  QUESTION_SERVICE_URL:
    process.env.QUESTION_SERVICE_URL || 'http://localhost:3001',
  GAME_SERVICE_URL: process.env.GAME_SERVICE_URL || 'http://localhost:3002',
});
