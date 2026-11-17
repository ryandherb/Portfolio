import type { VercelRequest, VercelResponse } from '@vercel/node';

const QUERY = `query($login: String!){
    user(login: $login) {
        contributionsCollection {
            contributionCalendar {
                totalContributions
                weeks { contributionDays { contributionCount date } }
            }
        }
    }
}`;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not set' });

    const r = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: QUERY, variables: { login: 'ryandherb' } }),
    })
    const json = await r.json(); 
    if(!r.ok || json.errors) return res.status(502).json({error: 'Github API error'});

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    return res.json(json.data.user.contributionsCollection.contributionCalendar);
}