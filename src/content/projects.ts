import type { FileContents } from '../features/FileSystem';

export const about: FileContents = {
    title: 'About Me',
    summary: 'RDH-101: Describe who Ryan is in one file.',
    content: `
The name's Herber. Ryan Herber --- Is what I would say if I were cooler. 
I'm a student at UT Austin, majoring in Computer Science with a focus in Artificial Intelligence. 

The world of CS to me is fascinating, and ever since I recieved my first laptop when I was 7, I've always wanted to learn more. 
Today, that mainly looks like taking challenges wherever I can find them. In class and outside, I'm always looking for a new 
opportunity to learn and to grow.

I've completed two internships at USAA, both for software engineering, focusing on React front-end development and intranet solutions, respectively. 
This Summer, I'll be heading to Marathon Petroleum for Platforms Engineering to work on AWS cloud infrastructure, optimization and company-wide resource monitoring.

Like I said, I'm always looking for a new challenge, so feel free to drop one on me! You won't regret it. 
`,
};

export const experience: FileContents = {
    title: 'Experience',
    summary: 'Software Engineering for the User',
    content: `
USAA, San Antonio, TX                            Jun 2026 - Jul 2026
Software Engineering Intern
  - Built and deployed Microsoft Power Platform intranet solutions for an employee population of 38,000.
  - Modified existing company wiki infrastructure to support bulk user permission requests for company wide use.

USAA, San Antonio TX                             Jun 2025 - Jul 2025
Software Engineering Intern
  - Developed and deployed React features for a production environment serving 1.5M+ monthly users.
  - Delivered production code through Agile sprints, GitLab and Git pipelines and peer code reviews.
`,
};



export const flingboar: FileContents = {
    title: 'Flingboar',
    summary: 'YouTube channel focused on educational programming content.',
    meta: {
        role: 'Creator',
        date: 'Jan 2026 - Present',
        stack: ['Java', 'C', 'Python'],
        links: [{ label: 'channel', url: 'https://www.youtube.com/@flingboar3179' }], 
    },
    content: `
I've always been a big fan of educational YouTube channels. From VSauce to 3Blue1Brown, I think that 'edutainment'
through long-form video content is one of the best ways to learn challenging topics. These channels, and my own experience
watching them inspired me to create Flingboar. 

Flingboar was my attempt at copying what made these channels so valuable, all for a world of budding programmers. I wanted anybody,
no matter the skill level or experience, to be able to sit down, watch a Flingboar video and learn something new. 

I made videos on whatever interested me: LLMs, Vocaloids, Programming Language Design, Interpreters, etc. and grew the 
channel to over 3,000 subcribers! I was even able to monetize it, and earn a little money doing something I loved. 

While the channel is currenly on hiatus (due to me being an extremely busy college student, of course), I plan to start making videos again,
and teaching a new generation of programmers.
`,
};

export const degreeAuditPlus: FileContents = {
    title: 'Degree Audit Plus',
    summary: 'An app to help UT Students plan their degree.',
    meta: {
        role: 'Developer Fellow',
        date: 'October 2026 - Present',
        stack: ['React', 'Typescript', 'Bun'],
        links: [{ label: 'Repo', url: 'https://github.com/Longhorn-Developers/Degree-Audit-Plus' }],
    },
    content: `
UT's current Interactive Degree Audit (IDA) platform, has a big problem. Well actually, it'd be fairer to say it has big problems. 

As a Developer Fellow with the Longhorn Developers team, we are always looking for ways to enhance the UT student's experience, and
when we found these problems with IDA, we knew we needed to build something. That "something" was Degree Audit Plus (DAP). 

I joined the Longhorn Developers team this semester, and began work on the DAP subteam. Working on a project that is still in development was a
new experience for me, one which I continue to learn a lot from. Being that the project isn't in production yet, even a new developer fellow such as myself
gets influence in the direction and design of it. Being able to have a say in a project that has a potential user-base of up to 55,000 UT students is a huge
opportunity, and one that I know I must carry with responsability and respect. 
    `,
};

export const nextMove: FileContents = {
    title: 'NextMove',
    summary: 'Helping Toyota Customers find their NextMove',
    meta: {
        role: 'Developer',
        date: 'October 2026',
        stack: ['React', 'Python', 'Muse'],
        links: [{ label: 'Repo', url: 'https://github.com/ryandherb/hacktx-26' }, { label: 'Devpost', url: 'https://devpost.com/software/nextmove-43gfrz' }],
    },
    content: `
NextMove was the winner of second place in the Toyota Financial Services track at HackTX 26.

When our team of four freshman entered HackTX 26, we didn't expect to win anything. Despite our low expectations, we walked away winning second place.
How? An app based off a real problem our teammate, Eni, had. 

Eni had been driving down I-10 when his transmission began to slip. Taking it into the mechanic, 
he got the bad news: a $4,000 repair quote on an already aging car. Now, he had to make a tough decision: What next? 
As a busy college student, he found that decision to be difficult to make. That's why we created NextMove, a tool to help a
Toyota customer in his position answer that question.

Using predictive mathematical modeling, "soft" life-factors and agentic reasoning, we were able to create a tool to help a user
find their best NextMove.
`,
};

export const secret: FileContents = {
    title: '.secret',
    summary: 'you found it',
    content: `
Not many people run ls -a on a portfolio...

Anyways. I think you should hire me. (;
`,
};
