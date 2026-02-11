const axios = require('axios');
require('dotenv').config();

const getLanguageById = (lang) => {

    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };

    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Submit Error:",
                error.response?.data || error.message
            );
            return null;
        }
    }

    return await fetchData();
};

// ✅ FIXED waiting function
const waiting = (timer) => {
    return new Promise((resolve) =>
        setTimeout(resolve, timer)
    );
};

const submitToken = async (resultToken) => {

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Fetch Error:",
                error.response?.data || error.message
            );
            return null;
        }
    }

    while (true) {

        const result = await fetchData();

        if (!result || !result.submissions) {
            return null;
        }

        const isResultObtained = result.submissions.every(
            (r) => r.status && r.status.id > 2
        );

        if (isResultObtained)
            return result.submissions;

        await waiting(1000);
    }
};

module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};
