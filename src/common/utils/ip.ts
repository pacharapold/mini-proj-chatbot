import axios from 'axios';

export const address = async () => {
  const result = await axios.get('https://ifconfig.co/json');
  return result.data ? result.data.ip : null;
};
