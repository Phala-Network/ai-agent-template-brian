import { Request, Response, route } from './httpSupport'

async function GET(req: Request): Promise<Response> {
    const secrets = req.secret || {}
    const queries = req.queries
    const brianApiKey = (secrets.brianApiKey) ? secrets.brianApiKey as string : ''
    const query = (queries.chatQuery) ? queries.chatQuery[0] as string : 'What is Brian?'
    let result = {
        input: query,
        answer: ''
    }

    try {
        const response = await fetch('https://api.brianknows.org/api/v0/agent/knowledge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-brian-api-key': `${brianApiKey}`
            },
            body: JSON.stringify({
                prompt: query,
            })
        });
        const responseData = await response.json();
        result.answer = (responseData.result.answer) ? responseData.result.answer as string : 'Failed to fetch answer';
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        result.answer = error as string;
    }

    return new Response(JSON.stringify(result))
}

async function POST(req: Request): Promise<Response> {
    return new Response('Not Implemented')
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
