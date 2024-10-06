import axios from 'axios'

const sendPrompt = async (data) => {
    try {
        const result = await axios.post('http://localhost:5000/api/v1/chat', {
            data: data
        });
        const dat = result.data
        console.log('result from the api', dat)
        return dat

    } catch (error) {
        console.error('Error making POST request:', error);
    }

}

export default sendPrompt