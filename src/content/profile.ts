export interface Link {
    label: string;
    url: string;
}

export const profile = {
    user: 'rherber',
    name: 'Ryan Herber',
    tagline: `CS @ UT, 2030`,

    neofetch: [
        { label: 'Role', value: 'CS @ UT Austin, class of 2030' },
        { label: 'Experience', value: 'Platforms Engineering @ Marathon Petroleum' },
        { label: 'Languages', value: 'Java, Python, C, C#, Javascript' },
        { label: 'Tech', value: 'React, Git, PyTorch, AWS, ECS, DynamoDB'},
        { label: 'Interests', value: 'AI/ML, Cloud, Platforms, SWE, Quantum Computing' },
    ],

    email: 'ryandherber@gmail.com',
    links: [
        { label: 'github', url: 'https://github.com/ryandherb' },
        { label: 'linkedin', url: 'https://www.linkedin.com/in/ryandherber' },
    ] as Link[],
};
