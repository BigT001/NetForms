const trackClick = async (linkId) => {
    try {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, timestamp: new Date(), location: await getUserLocation() })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };
  
  const trackFormSubmission = async (formId, completed) => {
    try {
      await fetch('/api/track-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          completed,
          timestamp: new Date(),
          location: await getUserLocation()
        })
      });
    } catch (error) {
      console.error('Failed to track form submission:', error);
    }
  };
  