const projectsData = [
  {
    title: 'lamora',
    description: `laMora is full stack app based off my last name, Morales. It's meaning is of Spanish decent, given to someone who lived near a blackberry bush, from mora, meaning "blackberry". This app was built to pull data from the ios app (Paprika) which holds Morales family recipes. Using PostgresDB CRON job syncing with Paprika, I'm able to save all of our data coming from the app. Using NestJS node framework, I've created a backend that serves family data to the NEXTJS frontend. This data is used to display full recipes, blog data, and family images. This serves as a lifelong project to hopefully pass down to our children when they become of age and hopefully, continue the tradition and importance of food.`,
    logoSrc: `/static/images/projectCards/logos/logo-lamora.svg`,
    imgSrc: `/static/images/projectCards/port-lamora.png`,
    href: 'https://github.com/kgmorales/lamora',
    deployed: ``,
    tools: [],
  },
  {
    title: 'Surepayroll',
    description: `Catering to the unique needs of small business employees, this software offers a dedicated dashboard for accessing employment records and paystubs. I had the privilege of leading its architectural and mobile UX design phases, employing advanced technologies such as Angular 13 and Node Express.`,
    logoSrc: '/static/images/projectCards/logos/logo-surepayroll.svg',
    href: '',
    deployed: 'https://www.surepayroll.com/',
    tools: [],
    embedId: `e333zoxvyqg`,
  },
  {
    title: 'Recipeek',
    description: `Recognizing the challenges many face with intrusive advertisements on recipe websites, I developed an application that streamlines the search process for recipes. This app integrates both a recipe API and YouTube's API to provide users with not only the recipe content but also corresponding video tutorials. I personally undertook the initiative to learn and utilize React & React Hooks for its development and subsequently hosted it on Netlify for seamless access.`,
    logoSrc: '/static/images/projectCards/logos/logo-recipeek.svg',
    imgSrc: '/static/images/projectCards/port-recipeek.png',
    href: 'https://github.com/kgmorales/recipeek.io',
    deployed: 'https://recipeek.io',
    tools: [],
  },
  {
    title: 'Code Red Safety',
    description: `The company acknowledged the absence in its online presence, and I assumed the lead role. From the initial design phase to the final rollout and subsequent optimizations. I traveled the country with a colleague, capturing photos, videos, and conducting interviews. In parallel, I architected our digital social platforms, streamlined content delivery, and spearheaded our digital marketing campaigns. This systematic and technical approach resulted in a notable surge of $300k in sales within four months.`,
    logoSrc: '/static/images/projectCards/logos/codered-logo.svg',
    imgSrc: '/static/images/projectCards/port-codered.png',
    href: '',
    deployed: 'https://coderedsafety.com',
    tools: [],
  },
  {
    title: 'PetAg',
    description: `PetAg's website was developed to showcase and inform users about its products. Extensive research was conducted to ensure the design and UX catered to key target groups. In the process, I expanded my technical skills with CRAFT CMS and the 'twig' templating engine. This project also marked my first experience with Foundation 6, allowing me to delve into the nuances of the framework and master its features.`,
    logoSrc: '/static/images/projectCards/logos/logo-petag.svg',
    imgSrc: '/static/images/projectCards/port-petag.png',
    href: '',
    deployed: 'https://petag.com',
    tools: [],
  },
  {
    title: 'Combustion Research Center',
    description: `Developing this micro-site was both enjoyable and a great learning experience. While it was a relatively compact site, it provided ample opportunity to experiment with various UX/UI functionalities. The project specifications required the use of the Foundation 5 Framework.`,
    logoSrc: '/static/images/projectCards/logos/logo-crc.svg',
    imgSrc: '/static/images/projectCards/port-crc.png',
    href: '',
    deployed: 'https://combustionresearchcenter.com/',
    tools: [],
  },
  {
    title: 'Sikich',
    description: `The primary goal for this site was to effectively organize a vast amount of content. The previous site was outdated and required a complete overhaul. Considering the need for easy content management and future maintenance by the internal team, Wordpress CMS was chosen as the platform for its development and deployment.`,
    logoSrc: '/static/images/projectCards/logos/logo-sikich.svg',
    imgSrc: '/static/images/projectCards/port-sikich.png',
    href: '',
    deployed: 'https://www.sikich.com/',
    tools: [],
  },
  {
    title: 'MOL',
    description: `Faced with a stringent deadline, I was tasked with developing a front-end-only site that was subsequently handed off to another development firm for integration into a custom CMS. To facilitate their work, I provided detailed documentation outlining the code's functionality. Despite the tight timeframe, I successfully delivered on all project requirements, including accommodating last-minute changes.`,
    logoSrc: '/static/images/projectCards/logos/logo-mol.svg',
    imgSrc: '/static/images/projectCards/port-mol.png',
    href: '',
    deployed: 'https://www.mol.co.jp/en/',
    tools: [],
  },
  {
    title: 'ChatApp',
    description: `For this chat application I developed, I employed React.js for the frontend interface. On the backend, Node.js and Express.js were instrumental. The real-time communication feature was made possible using Socket.IO, enabling instantaneous message exchanges and deepening my grasp on socket connections.`,
    imgSrc: '/static/images/projectCards/socket.jpg',
    href: 'https://github.com/kgmorales/chat/tree/master',
    deployed: 'https://loving-ardinghelli-edf78b.netlify.app/',
    tools: [],
  },
  {
    title: 'Morales Wedding',
    description: `For my wedding, I opted for a more modern and efficient approach. Instead of incurring costs on RSVP cards, mailings, and managing hotel schedules, I designed a website. This not only resulted in cost savings but also provided a centralized and accessible platform for guests to access all pertinent information.`,
    imgSrc: '/static/images/projectCards/port-morales-wedding.png',
    href: 'https://github.com/kgmorales/morales-wedding',
    deployed: 'https://morales-wedding.com',
    tools: [],
  },
]

export default projectsData
