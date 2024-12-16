const express = require('express');
const router = express.Router();

router.get('/analytics', async (req, res) => {
  try {
    const analytics = {
      clicks: await getClickAnalytics(),
      formCompletions: await getFormCompletions(),
      locations: await getLocationData(),
      forms: await getFormList()
    };
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
