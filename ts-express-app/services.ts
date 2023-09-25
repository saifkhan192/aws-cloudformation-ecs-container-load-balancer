import axios from 'axios';

export const callService = async (url: any): Promise<any> => {
  // url = 'https://jsonplaceholder.typicode.com/todos/1';
  let data = null;
  let status = 0;
  try {
    const response = await axios.request({
      method: 'GET',
      url,
      timeout: 4000,
      // validateStatus: () => true,
    });
    data = response.data;
    status = response.status;
    console.log(JSON.stringify(data));
    console.log('status:', status);
    return data;
  } catch (error) {
    data = error.message;
    status = error?.response?.status || -1;
    console.log('status:', status);
    console.log('axios:error: ', data);
  }
  return {
    status,
    data,
  };
};
