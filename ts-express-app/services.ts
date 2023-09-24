import axios from 'axios';

export const testService1 = async (url: any) => {
  let data;
  let status;
  try {
    // const response = await axios.get('http://localhost:3000/health');
    const response = await axios.get(url);
    data = response.data;
    status = response.status;
    console.log(JSON.stringify(data));
    console.log('response status is: ', status);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
    data = error.message;
  }
  return {
    status,
    data,
  };
};
