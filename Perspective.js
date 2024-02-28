const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

const perspectiveApiKey = 'AIzaSyAuzo1Gi9xUOJJ790SkMh-wveNqS0DoFUQ';
const perspectiveApiUrl = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

app.post('/analyse-content', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).send({ error: 'Content is required for analysis' });
    }

    try {
        const perspectiveResponse = await axios.post(perspectiveApiUrl, {
            comment: { text: content },
            languages: ["en"], // Specify the language of the content
            requestedAttributes: { TOXICITY: {} }
        }, {
            params: {
                key: perspectiveApiKey
            },
            headers: { 'Content-Type': 'application/json' }
        });

        const toxicityScore = perspectiveResponse.data.attributeScores.TOXICITY.summaryScore.value;
        res.send({ score: toxicityScore });
    } catch (error) {
        console.error('Error analyzing content with Perspective API:', error);
        res.status(500).send({ error: 'Error analyzing content' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
