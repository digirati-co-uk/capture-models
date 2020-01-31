import nano from 'nano';

export const couch = nano({
  url: 'http://localhost:5984',
  requestDefaults: {
    auth: {
      user: 'admin',
      pass: 'password',
    },
  },
});
